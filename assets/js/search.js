import * as params from "@params";

(function () {
    var input = document.getElementById("search-input");
    var results = document.getElementById("search-results");
    var status = document.getElementById("search-status");
    if (!input || !results || !status) return;

    // Optional: a template may omit the exits, and a missing dead-end escape
    // must not take the whole search with it.
    var exits = document.getElementById("search-exits");

    var text = input.dataset;
    var fuse = null;

    function options() {
        var o = Object.assign(
            {
                distance: 100,
                threshold: 0.4,
                ignoreLocation: true,
                includeMatches: true,
                keys: ["title", "permalink", "summary", "content"],
            },
            params.fuseOpts || {}
        );
        // Config keys arrive lowercased from TOML; Fuse expects camelCase.
        if (o.minmatchcharlength !== undefined) {
            o.minMatchCharLength = o.minmatchcharlength;
            delete o.minmatchcharlength;
        }
        if (o.iscasesensitive !== undefined) {
            o.isCaseSensitive = o.iscasesensitive;
            delete o.iscasesensitive;
        }
        if (o.shouldsort !== undefined) {
            o.shouldSort = o.shouldsort;
            delete o.shouldsort;
        }
        if (o.ignorelocation !== undefined) {
            o.ignoreLocation = o.ignorelocation;
            delete o.ignorelocation;
        }
        if (o.includematches !== undefined) {
            o.includeMatches = o.includematches;
            delete o.includematches;
        }
        if (o.findallmatches !== undefined) {
            o.findAllMatches = o.findallmatches;
            delete o.findallmatches;
        }
        return o;
    }

    // The status line is a live region, so whatever is written here is
    // announced — the result count included, which is otherwise a silent
    // change for anyone not looking at the screen.
    function say(message, state) {
        status.textContent = message;
        status.hidden = !message;
        if (state) {
            status.dataset.state = state;
        } else {
            delete status.dataset.state;
        }
    }

    function countLabel(n) {
        return n === 1
            ? text.countOne
            : (text.countOther || "").replace("{n}", n);
    }

    function links() {
        return Array.prototype.slice.call(results.querySelectorAll("a"));
    }

    // The meta line of a post card, rebuilt from the index's own strings so a
    // result carries the same fields in the same order as every other place a
    // post is indexed. post-card__meta is not scoped to .post-card, so the field
    // grid and its separators apply here without a second rule.
    function metaLine(page) {
        if (!page.date && !page.extent) return null;
        var p = document.createElement("p");
        p.className = "post-card__meta";
        if (page.date) {
            var d = document.createElement("span");
            d.className = "post-card__date";
            d.textContent = page.date;
            p.appendChild(d);
        }
        if (page.extent) {
            var e = document.createElement("span");
            e.className = "post-card__extent";
            e.textContent = page.extent;
            p.appendChild(e);
        }
        return p;
    }

    // Built with DOM APIs rather than innerHTML: the query and the index both
    // reach this function, and neither should ever be parsed as markup.
    function render(matches) {
        results.replaceChildren();
        matches.forEach(function (match) {
            var page = match.item;
            var li = document.createElement("li");
            var meta = metaLine(page);
            if (meta) li.appendChild(meta);
            var a = document.createElement("a");
            a.href = page.permalink;
            a.textContent = page.title;
            li.appendChild(a);
            if (page.summary) {
                var p = document.createElement("p");
                p.textContent = page.summary;
                li.appendChild(p);
            }
            results.appendChild(li);
        });
    }

    // Shown only for a query that returned nothing. An empty field is not a
    // dead end — the reader is still typing — so the exits stay away until the
    // search has actually failed.
    function showExits(on) {
        if (exits) exits.hidden = !on;
    }

    function reset() {
        results.replaceChildren();
        say("");
        showExits(false);
    }

    // Keeping the query in the URL makes a result set linkable, and is what
    // lets the 404 page hand the path that failed straight to the search.
    function syncUrl(query) {
        if (!window.history || !window.history.replaceState) return;
        var url = new URL(window.location.href);
        if (query) {
            url.searchParams.set("query", query);
        } else {
            url.searchParams.delete("query");
        }
        window.history.replaceState(null, "", url);
    }

    function run(query, updateUrl) {
        if (!fuse || !query) {
            reset();
            if (updateUrl) syncUrl("");
            return;
        }
        var matches = fuse.search(query);
        render(matches);
        say(matches.length ? countLabel(matches.length) : text.empty);
        showExits(!matches.length);
        if (updateUrl) syncUrl(query);
    }

    fetch(text.index)
        .then(function (response) {
            if (!response.ok) throw new Error(response.status);
            return response.json();
        })
        .then(function (data) {
            fuse = new Fuse(data, options());
            input.disabled = false;
            input.placeholder = text.placeholder;

            // A ?query= in the address bar runs immediately — this is the path
            // a visitor arrives on from the 404 page's recovery link.
            var initial = "";
            try {
                initial = new URL(window.location.href).searchParams.get("query") || "";
            } catch (e) { /* malformed URL; treat as no query */ }

            if (initial) {
                input.value = initial;
                run(initial, false);
            }

            // Autofocus only where a keyboard is already present; on a touch
            // device it would throw up the on-screen keyboard on arrival.
            if (window.matchMedia("(pointer: fine)").matches) input.focus();
        })
        .catch(function () {
            input.placeholder = text.error;
            say(text.error, "error");
            // An index that never arrived is the same dead end as a query that
            // matched nothing, and the field cannot be used to get out of it.
            showExits(true);
        });

    var timer;
    input.addEventListener("input", function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            run(input.value.trim(), true);
        }, 120);
    });

    // Arrow keys move real focus, so Enter, the visible focus ring and the tab
    // order all come for free rather than being re-implemented in ARIA.
    input.addEventListener("keydown", function (event) {
        if (event.key === "ArrowDown") {
            var first = links()[0];
            if (first) {
                event.preventDefault();
                first.focus();
            }
        } else if (event.key === "Escape") {
            input.value = "";
            reset();
            syncUrl("");
        }
    });

    results.addEventListener("keydown", function (event) {
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Escape") return;

        if (event.key === "Escape") {
            input.value = "";
            reset();
            syncUrl("");
            input.focus();
            return;
        }

        var items = links();
        var index = items.indexOf(document.activeElement);
        if (index < 0) return;
        event.preventDefault();

        if (event.key === "ArrowUp" && index === 0) {
            input.focus();
        } else {
            var next = event.key === "ArrowDown" ? index + 1 : index - 1;
            if (items[next]) items[next].focus();
        }
    });
})();
