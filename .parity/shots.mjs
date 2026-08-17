/* Batched screenshot round for a theme review.
 *
 * Self-contained: launches a local headless Chrome itself, so nothing has to be
 * started by hand first. Prefers the system google-chrome and falls back to the
 * Chromium that ships with Playwright.
 *
 * Both need libnspr4/libnss3 and friends, which `apt install google-chrome-stable`
 * pulls in as dependencies — that is what unblocked the bundled Chromium too.
 *
 * Driving the Windows-side chrome.exe over CDP also works in WSL, but renders
 * every page 15px narrower than the requested viewport because the Windows
 * scrollbar eats into it — which quietly falsifies exactly the mobile captures a
 * responsive review depends on. Local Chrome gives a true 390px.
 *
 * Usage, with `hugo server -D --port 1319` already running:
 *   node .parity/shots.mjs              # all pages, both viewports, both schemes
 *   node .parity/shots.mjs home search  # only the named pages
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const BASE = 'http://localhost:1319';
const OUT = '.impeccable/review';
const BUNDLED = `${process.env.HOME}/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome`;

mkdirSync(OUT, { recursive: true });

/* Routes into exampleSite, which is the only site in this repo and therefore
 * the only thing a review can be taken against. Each entry is asserted to
 * return its expected status before it is shot.
 *
 * That assertion is not decoration. This list was inherited from the site the
 * theme was extracted from and kept pointing at four of that site's posts, so
 * `post-code`, `post-table`, `post-images` and `de-post` had been quietly
 * shooting the 404 page under those names — the three surfaces the theme
 * exists to get right went unreviewed for as long as nobody opened the PNGs.
 * A route that stops resolving now fails the run instead. */
const pages = [
    ['home', '/en/'],
    ['list', '/en/posts/'],
    ['post-code', '/en/posts/code-and-terminal-output/'],
    ['post-table', '/en/posts/reading-a-sheet/'],
    ['post-images', '/en/posts/writing-with-shortcodes/'],
    ['archive', '/en/archive/'],
    ['tags', '/en/tags/'],
    ['tag', '/en/tags/reference/'],
    ['search', '/en/search/'],
    ['post-ai', '/en/posts/multilingual-by-design/'],
    ['de-post', '/de/posts/ein-blatt-lesen/'],
    ['de-ai', '/de/posts/code-und-terminalausgabe/'],
    ['de-only', '/de/posts/nur-auf-deutsch/'],
    ['notfound', '/en/nope/deep/path/', 404],
];

const viewports = [
    ['desktop', 1280, 900],
    ['mobile', 390, 844],
];

const wanted = process.argv.slice(2);
const args = ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'];

/* A misspelt page name would otherwise capture nothing and still report
 * success, which is the same quiet failure as a stale route. */
const unknown = wanted.filter(w => !pages.some(([name]) => name === w));
if (unknown.length) {
    console.error(`unknown page name(s): ${unknown.join(', ')}`);
    console.error(`known: ${pages.map(([name]) => name).join(', ')}`);
    process.exit(2);
}

async function launch() {
    try {
        return await chromium.launch({ channel: 'chrome', args });
    } catch {
        return await chromium.launch({ executablePath: BUNDLED, args });
    }
}

const browser = await launch();
let shots = 0;
const failures = [];

for (const [vpName, width, height] of viewports) {
    for (const scheme of ['light', 'dark']) {
        const ctx = await browser.newContext({
            viewport: { width, height },
            colorScheme: scheme,
            deviceScaleFactor: 1,
        });
        const page = await ctx.newPage();

        for (const [name, path, expect = 200] of pages) {
            if (wanted.length && !wanted.includes(name)) continue;

            const res = await page.goto(BASE + path, { waitUntil: 'load' })
                .catch(err => { failures.push(`${name} ${path} — ${err.message}`); return null; });
            if (!res) continue;

            /* Shooting a 404 under the name of a real page is worse than not
             * shooting it: the round reports a count, the file exists, and the
             * surface looks reviewed. Skip the shot and fail the run. */
            if (res.status() !== expect) {
                failures.push(`${name} ${path} — HTTP ${res.status()}, expected ${expect}`);
                continue;
            }

            await page.evaluate(() => document.fonts.ready).catch(() => { });

            /* fullPage uses captureBeyondViewport, which re-renders the page
             * without the scroll state, so `loading="lazy"` images below the
             * fold shoot as empty boxes however far you scrolled first. Force
             * them eager and wait for decode instead. */
            await page.evaluate(async () => {
                await Promise.all([...document.images].map(i => {
                    i.loading = 'eager';
                    if (i.complete && i.naturalWidth) return null;
                    return new Promise(r => { i.onload = i.onerror = r; });
                }));
                await Promise.all([...document.images].map(i => i.decode().catch(() => { })));
            }).catch(() => { });

            await page.waitForTimeout(300);
            await page.screenshot({
                path: `${OUT}/${vpName}-${scheme}-${name}.png`,
                fullPage: true,
            });
            shots++;
        }
        await ctx.close();
    }
}

await browser.close();
console.log(`captured ${shots} screenshot(s) into ${OUT}/`);

if (failures.length) {
    console.error(`\n${failures.length} route(s) did not resolve as expected:`);
    for (const f of [...new Set(failures)]) console.error(`    ${f}`);
    console.error('\nNo screenshot was written for these — fix the route or the content.');
    process.exit(1);
}
