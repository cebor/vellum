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
/* sharp is imported where it is used, at the head of the --fixtures branch, and
 * that is the whole point of it being a devDependency: taking a review shot
 * needs only playwright-core, and `npm install --omit=dev` has to leave a
 * harness that reviews fine and cannot regenerate the fixtures. A static import
 * here made that claim false in the strongest way -- the module is resolved
 * before any of this file runs, so an --omit=dev checkout died with
 * ERR_MODULE_NOT_FOUND before opening a browser, and every ordinary review round
 * was unavailable on exactly the install the comment described.
 *
 * It is needed at all because Chrome cannot encode what these images need.
 * canvas.toDataURL('image/webp', 1) is WebP quality 100 and still lossy, and
 * hairline rules, frame edges and tracked lettering are exactly the subject that
 * smears under it -- on the one image that has to prove the theme draws cleanly.
 * sharp does lossless WebP.
 *
 * Nothing about this rides into a consuming site: node_modules/ is ignored, so
 * a module download takes package.json and package-lock.json and no more. */

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
    /* The demo's docs section. /docs/icons/ is the only page that builds every
     * branch of icon.html, including the unknown-name fallback, so it is the
     * only place a broken glyph would show up in a review round at all. */
    ['docs', '/en/docs/'],
    ['docs-icons', '/en/docs/icons/'],
    ['docs-landing', '/en/docs/the-landing-page/'],
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
const FIXTURE_VIEWPORT = { width: 1500, height: 1000 };
/* The two halves of the print comparison. Both are 3:4, which is what a half of
 * the 3:2 gallery frame is, so each fills its side exactly and neither has to be
 * letterboxed or cropped to fit.
 *
 * The screen half is 1000 wide and cannot go much below it: --frame-collapse is
 * 60rem, so a narrower viewport gives the collapsed layout and the comparison
 * would be against a page the desktop reader never sees. The paper half is near
 * A4's 794x1123 at 96dpi, because a print stylesheet stretched across 1500px is
 * not what anyone's printer does with it. */
const SCREEN_VIEWPORT = { width: 1000, height: 1333 };
const PAPER_VIEWPORT = { width: 900, height: 1200 };

/* Two formats, and the split is not a preference. themes.gohugo.io accepts only
 * .png/.jpg, so the registry pair has to stay PNG; the README is served to a
 * browser and is free, so everything it loads is lossless WebP -- same pixels,
 * roughly a third of the bytes. That matters more here than page weight: every
 * tracked byte is downloaded by every site that runs `hugo mod get` on this
 * theme, which is the same argument that keeps .claude/ untracked.
 *
 * `anchor` scrolls a selector to the top of the viewport before the shot, so a
 * gallery frame is composed on the thing it is meant to show rather than on a
 * pixel offset that drifts the moment the content above it changes.
 * `media: 'print'` shoots through the print stylesheet. */
const fixtures = [
    { file: 'images/screenshot.png', path: FIXTURE_HERO, scheme: 'split', dsf: 1 },
    /* 900x600 out of the same 1500x1000 layout: a sub-1 DPR scales the raster
     * without moving a single breakpoint, so the thumbnail is the screenshot
     * rather than a second, differently-composed shot of the same page. */
    { file: 'images/tn.png', path: FIXTURE_HERO, scheme: 'split', dsf: 0.6 },
    { file: 'images/hero-light.webp', path: FIXTURE_HERO, scheme: 'light', dsf: 1 },
    { file: 'images/hero-dark.webp', path: FIXTURE_HERO, scheme: 'dark', dsf: 1 },

    /* The README gallery. Each one exists because the README makes a claim there
     * that prose alone cannot settle.
     *
     * Genuine pairs, not splits -- for the reason stated above the hero, which
     * applies to every README image and only stops applying at the registry: a
     * <picture> hands each reader the right variant at full width, and the
     * gallery is read in the README. Two of them could not be split anyway. A
     * split's seam has to fall where only paper and ink change, and the icon
     * grid's cell rules land wherever they land, so a 50% cut bisects a cell and
     * truncates its name. The terminal is worse: it is animated and measures its
     * own window, so two loads are two different states and the composite would
     * show a filled window beside an empty one. */
    { file: 'images/gallery-terminal-light.webp', path: '/de/', scheme: 'light', dsf: 1, anchor: '.term', click: '.term__cmd:text-is("skills")' },
    { file: 'images/gallery-terminal-dark.webp', path: '/de/', scheme: 'dark', dsf: 1, anchor: '.term', click: '.term__cmd:text-is("skills")' },
    { file: 'images/gallery-icons-light.webp', path: '/en/docs/icons/', scheme: 'light', dsf: 1, anchor: '.icon-sheet' },
    { file: 'images/gallery-icons-dark.webp', path: '/en/docs/icons/', scheme: 'dark', dsf: 1, anchor: '.icon-sheet' },
    /* "A dedicated print stylesheet, not an afterthought" was the one claim in
     * the README no reader could check, and it is the one frame that cannot be
     * a plain screenshot of the result.
     *
     * 95-print.css forces color-scheme: light and a white ground whatever the
     * reader chose, because paper is not a surface the screen palette was
     * contrast-checked against. There is therefore no dark rendering of the
     * printed page: a light/dark pair of it is the same image twice. Mounting the
     * sheet on a dark field was tried and does not work either -- the field was
     * 59% of the frame and the thing still read as a white block, because a white
     * sheet on dark reads bright whatever surrounds it.
     *
     * So the frame shows the change instead of the result: the page on screen
     * beside the same page on paper. The left half is the reader's own scheme,
     * which is what makes the dark variant actually dark, and the comparison is
     * the more useful image anyway -- it shows what the stylesheet *does*, which
     * a picture of the output alone never did. Chrome and rail gone, the ink
     * re-set, the title block heavier. */
    { file: 'images/gallery-print-light.webp', path: '/en/posts/reading-a-sheet/', scheme: 'light', dsf: 1, compare: true },
    { file: 'images/gallery-print-dark.webp', path: '/en/posts/reading-a-sheet/', scheme: 'dark', dsf: 1, compare: true },
];

