/* Batched screenshot round for a theme review, and the registry/README fixtures.
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
 * Usage, with the theme's dev server already running — the one command README
 * and CONTRIBUTING document, on Hugo's default port:
 *
 *   hugo server -D --source exampleSite --themesDir ../..
 *   node .parity/shots.mjs              # all pages, both viewports, both schemes
 *   node .parity/shots.mjs home search  # only the named pages
 *   node .parity/shots.mjs --fixtures   # regenerate images/ — see FIXTURES below
 *
 * Set VELLUM_SHOTS_PORT to point at a server on another port. It used to insist
 * on 1319, which no documented command ever starts, so running the documented
 * command and then this script failed on every route.
 */
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = `http://localhost:${process.env.VELLUM_SHOTS_PORT || 1313}`;
const OUT = '.impeccable/review';
const BUNDLED = `${process.env.HOME}/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome`;

/* Routes into exampleSite, which is the only site in this repo and therefore
 * the only thing a review can be taken against. Each entry is asserted to
 * return its expected status before it is shot.
 *
 * That assertion is not decoration. An earlier version of this list had gone
 * stale, so `post-code`, `post-table`, `post-images` and `de-post` were quietly
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
    /* The zone rail is the theme's signature surface and had no shot of its
     * own; the paginated list is the only place the pager renders at all. */
    ['post-zones', '/en/posts/the-zone-rail/'],
    ['list-paged', '/en/posts/page/2/'],
    ['de-home', '/de/'],
    ['de-list', '/de/posts/'],
    ['de-post', '/de/posts/ein-blatt-lesen/'],
    ['de-ai', '/de/posts/code-und-terminalausgabe/'],
    ['de-only', '/de/posts/nur-auf-deutsch/'],
    ['notfound', '/en/nope/deep/path/', 404],
];

const viewports = [
    ['desktop', 1280, 900],
    ['mobile', 390, 844],
];

/* The four tracked PNGs under images/, which until now were cut by hand from a
 * review round — CLAUDE.md said to regenerate them "the way shots.mjs takes its
 * shots", which this script could not actually do: it only ever wrote 1280x900
 * fullPage frames into a gitignored directory.
 *
 * Every one of them is a viewport clip, never fullPage: themes.gohugo.io accepts
 * 3:2 only, and a fullPage frame is whatever height the page happens to be. The
 * viewport *is* the composition here.
 *
 * All four are this one post. It is what the README hero has always shown: the
 * home page has no zone rail to letter and only the short list-page title block,
 * so the one image an evaluator sees left out both of the things the theme exists
 * for. On this post the top 1000px carry the full title block, rail letter A and
 * a highlighted code block.
 *
 * The registry pair is a 'split': one frame carrying both schemes, light left of
 * the centre line and dark right of it. The gallery shows exactly one image per
 * theme, so a light-only preview was the only picture of Vellum an evaluator saw
 * and it did not say the dark scheme existed. The cut is vertical because both
 * halves are the same page at the same viewport — the header rule, the frame's
 * top edge and every title-block row rule run unbroken through the seam, and only
 * the paper and the ink change. A diagonal would slice each of those at an angle,
 * which is the one thing a drawing must not do.
 *
 * The split is also why the registry pair moved off the home page, which it had
 * used until then. What a split needs is content either side of the centre line,
 * and the home page has none to give: its profile, its buttons and its post
 * titles all sit in the left half, so the dark half came out an all but empty
 * field that reads as a broken image at thumbnail size. This post's title block,
 * body text and code block all run past the centre.
 *
 * The README hero stays a genuine pair rather than a split: its <picture> already
 * hands each reader the right variant at full width. */
const FIXTURE_HERO = '/en/posts/code-and-terminal-output/';
const fixtures = [
    /* file, path, scheme, deviceScaleFactor */
    ['images/screenshot.png', FIXTURE_HERO, 'split', 1],
    /* 900x600 out of the same 1500x1000 layout: a sub-1 DPR scales the raster
     * without moving a single breakpoint, so the thumbnail is the screenshot
     * rather than a second, differently-composed shot of the same page. */
    ['images/tn.png', FIXTURE_HERO, 'split', 0.6],
    ['images/hero-light.png', FIXTURE_HERO, 'light', 1],
    ['images/hero-dark.png', FIXTURE_HERO, 'dark', 1],
];
const FIXTURE_VIEWPORT = { width: 1500, height: 1000 };

const argv = process.argv.slice(2);
const FIXTURES = argv.includes('--fixtures');
const wanted = argv.filter(a => a !== '--fixtures');
const args = ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'];

if (FIXTURES && wanted.length) {
    console.error('--fixtures shoots its own fixed set; it takes no page names');
    process.exit(2);
}

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

const failures = [];

/* Shooting a 404 under the name of a real page is worse than not shooting it:
 * the round reports a count, the file exists, and the surface looks reviewed.
 * For the fixtures the same frame would reach a tag, because release.sh's
 * check_png reads the IHDR and cannot tell a themed 404 from a home page. */