/* PNG in, the tracked format out, dimensions untouched. Handed sharp rather
 * than reaching for it, so this file has no module-scope dependency on it. */
const encode = (sharp, file, buf) => file.endsWith('.webp')
    ? sharp(buf).webp({ lossless: true, effort: 6 }).toBuffer()
    : sharp(buf).png({ compressionLevel: 9, effort: 10 }).toBuffer();

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

/* Resolved before the browser is launched, so a checkout without the
 * devDependency is told in a second what it is missing and how to get it,
 * rather than after ten frames have been shot and cannot be written. */
let sharp = null;
if (FIXTURES) {
    try {
        sharp = (await import('sharp')).default;
    } catch {
        console.error('--fixtures needs sharp, a devDependency of this harness.');
        console.error('Install it with:  npm install --prefix .parity');
        process.exit(2);
    }
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
    const shoot = async (label, path, scheme, dsf, anchor, media, viewport, click) => {
        const ctx = await browser.newContext({
            viewport: viewport || FIXTURE_VIEWPORT,
            colorScheme: scheme,
            deviceScaleFactor: dsf,
            /* Not a stylistic choice — it is what makes a fixture a fixture.
             * 10-base.css turns on scroll-behavior: smooth under
             * no-preference, so an anchored scroll would still be in flight
             * when the shutter falls; and the terminal types its output a
             * character at a time, so two loads of /de/ are two different
             * states. Under reduce both settle instantly and the same frame
             * comes out every run. The content is identical either way: the
             * theme's reduced-motion path shows the finished session, it does
             * not show less of it. */
            reducedMotion: 'reduce',
        });
        const page = await ctx.newPage();
        let buf = null;
        if (await visit(page, label, path)) {
            /* Emulated before settle(), so the fonts and images that settle()
             * waits on are the ones the print sheet actually asks for. */
            if (media) await page.emulateMedia({ media });
            await settle(page);
            if (click) {
                /* Staging, not faking. The terminal opens on `help` and 24 rows,
                 * so a frame of it untouched is a third of a window and
                 * two-thirds of an empty field — a picture of the chrome rather
                 * than of the thing. This runs one of the commands the window
                 * itself offers as a button, which is what a visitor does with
                 * it, and under reducedMotion the output lands at once instead
                 * of being typed, so the frame is the same every run. */
                const target = page.locator(click);
                if (!await target.count()) {
                    failures.push(`${label} ${path} — nothing matches ${click}`);
                    await ctx.close();
                    return null;
                }
                await target.first().click();
                await page.waitForTimeout(400);
            }
            if (anchor) {
                /* A missing anchor is a composition silently taken on whatever
                 * happened to be at the top of the page — the same class of
                 * quiet wrong as a stale route, so it fails the round instead. */
                const found = await page.evaluate(sel => {
                    const el = document.querySelector(sel);
                    if (!el) return false;
                    /* .header is sticky, so scrolling the anchor to y=0 parks
                     * it underneath the header instead of below it. */
                    const head = document.querySelector('.header');
                    const offset = head ? head.getBoundingClientRect().height : 0;
                    /* Plus a little air, so the anchored element's own top rule
                     * is inside the frame rather than flush against the header
                     * and shaved off by it. */
                    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - offset - 24);
                    return true;
                }, anchor);
                if (!found) {
                    failures.push(`${label} ${path} — no element matches ${anchor}`);
                    await ctx.close();
                    return null;
                }
                await page.waitForTimeout(200);
            }
            /* A fixture must not carry a state nobody asked for. After a
             * click the pointer is still resting on what it hit and the focus
             * ring is still on it, so the frame shows one control lit up for
             * reasons that are about the harness rather than the theme. Park
             * the pointer off-canvas and drop focus before the shutter. */
            await page.mouse.move(0, 0);
            await page.evaluate(() => document.activeElement?.blur());
            await page.waitForTimeout(150);

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
    const capture = (label, path, scheme, dsf, anchor, media, viewport, click) => {
        const vp = viewport || FIXTURE_VIEWPORT;
        const key = `${path}|${scheme}|${dsf}|${anchor || ''}|${media || ''}|${vp.width}x${vp.height}|${click || ''}`;
        if (!cache.has(key)) cache.set(key, shoot(label, path, scheme, dsf, anchor, media, viewport, click));
        return cache.get(key);
    };

    /* Both sources always at DPR 1: the composite carries the fixture's own
     * scale, and a source shot at 0.6 would have nothing left to scale down. */
    const frames = (label, path, anchor, media) => Promise.all([
        capture(label, path, 'light', 1, anchor, media),
        capture(label, path, 'dark', 1, anchor, media),
    ]);

    /* Composited by the browser that is already open rather than by sharp, which
     * is now on hand and could do it. Keeping it here is not inertia: the halves
     * have to line up on a seam that runs through the header rule, the frame's
     * top edge and every title-block row rule, and the browser is what laid those
     * out in the first place. The two frames go in as data URIs and the dark one
     * is clipped to the right half; settle() forces the decode before the shot.
     * sharp's job is the encode at the end, where the pixels are already fixed. */
    /* Screen beside paper, in the gallery's 3:2. Both sources are 3:4 and each
     * half is 3:4, so they scale to fill without a crop or a letterbox, and the
     * seam is a hairline rather than a gap -- a gap would read as two pictures,
     * and this is one. */
    const sideBySide = async (screen, paper) => {
        const ctx = await browser.newContext({ viewport: FIXTURE_VIEWPORT, deviceScaleFactor: 1 });
        const page = await ctx.newPage();
        const { width, height } = FIXTURE_VIEWPORT;
        const half = width / 2;
        await page.setContent(`<!doctype html>
<style>
  html, body { margin: 0; padding: 0; }
  .pair { display: flex; width: ${width}px; height: ${height}px; overflow: hidden; }
  .pair img { display: block; width: ${half}px; height: ${height}px; }
  .pair .paper { border-left: 1px solid rgba(128, 128, 128, 0.45); }
</style>
<div class="pair">
  <img src="data:image/png;base64,${screen.toString('base64')}">
  <img class="paper" src="data:image/png;base64,${paper.toString('base64')}">
</div>`, { waitUntil: 'load' });
        await settle(page);
        const buf = await page.screenshot({ fullPage: false });
        await ctx.close();
        return buf;
    };

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

    for (const { file, path, scheme, dsf, anchor, media, viewport, click, compare } of fixtures) {
        if (scheme === 'split') {
            const [light, dark] = await frames(file, path, anchor, media);
            if (light && dark) captured.push([file, await composite(light, dark, dsf)]);
            continue;
        }
        if (compare) {
            /* The paper half is identical for both variants and comes out of the
             * cache the second time round; only the screen half varies. */
            const [screen, paper] = await Promise.all([
                capture(file, path, scheme, 1, null, null, SCREEN_VIEWPORT, null),
                capture(file, path, 'light', 1, null, 'print', PAPER_VIEWPORT, null),
            ]);
            if (screen && paper) captured.push([file, await sideBySide(screen, paper)]);
            continue;
        }
        const buf = await capture(file, path, scheme, dsf, anchor, media, viewport, click);
        if (buf) captured.push([file, buf]);
    }

    await browser.close();

    if (captured.length === fixtures.length) {
        for (const [file, buf] of captured) {
            const out = await encode(sharp, file, buf);
            writeFileSync(file, out);
            console.log(`    ${file}  ${(out.length / 1024).toFixed(0)} KB`);
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