async function visit(page, label, path, expect = 200) {
    const res = await page.goto(BASE + path, { waitUntil: 'load' })
        .catch(err => { failures.push(`${label} ${path} — ${err.message}`); return null; });
    if (!res) return false;
    if (res.status() !== expect) {
        failures.push(`${label} ${path} — HTTP ${res.status()}, expected ${expect}`);
        return false;
    }
    return true;
}

/* fullPage uses captureBeyondViewport, which re-renders the page without the
 * scroll state, so `loading="lazy"` images below the fold shoot as empty boxes
 * however far you scrolled first. Force them eager and wait for decode instead. */
async function settle(page) {
    await page.evaluate(() => document.fonts.ready).catch(() => { });
    await page.evaluate(async () => {
        await Promise.all([...document.images].map(i => {
            i.loading = 'eager';
            if (i.complete && i.naturalWidth) return null;
            return new Promise(r => { i.onload = i.onerror = r; });
        }));
        await Promise.all([...document.images].map(i => i.decode().catch(() => { })));
    }).catch(() => { });
    await page.waitForTimeout(300);
}

const browser = await launch();
let shots = 0;

if (FIXTURES) {
    /* Every frame is captured to a buffer first and written only once all four
     * have succeeded. A half-regenerated images/ is the worst outcome here:
     * three fresh frames and one stale one look exactly like four fresh ones. */
    const captured = [];

    /* One route in one scheme, at the fixture viewport. Returns the PNG buffer,
     * or null once visit() has already recorded why not. */
    const shoot = async (label, path, scheme, dsf) => {
        const ctx = await browser.newContext({
            viewport: FIXTURE_VIEWPORT,
            colorScheme: scheme,
            deviceScaleFactor: dsf,
        });
        const page = await ctx.newPage();
        let buf = null;
        if (await visit(page, label, path)) {
            await settle(page);
            buf = await page.screenshot({ fullPage: false });
        }
        await ctx.close();
        return buf;
    };

    /* Every frame is shot at most once. screenshot.png and tn.png are the same
     * composition at two rasters and must share one pair of source frames — shot
     * separately, the two files could disagree over anything the page decides per
     * load. The hero pair is that same pair, so it comes out of the same cache:
     * the whole round is two page loads, and the composite's halves are provably
     * the heroes rather than merely another shot of them. */
    const cache = new Map();
    const capture = (label, path, scheme, dsf) => {
        const key = `${path}|${scheme}|${dsf}`;
        if (!cache.has(key)) cache.set(key, shoot(label, path, scheme, dsf));
        return cache.get(key);
    };

    /* Both sources always at DPR 1: the composite carries the fixture's own
     * scale, and a source shot at 0.6 would have nothing left to scale down. */
    const frames = (label, path) => Promise.all([
        capture(label, path, 'light', 1),
        capture(label, path, 'dark', 1),
    ]);

    /* Composited by the browser that is already open, rather than by an image
     * library: the harness vendors playwright-core and nothing else, and anything
     * vendored here rides into every consuming site's module cache with the
     * theme. The two frames go in as data URIs and the dark one is clipped to the
     * right half; settle() forces the decode before the shot. */
    const composite = async (light, dark, dsf) => {
        const ctx = await browser.newContext({
            viewport: FIXTURE_VIEWPORT,
            deviceScaleFactor: dsf,
        });
        const page = await ctx.newPage();
        const { width, height } = FIXTURE_VIEWPORT;
        await page.setContent(`<!doctype html>
<style>
  html, body { margin: 0; padding: 0; }
  .sheet { position: relative; overflow: hidden;
           width: ${width}px; height: ${height}px; }
  .sheet img { position: absolute; inset: 0; display: block;
               width: ${width}px; height: ${height}px; }
  .sheet .dark { clip-path: inset(0 0 0 50%); }
</style>
<div class="sheet">
  <img src="data:image/png;base64,${light.toString('base64')}">
  <img class="dark" src="data:image/png;base64,${dark.toString('base64')}">
</div>`, { waitUntil: 'load' });
        await settle(page);
        const buf = await page.screenshot({ fullPage: false });
        await ctx.close();
        return buf;
    };

    for (const [file, path, scheme, dsf] of fixtures) {
        if (scheme === 'split') {
            const [light, dark] = await frames(file, path);
            if (light && dark) captured.push([file, await composite(light, dark, dsf)]);
            continue;
        }
        const buf = await capture(file, path, scheme, dsf);
        if (buf) captured.push([file, buf]);
    }

    await browser.close();

    if (captured.length === fixtures.length) {
        for (const [file, buf] of captured) {
            writeFileSync(file, buf);
            console.log(`    ${file}`);
            shots++;
        }
    }
    console.log(`wrote ${shots} fixture(s) into images/`);
} else {
    mkdirSync(OUT, { recursive: true });

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
                if (!await visit(page, name, path, expect)) continue;

                await settle(page);
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
}

if (failures.length) {
    console.error(`\n${failures.length} route(s) did not resolve as expected:`);
    for (const f of [...new Set(failures)]) console.error(`    ${f}`);
    console.error('\nNo screenshot was written for these — fix the route or the content.');
    process.exit(1);
}
