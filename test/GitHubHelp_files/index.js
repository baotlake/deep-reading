


function e(t, r, n) {
    function i(a) {
        if (!r[a]) {
            var l = r[a] = {
                exports: {}
            };
            console.log('a = ', a);
            // t[a][0].call(l.exports, (e)=>{return i(t[a][1][e] || e)}, l, l.exports, e, t, r, n);
            t[a][0].call(l.exports, (e)=>{return i(t[a][1][e] || e)}, l, l.exports);


            // t[6][0].call(l.exports, function(e) {
            //     return i(t[6][1][e] || e)
            // }, l, l.exports, e, t, r, n)

            // t[a][0].call({}, (e)=>{return i(t[a][1][e] || e)}, {exports:{}}, {}, e, t, {6:{exports:{}}}, [6]);
        }
        return r[a].exports
    }
    // for (var o = "function" == typeof require && require, a = 0; a < n.length; a++)
    //     i(n[a]);
    // return i

    var o =false;
    i(6)
    return i;
}

e({
    1: [function(e, t, r) {
        "use strict";
        function n(e) {
            return (e ? new Date(e) : new Date).toISOString().slice(0, 10)
        }
        function i(e) {
            return new Date(e).getTime()
        }
        t.exports = function() {
            var e = document.querySelector("span[data-dispay-until]")
              , t = document.querySelector("span[data-dispay-starting]");
            if (e && t) {
                var r = n()
                  , o = n(e.getAttribute("data-dispay-until"));
                o > r || i(o) === i(r) ? t.style.display = "none" : e.style.display = "none"
            }
        }
    }
    , {}],
    2: [function(e, t, r) {
        "use strict";
        var n = e("platform-utils").getPlatformFromUserAgent
          , i = ["mac", "windows", "linux"]
          , o = new Set;
        function a(e) {
            c().forEach(function(t) {
                t.dataset.platform === e ? t.classList.add("selected") : t.classList.remove("selected")
            })
        }
        function s(e) {
            return Array.from(document.querySelectorAll(".extended-markdown")).filter(function(e) {
                return i.some(function(t) {
                    return e.classList.contains(t)
                })
            }).forEach(function(t) {
                u(t),
                t.style.display = t.classList.contains(e) ? "" : "none"
            }),
            Array.from(document.querySelectorAll(".platform-mac, .platform-windows, .platform-linux")).forEach(function(t) {
                u(t),
                t.style.display = t.classList.contains("platform-" + e) ? "" : "none"
            }),
            Array.from(o)
        }
        function u(e) {
            e.classList.forEach(function(e) {
                var t = e.replace(/platform-/, "");
                i.includes(t) && o.add(t)
            })
        }
        function c() {
            return Array.from(document.querySelectorAll("a.platform-switcher"))
        }
        t.exports = function() {
            var e = n();
            e || (e = "mac"),
            "darwin" === e && (e = "mac"),
            e.startsWith("win") && (e = "windows"),
            function(e) {
                Array.from(document.querySelectorAll("a.platform-switcher")).forEach(function(t) {
                    e.includes(t.dataset.platform) || (t.style.display = "none")
                })
            }(s(e)),
            a(e),
            c().forEach(function(e) {
                e.addEventListener("click", function(e) {
                    e.preventDefault(),
                    a(e.target.dataset.platform),
                    s(e.target.dataset.platform)
                })
            })
        }
    }
    , {
        "platform-utils": 22
    }],
    3: [function(e, t, r) {
        "use strict";
        t.exports = function() {}
    }
    , {}],
    4: [function(e, t, r) {
        "use strict";
        t.exports = function() {
            var e, t, r, n, i, o;
            e = window,
            t = document,
            r = "script",
            n = "ga",
            e.GoogleAnalyticsObject = n,
            e.ga = e.ga || function() {
                (e.ga.q = e.ga.q || []).push(arguments)
            }
            ,
            e.ga.l = 1 * new Date,
            i = t.createElement(r),
            o = t.getElementsByTagName(r)[0],
            i.async = 1,
            i.src = "//www.google-analytics.com/analytics.js",
            o.parentNode.insertBefore(i, o),
            ga("create", "UA-3769691-27", "auto"),
            ga("send", "pageview")
        }
    }
    , {}],
    5: [function(e, t, r) {
        "use strict";
        t.exports = function() {
            var e = Array.from(document.querySelectorAll(".helpfulness form"))
              , t = Array.from(document.querySelectorAll(".helpfulness form input[type=text]"))
              , r = Array.from(document.querySelectorAll(".helpfulness-feedback"));
            e.length && t.length && r.length && (e.forEach(function(t) {
                t.addEventListener("submit", function(n) {
                    n.preventDefault(),
                    e.forEach(function(e) {
                        return e.setAttribute("hidden", !0)
                    }),
                    r.forEach(function(e) {
                        return e.removeAttribute("hidden")
                    }),
                    function(e) {
                        if (!window.ga)
                            return;
                        var t = new FormData(e);
                        window.ga("send", "event", "Helpfulness", "click - ".concat(t.get("helpfulness-option")), t.get("helpfulness-comments"), 1)
                    }(t)
                })
            }),
            t.forEach(function(e) {
                e.addEventListener("keydown", function(e) {
                    "Slash" === e.code && e.stopPropagation()
                })
            }))
        }
    }
    , {}],
    6: [function(e, t, r) {
        "use strict";
        console.log('6 --', e, e.toString())
        document.addEventListener("DOMContentLoaded", function() {
            e("./display-platform-specific-content")(),
            e("./explorer")(),
            e("./search")(),
            e("./nav")(),
            e("browser-date-formatter")(),
            e("./google-analytics")(),
            e("./deprecation-banner")(),
            e("./sidebar")(),
            e("./helpfulness")()
        })
        console.log('6 ++')
    }
    , {
        "./deprecation-banner": 1,
        "./display-platform-specific-content": 2,
        "./explorer": 3,
        "./google-analytics": 4,
        "./helpfulness": 5,
        "./nav": 7,
        "./search": 8,
        "./sidebar": 9,
        "browser-date-formatter": 16
    }],
    7: [function(e, t, r) {
        "use strict";
        t.exports = function() {
            console.log("add Event Listener ! ######################################")
            var e = document.querySelector(".nav-mobile-burgerIcon")
              , t = document.querySelector(".nav-mobile-dropdown");
            e.addEventListener("click", function(r) {
                console.log('click button ！##############')
                r.preventDefault(),
                e.classList.toggle("js-open"),
                t.classList.toggle("js-open")
            })
        }
    }
    , {}],
    8: [function(e, t, r) {
        "use strict";
        var n = e("search-with-your-keyboard")
          , i = e("querystring")
          , o = e("html-truncate")
          , a = e("../lib/patterns")
          , s = e("../lib/languages")
          , u = Object.keys(s)
          , c = u.map(function(e) {
            return "/".concat(e)
        })
          , l = function(e) {
            var t = document.querySelector("#search-input-container input");
            if (t) {
                var r = new URL(e.objectID,window.location.origin)
                  , n = new URLSearchParams(r.search.slice(1));
                n.append("algolia-query", t.value),
                r.search = n.toString(),
                e.modifiedURL = r.toString()
            }
            var i = e.heading ? e._highlightResult.heading.value : e._highlightResult.title.value;
            !e.heading && e.breadcrumbs && e.breadcrumbs.endsWith(e.title) ? e.modifiedBreadcrumbs = e.breadcrumbs.replace(" / " + e.title, "") : e.modifiedBreadcrumbs = e.breadcrumbs,
            e.modifiedContent = o(e._highlightResult.content.value, 300);
            var a = '\n    <div class="search-result border-top border-gray-light py-3 px-2">\n      <a href="#" class="no-underline">\n        <div class="search-result-breadcrumbs d-block text-gray-dark opacity-60 text-small pb-1">'.concat(e.modifiedBreadcrumbs, '</div>\n        <div class="search-result-title d-block h4-mktg text-gray-dark">').concat(i, '</div>\n        <div class="search-result-content d-block text-gray">').concat(e.modifiedContent, "</div>\n      </a>\n    </div>\n  ")
              , s = document.createRange().createContextualFragment(a);
            s.querySelector("a").setAttribute("href", e.modifiedURL);
            var u = document.createElement("div");
            return u.appendChild(s.cloneNode(!0)),
            u.innerHTML
        };
        function d(e) {
            var t = document.querySelector("#search-input-container input")
              , r = document.querySelector(".search-overlay-desktop");
            c.includes(window.location.pathname) || (t.addEventListener("focus", function() {
                f()
            }),
            r && r.addEventListener("click", function() {
                p()
            }),
            t.value && f()),
            document.addEventListener("keyup", function(e) {
                "Escape" === e.key && p()
            })
        }
        function f() {
            document.querySelector("#search-input-container input").classList.add("js-open"),
            document.querySelector("#search-results-container").classList.add("js-open"),
            document.querySelector(".search-overlay-desktop").classList.add("js-open")
        }
        function p() {
            c.includes(window.location.pathname) || (document.querySelector("#search-input-container input").classList.remove("js-open"),
            document.querySelector("#search-results-container").classList.remove("js-open"),
            document.querySelector(".search-overlay-desktop").classList.remove("js-open")),
            document.querySelector(".ais-Hits").style.display = "none",
            document.querySelector("#search-input-container input").value = "",
            window.history.replaceState({}, "clear search query", window.location.pathname)
        }
        t.exports = function() {
            window.initialPageLoad = !0;
            var e, t = {
                searchClient: window.algoliasearch("ZI5KPY1HBE", "685df617246c3a10abba589b4599288f"),
                indexName: "github-docs-".concat((e = location.pathname.match(a.enterprise),
                e ? e[1] : "dotcom"), "-").concat(function() {
                    var e = location.pathname.split("/")[1];
                    u.includes(e) || (e = "en");
                    return e
                }()),
                advancedSyntax: !0,
                routing: !0,
                searchFunction: function(e) {
                    var t = e.state.query
                      , r = t && t.length > 0
                      , n = document.querySelector(".ais-Hits");
                    if (!window.initialPageLoad || r) {
                        if (e.search(),
                        c.includes(window.location.pathname)) {
                            var i = document.getElementById("search-results-container")
                              , o = i.getAttribute("data-active-class")
                              , a = i.getAttribute("data-inactive-class");
                            if (!o)
                                return void console.error("container is missing required `data-active-class` attribute", i);
                            if (!a)
                                return void console.error("container is missing required `data-inactive-class` attribute", i);
                            i.classList.toggle(o, r),
                            i.classList.toggle(a, !r)
                        }
                        r || (setTimeout(function() {
                            document.querySelector("#search-input-container input").value = ""
                        }, 50),
                        n.style.display = "none"),
                        r && n && (n.style.display = "block"),
                        window.initialPageLoad = !1,
                        d()
                    }
                }
            }, r = window.instantsearch(t);
            r.addWidget(window.instantsearch.widgets.hits({
                container: "#search-results-container",
                templates: {
                    empty: "No results",
                    item: l
                },
                transformItems: function(e) {
                    return e
                }
            }));
            var o = document.querySelector('meta[name="site.data.ui.search.placeholder"]')
              , s = o ? o.content : "Search topics, products...";
            r.addWidget(window.instantsearch.widgets.searchBox({
                container: "#search-input-container",
                placeholder: s,
                autofocus: c.includes(window.location.pathname) && !window.location.hash.length,
                showReset: !1,
                showSubmit: !1
            })),
            r.on("render", function() {}),
            r.on("error", function() {
                for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
                    t[r] = arguments[r];
                console.error("algolia error", t)
            }),
            r.start(),
            n("#search-input-container input", ".ais-Hits-item"),
            d(),
            setTimeout(function() {
                !function() {
                    if (history && history.replaceState && location && location.search && location.search.includes("algolia-query=")) {
                        var e = i.parse(location.search.replace(/^\?/, ""));
                        delete e["algolia-query"],
                        e = Object.keys(e).length ? "?" + i.stringify(e) : "",
                        history.replaceState(null, "", "".concat(location.pathname).concat(e).concat(location.hash))
                    }
                }()
            }, 500)
        }
    }
    , {
        "../lib/languages": 10,
        "../lib/patterns": 11,
        "html-truncate": 19,
        querystring: 25,
        "search-with-your-keyboard": 27
    }],
    9: [function(e, t, r) {
        "use strict";
        t.exports = function() {
            var e = document.querySelector(".sidebar .active");
            if (e) {
                var t = e.offsetTop - 40
                  , r = document.querySelector(".sidebar");
                t > .5 * window.innerHeight && r.scrollTo(0, t);
                var n = document.querySelectorAll(".sidebar-guide:not(.active) details[open]");
                if (n) {
                    var i = !0
                      , o = !1
                      , a = void 0;
                    try {
                        for (var s, u = n[Symbol.iterator](); !(i = (s = u.next()).done); i = !0) {
                            s.value.removeAttribute("open")
                        }
                    } catch (e) {
                        o = !0,
                        a = e
                    } finally {
                        try {
                            i || null == u.return || u.return()
                        } finally {
                            if (o)
                                throw a
                        }
                    }
                }
            }
        }
    }
    , {}],
    10: [function(e, t, r) {
        (function(e) {
            "use strict";
            var r = {
                en: {
                    name: "English",
                    code: "en",
                    hreflang: "en",
                    dir: "",
                    wip: !1
                },
                cn: {
                    name: "Simplified Chinese",
                    nativeName: "简体中文",
                    code: "cn",
                    hreflang: "zh-Hans",
                    redirectPatterns: [/^\/zh-\w{2}/, /^\/zh/],
                    dir: "translations/zh-CN",
                    wip: !1
                },
                ja: {
                    name: "Japanese",
                    nativeName: "日本語",
                    code: "ja",
                    hreflang: "ja",
                    redirectPatterns: [/^\/jp/],
                    dir: "translations/ja-JP",
                    wip: !1
                },
                es: {
                    name: "Spanish",
                    nativeName: "Español",
                    code: "es",
                    hreflang: "es",
                    dir: "translations/es-XL",
                    wip: !1
                },
                pt: {
                    name: "Portuguese",
                    nativeName: "Português do Brasil",
                    code: "pt",
                    hreflang: "pt",
                    dir: "translations/pt-BR",
                    wip: !1
                },
                de: {
                    name: "German",
                    nativeName: "Deutsch",
                    code: "de",
                    hreflang: "de",
                    dir: "translations/de-DE",
                    wip: !0
                }
            };
            e.env.ENABLED_LANGUAGES && (Object.keys(r).forEach(function(t) {
                e.env.ENABLED_LANGUAGES.includes(t) || delete r[t]
            }),
            console.log("ENABLED_LANGUAGES: ".concat(e.env.ENABLED_LANGUAGES))),
            t.exports = r
        }
        ).call(this, e("_process"))
    }
    , {
        _process: 17
    }],
    11: [function(e, t, r) {
        "use strict";
        t.exports = {
            githubDotcom: /\/github(\/|$|\?)/,
            enterprise: /\/enterprise\/?(\d+\.\d+)?/,
            admin: /enterprise\/(\d+\.\d+\/)?admin\/?/,
            gheUser: /enterprise\/(\d+\.\d+\/)?user(\/|$|\?)/,
            desktop: /desktop\//,
            oldGuidesPath: /(\/admin|(^|\/)desktop)\/guides/,
            getEnterpriseVersionNumber: /^.*?enterprise\/(\d+\.\d+(?:\.340)?).*?$/,
            removeEnterpriseVersion: /(enterprise\/)\d+\.\d+\//,
            guides: /guides\//,
            hasLanguageCode: /^\/[a-z]{2}(\/|$|\?)/,
            trailingSlash: /^(.+?)\/+?$/,
            searchPath: /\/search(?:\/)?(\?)/,
            ymd: /^\d{4}-\d{2}-\d{2}$/,
            hasLiquid: /[{{][{%]/,
            dataReference: /{{ ?site\.data\.(?:reusables|variables)\..*?}}/gm,
            imagePath: /\/?assets\/images\/.*?\.(png|svg|gif|pdf|ico|jpg|jpeg)/gi,
            homepagePath: /^\/\w{2}$/,
            multipleSlashes: /^\/+/m
        }
    }
    , {}],
    12: [function(e, t, r) {
        (function(r) {
            "use strict";
            function n(e) {
                return (n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                    return typeof e
                }
                : function(e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                }
                )(e)
            }
            var i = e("object-assign");
            function o(e, t) {
                if (e === t)
                    return 0;
                for (var r = e.length, n = t.length, i = 0, o = Math.min(r, n); i < o; ++i)
                    if (e[i] !== t[i]) {
                        r = e[i],
                        n = t[i];
                        break
                    }
                return r < n ? -1 : n < r ? 1 : 0
            }
            function a(e) {
                return r.Buffer && "function" == typeof r.Buffer.isBuffer ? r.Buffer.isBuffer(e) : !(null == e || !e._isBuffer)
            }
            var s = e("util/")
              , u = Object.prototype.hasOwnProperty
              , c = Array.prototype.slice
              , l = "foo" === function() {}
            .name;
            function d(e) {
                return Object.prototype.toString.call(e)
            }
            function f(e) {
                return !a(e) && ("function" == typeof r.ArrayBuffer && ("function" == typeof ArrayBuffer.isView ? ArrayBuffer.isView(e) : !!e && (e instanceof DataView || !!(e.buffer && e.buffer instanceof ArrayBuffer))))
            }
            var p = t.exports = w
              , m = /\s*function\s+([^\(\s]*)\s*/;
            function h(e) {
                if (s.isFunction(e)) {
                    if (l)
                        return e.name;
                    var t = e.toString().match(m);
                    return t && t[1]
                }
            }
            function b(e, t) {
                return "string" == typeof e ? e.length < t ? e : e.slice(0, t) : e
            }
            function g(e) {
                if (l || !s.isFunction(e))
                    return s.inspect(e);
                var t = h(e);
                return "[Function" + (t ? ": " + t : "") + "]"
            }
            function y(e, t, r, n, i) {
                throw new p.AssertionError({
                    message: r,
                    actual: e,
                    expected: t,
                    operator: n,
                    stackStartFunction: i
                })
            }
            function w(e, t) {
                e || y(e, !0, t, "==", p.ok)
            }
            function v(e, t, r, i) {
                if (e === t)
                    return !0;
                if (a(e) && a(t))
                    return 0 === o(e, t);
                if (s.isDate(e) && s.isDate(t))
                    return e.getTime() === t.getTime();
                if (s.isRegExp(e) && s.isRegExp(t))
                    return e.source === t.source && e.global === t.global && e.multiline === t.multiline && e.lastIndex === t.lastIndex && e.ignoreCase === t.ignoreCase;
                if (null !== e && "object" === n(e) || null !== t && "object" === n(t)) {
                    if (f(e) && f(t) && d(e) === d(t) && !(e instanceof Float32Array || e instanceof Float64Array))
                        return 0 === o(new Uint8Array(e.buffer), new Uint8Array(t.buffer));
                    if (a(e) !== a(t))
                        return !1;
                    var u = (i = i || {
                        actual: [],
                        expected: []
                    }).actual.indexOf(e);
                    return -1 !== u && u === i.expected.indexOf(t) || (i.actual.push(e),
                    i.expected.push(t),
                    function(e, t, r, n) {
                        if (null === e || void 0 === e || null === t || void 0 === t)
                            return !1;
                        if (s.isPrimitive(e) || s.isPrimitive(t))
                            return e === t;
                        if (r && Object.getPrototypeOf(e) !== Object.getPrototypeOf(t))
                            return !1;
                        var i = S(e)
                          , o = S(t);
                        if (i && !o || !i && o)
                            return !1;
                        if (i)
                            return e = c.call(e),
                            t = c.call(t),
                            v(e, t, r);
                        var a, u, l = M(e), d = M(t);
                        if (l.length !== d.length)
                            return !1;
                        for (l.sort(),
                        d.sort(),
                        u = l.length - 1; u >= 0; u--)
                            if (l[u] !== d[u])
                                return !1;
                        for (u = l.length - 1; u >= 0; u--)
                            if (a = l[u],
                            !v(e[a], t[a], r, n))
                                return !1;
                        return !0
                    }(e, t, r, i))
                }
                return r ? e === t : e == t
            }
            function S(e) {
                return "[object Arguments]" == Object.prototype.toString.call(e)
            }
            function x(e, t) {
                if (!e || !t)
                    return !1;
                if ("[object RegExp]" == Object.prototype.toString.call(t))
                    return t.test(e);
                try {
                    if (e instanceof t)
                        return !0
                } catch (e) {}
                return !Error.isPrototypeOf(t) && !0 === t.call({}, e)
            }
            function k(e, t, r, n) {
                var i;
                if ("function" != typeof t)
                    throw new TypeError('"block" argument must be a function');
                "string" == typeof r && (n = r,
                r = null),
                i = function(e) {
                    var t;
                    try {
                        e()
                    } catch (e) {
                        t = e
                    }
                    return t
                }(t),
                n = (r && r.name ? " (" + r.name + ")." : ".") + (n ? " " + n : "."),
                e && !i && y(i, r, "Missing expected exception" + n);
                var o = "string" == typeof n
                  , a = !e && s.isError(i)
                  , u = !e && i && !r;
                if ((a && o && x(i, r) || u) && y(i, r, "Got unwanted exception" + n),
                e && i && r && !x(i, r) || !e && i)
                    throw i
            }
            p.AssertionError = function(e) {
                var t;
                this.name = "AssertionError",
                this.actual = e.actual,
                this.expected = e.expected,
                this.operator = e.operator,
                e.message ? (this.message = e.message,
                this.generatedMessage = !1) : (this.message = b(g((t = this).actual), 128) + " " + t.operator + " " + b(g(t.expected), 128),
                this.generatedMessage = !0);
                var r = e.stackStartFunction || y;
                if (Error.captureStackTrace)
                    Error.captureStackTrace(this, r);
                else {
                    var n = new Error;
                    if (n.stack) {
                        var i = n.stack
                          , o = h(r)
                          , a = i.indexOf("\n" + o);
                        if (a >= 0) {
                            var s = i.indexOf("\n", a + 1);
                            i = i.substring(s + 1)
                        }
                        this.stack = i
                    }
                }
            }
            ,
            s.inherits(p.AssertionError, Error),
            p.fail = y,
            p.ok = w,
            p.equal = function(e, t, r) {
                e != t && y(e, t, r, "==", p.equal)
            }
            ,
            p.notEqual = function(e, t, r) {
                e == t && y(e, t, r, "!=", p.notEqual)
            }
            ,
            p.deepEqual = function(e, t, r) {
                v(e, t, !1) || y(e, t, r, "deepEqual", p.deepEqual)
            }
            ,
            p.deepStrictEqual = function(e, t, r) {
                v(e, t, !0) || y(e, t, r, "deepStrictEqual", p.deepStrictEqual)
            }
            ,
            p.notDeepEqual = function(e, t, r) {
                v(e, t, !1) && y(e, t, r, "notDeepEqual", p.notDeepEqual)
            }
            ,
            p.notDeepStrictEqual = function e(t, r, n) {
                v(t, r, !0) && y(t, r, n, "notDeepStrictEqual", e)
            }
            ,
            p.strictEqual = function(e, t, r) {
                e !== t && y(e, t, r, "===", p.strictEqual)
            }
            ,
            p.notStrictEqual = function(e, t, r) {
                e === t && y(e, t, r, "!==", p.notStrictEqual)
            }
            ,
            p.throws = function(e, t, r) {
                k(!0, e, t, r)
            }
            ,
            p.doesNotThrow = function(e, t, r) {
                k(!1, e, t, r)
            }
            ,
            p.ifError = function(e) {
                if (e)
                    throw e
            }
            ,
            p.strict = i(function e(t, r) {
                t || y(t, !0, r, "==", e)
            }, p, {
                equal: p.strictEqual,
                deepEqual: p.deepStrictEqual,
                notEqual: p.notStrictEqual,
                notDeepEqual: p.notDeepStrictEqual
            }),
            p.strict.strict = p.strict;
            var M = Object.keys || function(e) {
                var t = [];
                for (var r in e)
                    u.call(e, r) && t.push(r);
                return t
            }
        }
        ).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }
    , {
        "object-assign": 21,
        "util/": 15
    }],
    13: [function(e, t, r) {
        "use strict";
        "function" == typeof Object.create ? t.exports = function(e, t) {
            e.super_ = t,
            e.prototype = Object.create(t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            })
        }
        : t.exports = function(e, t) {
            e.super_ = t;
            var r = function() {};
            r.prototype = t.prototype,
            e.prototype = new r,
            e.prototype.constructor = e
        }
    }
    , {}],
    14: [function(e, t, r) {
        "use strict";
        function n(e) {
            return (n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            }
            : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            }
            )(e)
        }
        t.exports = function(e) {
            return e && "object" === n(e) && "function" == typeof e.copy && "function" == typeof e.fill && "function" == typeof e.readUInt8
        }
    }
    , {}],
    15: [function(e, t, r) {
        (function(t, n) {
            "use strict";
            function i(e) {
                return (i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                    return typeof e
                }
                : function(e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                }
                )(e)
            }
            var o = /%[sdj%]/g;
            r.format = function(e) {
                if (!y(e)) {
                    for (var t = [], r = 0; r < arguments.length; r++)
                        t.push(u(arguments[r]));
                    return t.join(" ")
                }
                r = 1;
                for (var n = arguments, i = n.length, a = String(e).replace(o, function(e) {
                    if ("%%" === e)
                        return "%";
                    if (r >= i)
                        return e;
                    switch (e) {
                    case "%s":
                        return String(n[r++]);
                    case "%d":
                        return Number(n[r++]);
                    case "%j":
                        try {
                            return JSON.stringify(n[r++])
                        } catch (e) {
                            return "[Circular]"
                        }
                    default:
                        return e
                    }
                }), s = n[r]; r < i; s = n[++r])
                    b(s) || !S(s) ? a += " " + s : a += " " + u(s);
                return a
            }
            ,
            r.deprecate = function(e, i) {
                if (w(n.process))
                    return function() {
                        return r.deprecate(e, i).apply(this, arguments)
                    }
                    ;
                if (!0 === t.noDeprecation)
                    return e;
                var o = !1;
                return function() {
                    if (!o) {
                        if (t.throwDeprecation)
                            throw new Error(i);
                        t.traceDeprecation ? console.trace(i) : console.error(i),
                        o = !0
                    }
                    return e.apply(this, arguments)
                }
            }
            ;
            var a, s = {};
            function u(e, t) {
                var n = {
                    seen: [],
                    stylize: l
                };
                return arguments.length >= 3 && (n.depth = arguments[2]),
                arguments.length >= 4 && (n.colors = arguments[3]),
                h(t) ? n.showHidden = t : t && r._extend(n, t),
                w(n.showHidden) && (n.showHidden = !1),
                w(n.depth) && (n.depth = 2),
                w(n.colors) && (n.colors = !1),
                w(n.customInspect) && (n.customInspect = !0),
                n.colors && (n.stylize = c),
                d(n, e, n.depth)
            }
            function c(e, t) {
                var r = u.styles[t];
                return r ? "[" + u.colors[r][0] + "m" + e + "[" + u.colors[r][1] + "m" : e
            }
            function l(e, t) {
                return e
            }
            function d(e, t, n) {
                if (e.customInspect && t && M(t.inspect) && t.inspect !== r.inspect && (!t.constructor || t.constructor.prototype !== t)) {
                    var i = t.inspect(n, e);
                    return y(i) || (i = d(e, i, n)),
                    i
                }
                var o = function(e, t) {
                    if (w(t))
                        return e.stylize("undefined", "undefined");
                    if (y(t)) {
                        var r = "'" + JSON.stringify(t).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
                        return e.stylize(r, "string")
                    }
                    if (g(t))
                        return e.stylize("" + t, "number");
                    if (h(t))
                        return e.stylize("" + t, "boolean");
                    if (b(t))
                        return e.stylize("null", "null")
                }(e, t);
                if (o)
                    return o;
                var a = Object.keys(t)
                  , s = function(e) {
                    var t = {};
                    return e.forEach(function(e, r) {
                        t[e] = !0
                    }),
                    t
                }(a);
                if (e.showHidden && (a = Object.getOwnPropertyNames(t)),
                k(t) && (a.indexOf("message") >= 0 || a.indexOf("description") >= 0))
                    return f(t);
                if (0 === a.length) {
                    if (M(t)) {
                        var u = t.name ? ": " + t.name : "";
                        return e.stylize("[Function" + u + "]", "special")
                    }
                    if (v(t))
                        return e.stylize(RegExp.prototype.toString.call(t), "regexp");
                    if (x(t))
                        return e.stylize(Date.prototype.toString.call(t), "date");
                    if (k(t))
                        return f(t)
                }
                var c, l = "", S = !1, E = ["{", "}"];
                (m(t) && (S = !0,
                E = ["[", "]"]),
                M(t)) && (l = " [Function" + (t.name ? ": " + t.name : "") + "]");
                return v(t) && (l = " " + RegExp.prototype.toString.call(t)),
                x(t) && (l = " " + Date.prototype.toUTCString.call(t)),
                k(t) && (l = " " + f(t)),
                0 !== a.length || S && 0 != t.length ? n < 0 ? v(t) ? e.stylize(RegExp.prototype.toString.call(t), "regexp") : e.stylize("[Object]", "special") : (e.seen.push(t),
                c = S ? function(e, t, r, n, i) {
                    for (var o = [], a = 0, s = t.length; a < s; ++a)
                        j(t, String(a)) ? o.push(p(e, t, r, n, String(a), !0)) : o.push("");
                    return i.forEach(function(i) {
                        i.match(/^\d+$/) || o.push(p(e, t, r, n, i, !0))
                    }),
                    o
                }(e, t, n, s, a) : a.map(function(r) {
                    return p(e, t, n, s, r, S)
                }),
                e.seen.pop(),
                function(e, t, r) {
                    if (e.reduce(function(e, t) {
                        return 0,
                        t.indexOf("\n") >= 0 && 0,
                        e + t.replace(/\u001b\[\d\d?m/g, "").length + 1
                    }, 0) > 60)
                        return r[0] + ("" === t ? "" : t + "\n ") + " " + e.join(",\n  ") + " " + r[1];
                    return r[0] + t + " " + e.join(", ") + " " + r[1]
                }(c, l, E)) : E[0] + l + E[1]
            }
            function f(e) {
                return "[" + Error.prototype.toString.call(e) + "]"
            }
            function p(e, t, r, n, i, o) {
                var a, s, u;
                if ((u = Object.getOwnPropertyDescriptor(t, i) || {
                    value: t[i]
                }).get ? s = u.set ? e.stylize("[Getter/Setter]", "special") : e.stylize("[Getter]", "special") : u.set && (s = e.stylize("[Setter]", "special")),
                j(n, i) || (a = "[" + i + "]"),
                s || (e.seen.indexOf(u.value) < 0 ? (s = b(r) ? d(e, u.value, null) : d(e, u.value, r - 1)).indexOf("\n") > -1 && (s = o ? s.split("\n").map(function(e) {
                    return "  " + e
                }).join("\n").substr(2) : "\n" + s.split("\n").map(function(e) {
                    return "   " + e
                }).join("\n")) : s = e.stylize("[Circular]", "special")),
                w(a)) {
                    if (o && i.match(/^\d+$/))
                        return s;
                    (a = JSON.stringify("" + i)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (a = a.substr(1, a.length - 2),
                    a = e.stylize(a, "name")) : (a = a.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"),
                    a = e.stylize(a, "string"))
                }
                return a + ": " + s
            }
            function m(e) {
                return Array.isArray(e)
            }
            function h(e) {
                return "boolean" == typeof e
            }
            function b(e) {
                return null === e
            }
            function g(e) {
                return "number" == typeof e
            }
            function y(e) {
                return "string" == typeof e
            }
            function w(e) {
                return void 0 === e
            }
            function v(e) {
                return S(e) && "[object RegExp]" === E(e)
            }
            function S(e) {
                return "object" === i(e) && null !== e
            }
            function x(e) {
                return S(e) && "[object Date]" === E(e)
            }
            function k(e) {
                return S(e) && ("[object Error]" === E(e) || e instanceof Error)
            }
            function M(e) {
                return "function" == typeof e
            }
            function E(e) {
                return Object.prototype.toString.call(e)
            }
            function A(e) {
                return e < 10 ? "0" + e.toString(10) : e.toString(10)
            }
            r.debuglog = function(e) {
                if (w(a) && (a = t.env.NODE_DEBUG || ""),
                e = e.toUpperCase(),
                !s[e])
                    if (new RegExp("\\b" + e + "\\b","i").test(a)) {
                        var n = t.pid;
                        s[e] = function() {
                            var t = r.format.apply(r, arguments);
                            console.error("%s %d: %s", e, n, t)
                        }
                    } else
                        s[e] = function() {}
                        ;
                return s[e]
            }
            ,
            r.inspect = u,
            u.colors = {
                bold: [1, 22],
                italic: [3, 23],
                underline: [4, 24],
                inverse: [7, 27],
                white: [37, 39],
                grey: [90, 39],
                black: [30, 39],
                blue: [34, 39],
                cyan: [36, 39],
                green: [32, 39],
                magenta: [35, 39],
                red: [31, 39],
                yellow: [33, 39]
            },
            u.styles = {
                special: "cyan",
                number: "yellow",
                boolean: "yellow",
                undefined: "grey",
                null: "bold",
                string: "green",
                date: "magenta",
                regexp: "red"
            },
            r.isArray = m,
            r.isBoolean = h,
            r.isNull = b,
            r.isNullOrUndefined = function(e) {
                return null == e
            }
            ,
            r.isNumber = g,
            r.isString = y,
            r.isSymbol = function(e) {
                return "symbol" === i(e)
            }
            ,
            r.isUndefined = w,
            r.isRegExp = v,
            r.isObject = S,
            r.isDate = x,
            r.isError = k,
            r.isFunction = M,
            r.isPrimitive = function(e) {
                return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" === i(e) || void 0 === e
            }
            ,
            r.isBuffer = e("./support/isBuffer");
            var D = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            function j(e, t) {
                return Object.prototype.hasOwnProperty.call(e, t)
            }
            r.log = function() {
                var e, t;
                console.log("%s - %s", (e = new Date,
                t = [A(e.getHours()), A(e.getMinutes()), A(e.getSeconds())].join(":"),
                [e.getDate(), D[e.getMonth()], t].join(" ")), r.format.apply(r, arguments))
            }
            ,
            r.inherits = e("inherits"),
            r._extend = function(e, t) {
                if (!t || !S(t))
                    return e;
                for (var r = Object.keys(t), n = r.length; n--; )
                    e[r[n]] = t[r[n]];
                return e
            }
        }
        ).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }
    , {
        "./support/isBuffer": 14,
        _process: 17,
        inherits: 13
    }],
    16: [function(e, t, r) {
        "use strict";
        var n = e("domready")
          , i = e("strftime")
          , o = e("relative-date");
        t.exports = function() {
            a(),
            n(a),
            setInterval(a, 5e3)
        }
        ;
        var a = function() {
            var e = document.querySelectorAll("[data-date]");
            Array.prototype.forEach.call(e, function(e) {
                var t;
                if (e.dataset.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    var r = e.dataset.date.split("-");
                    t = new Date(r[0],r[1] - 1,r[2])
                } else
                    t = new Date(e.dataset.date);
                if (!t.getFullYear())
                    return console.error("Invalid date", e.dataset.date);
                var n = e.dataset.format || "relative"
                  , a = "relative" === n ? o(t) : i(n, t);
                e.textContent = a
            })
        }
    }
    , {
        domready: 18,
        "relative-date": 26,
        strftime: 28
    }],
    17: [function(e, t, r) {
        "use strict";
        var n, i, o = t.exports = {};
        function a() {
            throw new Error("setTimeout has not been defined")
        }
        function s() {
            throw new Error("clearTimeout has not been defined")
        }
        function u(e) {
            if (n === setTimeout)
                return setTimeout(e, 0);
            if ((n === a || !n) && setTimeout)
                return n = setTimeout,
                setTimeout(e, 0);
            try {
                return n(e, 0)
            } catch (t) {
                try {
                    return n.call(null, e, 0)
                } catch (t) {
                    return n.call(this, e, 0)
                }
            }
        }
        !function() {
            try {
                n = "function" == typeof setTimeout ? setTimeout : a
            } catch (e) {
                n = a
            }
            try {
                i = "function" == typeof clearTimeout ? clearTimeout : s
            } catch (e) {
                i = s
            }
        }();
        var c, l = [], d = !1, f = -1;
        function p() {
            d && c && (d = !1,
            c.length ? l = c.concat(l) : f = -1,
            l.length && m())
        }
        function m() {
            if (!d) {
                var e = u(p);
                d = !0;
                for (var t = l.length; t; ) {
                    for (c = l,
                    l = []; ++f < t; )
                        c && c[f].run();
                    f = -1,
                    t = l.length
                }
                c = null,
                d = !1,
                function(e) {
                    if (i === clearTimeout)
                        return clearTimeout(e);
                    if ((i === s || !i) && clearTimeout)
                        return i = clearTimeout,
                        clearTimeout(e);
                    try {
                        i(e)
                    } catch (t) {
                        try {
                            return i.call(null, e)
                        } catch (t) {
                            return i.call(this, e)
                        }
                    }
                }(e)
            }
        }
        function h(e, t) {
            this.fun = e,
            this.array = t
        }
        function b() {}
        o.nextTick = function(e) {
            var t = new Array(arguments.length - 1);
            if (arguments.length > 1)
                for (var r = 1; r < arguments.length; r++)
                    t[r - 1] = arguments[r];
            l.push(new h(e,t)),
            1 !== l.length || d || u(m)
        }
        ,
        h.prototype.run = function() {
            this.fun.apply(null, this.array)
        }
        ,
        o.title = "browser",
        o.browser = !0,
        o.env = {},
        o.argv = [],
        o.version = "",
        o.versions = {},
        o.on = b,
        o.addListener = b,
        o.once = b,
        o.off = b,
        o.removeListener = b,
        o.removeAllListeners = b,
        o.emit = b,
        o.prependListener = b,
        o.prependOnceListener = b,
        o.listeners = function(e) {
            return []
        }
        ,
        o.binding = function(e) {
            throw new Error("process.binding is not supported")
        }
        ,
        o.cwd = function() {
            return "/"
        }
        ,
        o.chdir = function(e) {
            throw new Error("process.chdir is not supported")
        }
        ,
        o.umask = function() {
            return 0
        }
    }
    , {}],
    18: [function(e, t, r) {
        "use strict";
        function n(e) {
            return (n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            }
            : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            }
            )(e)
        }
        !function(e, r) {
            void 0 !== t ? t.exports = r() : "function" == typeof define && "object" == n(define.amd) ? define(r) : this.domready = r()
        }(0, function() {
            var e, t = [], r = document, n = (r.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(r.readyState);
            return n || r.addEventListener("DOMContentLoaded", e = function() {
                for (r.removeEventListener("DOMContentLoaded", e),
                n = 1; e = t.shift(); )
                    e()
            }
            ),
            function(e) {
                n ? setTimeout(e, 0) : t.push(e)
            }
        })
    }
    , {}],
    19: [function(e, t, r) {
        "use strict";
        t.exports = function(e, t, r) {
            var n, i, o, a, s, u = 10 > t ? t : 10, c = ["img", "br"], l = [], d = 0, f = "", p = '([\\w|-]+\\s*(=\\s*"[^"]*")?\\s*)*', m = new RegExp("<\\/?\\w+\\s*" + p + "\\s*\\/\\s*>"), h = new RegExp("<\\/?\\w+\\s*" + p + "\\s*\\/?\\s*>"), b = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w\-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g, g = new RegExp("<img\\s*" + p + "\\s*\\/?\\s*>"), y = new RegExp("\\W+","g"), w = !0;
            function v(e) {
                var t = e.indexOf(" ");
                if (-1 === t && -1 === (t = e.indexOf(">")))
                    throw new Error("HTML tag is not well-formed : " + e);
                return e.substring(1, t)
            }
            function S(e, n) {
                var i, o, a = t - d, s = a, u = a < r.slop, c = u ? a : r.slop - 1, l = u ? 0 : a - r.slop, f = n || a + r.slop;
                if (!r.truncateLastWord) {
                    if (i = e.slice(l, f),
                    n && i.length <= n)
                        s = i.length;
                    else
                        for (; null !== (o = y.exec(i)); ) {
                            if (!(o.index < c)) {
                                if (o.index === c) {
                                    s = a;
                                    break
                                }
                                s = a + (o.index - c);
                                break
                            }
                            if (s = a - (c - o.index),
                            0 === o.index && a <= 1)
                                break
                        }
                    e.charAt(s - 1).match(/\s$/) && s--
                }
                return s
            }
            for ((r = r || {}).ellipsis = void 0 !== r.ellipsis ? r.ellipsis : "...",
            r.truncateLastWord = void 0 === r.truncateLastWord || r.truncateLastWord,
            r.slop = void 0 !== r.slop ? r.slop : u; w; ) {
                if (!(w = h.exec(e))) {
                    if (d >= t)
                        break;
                    if (!(w = b.exec(e)) || w.index >= t) {
                        f += e.substring(0, S(e));
                        break
                    }
                    for (; w; )
                        n = w[0],
                        i = w.index,
                        f += e.substring(0, i + n.length - d),
                        e = e.substring(i + n.length),
                        w = b.exec(e);
                    break
                }
                if (n = w[0],
                i = w.index,
                d + i > t) {
                    f += e.substring(0, S(e, i));
                    break
                }
                d += i,
                f += e.substring(0, i),
                "/" === n[1] ? (l.pop(),
                a = null) : (a = m.exec(n)) || (o = v(n),
                l.push(o)),
                f += a ? a[0] : n,
                e = e.substring(i + n.length)
            }
            return e.length > t - d && r.ellipsis && (f += r.ellipsis),
            f += (s = "",
            l.reverse().forEach(function(e, t) {
                -1 === c.indexOf(e) && (s += "</" + e + ">")
            }),
            s),
            r.keepImageTag || (f = function(e) {
                var t, r, n = g.exec(e);
                return n ? (t = n.index,
                r = n[0].length,
                e.substring(0, t) + e.substring(t + r)) : e
            }(f)),
            f
        }
    }
    , {}],
    20: [function(e, t, r) {
        "use strict";
        function n(e) {
            return (n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            }
            : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            }
            )(e)
        }
        function i(e) {
            if (e && "object" === n(e)) {
                var t = e.which || e.keyCode || e.charCode;
                t && (e = t)
            }
            if ("number" == typeof e)
                return u[e];
            var r, i = String(e);
            return (r = o[i.toLowerCase()]) ? r : (r = a[i.toLowerCase()]) || (1 === i.length ? i.charCodeAt(0) : void 0)
        }
        i.isEventKey = function(e, t) {
            if (e && "object" === n(e)) {
                var r = e.which || e.keyCode || e.charCode;
                if (null === r || void 0 === r)
                    return !1;
                if ("string" == typeof t) {
                    var i;
                    if (i = o[t.toLowerCase()])
                        return i === r;
                    if (i = a[t.toLowerCase()])
                        return i === r
                } else if ("number" == typeof t)
                    return t === r;
                return !1
            }
        }
        ;
        var o = (r = t.exports = i).code = r.codes = {
            backspace: 8,
            tab: 9,
            enter: 13,
            shift: 16,
            ctrl: 17,
            alt: 18,
            "pause/break": 19,
            "caps lock": 20,
            esc: 27,
            space: 32,
            "page up": 33,
            "page down": 34,
            end: 35,
            home: 36,
            left: 37,
            up: 38,
            right: 39,
            down: 40,
            insert: 45,
            delete: 46,
            command: 91,
            "left command": 91,
            "right command": 93,
            "numpad *": 106,
            "numpad +": 107,
            "numpad -": 109,
            "numpad .": 110,
            "numpad /": 111,
            "num lock": 144,
            "scroll lock": 145,
            "my computer": 182,
            "my calculator": 183,
            ";": 186,
            "=": 187,
            ",": 188,
            "-": 189,
            ".": 190,
            "/": 191,
            "`": 192,
            "[": 219,
            "\\": 220,
            "]": 221,
            "'": 222
        }
          , a = r.aliases = {
            windows: 91,
            "⇧": 16,
            "⌥": 18,
            "⌃": 17,
            "⌘": 91,
            ctl: 17,
            control: 17,
            option: 18,
            pause: 19,
            break: 19,
            caps: 20,
            return: 13,
            escape: 27,
            spc: 32,
            spacebar: 32,
            pgup: 33,
            pgdn: 34,
            ins: 45,
            del: 46,
            cmd: 91
        };
        for (s = 97; s < 123; s++)
            o[String.fromCharCode(s)] = s - 32;
        for (var s = 48; s < 58; s++)
            o[s - 48] = s;
        for (s = 1; s < 13; s++)
            o["f" + s] = s + 111;
        for (s = 0; s < 10; s++)
            o["numpad " + s] = s + 96;
        var u = r.names = r.title = {};
        for (s in o)
            u[o[s]] = s;
        for (var c in a)
            o[c] = a[c]
    }
    , {}],
    21: [function(e, t, r) {
        "use strict";
        var n = Object.getOwnPropertySymbols
          , i = Object.prototype.hasOwnProperty
          , o = Object.prototype.propertyIsEnumerable;
        t.exports = function() {
            try {
                if (!Object.assign)
                    return !1;
                var e = new String("abc");
                if (e[5] = "de",
                "5" === Object.getOwnPropertyNames(e)[0])
                    return !1;
                for (var t = {}, r = 0; r < 10; r++)
                    t["_" + String.fromCharCode(r)] = r;
                if ("0123456789" !== Object.getOwnPropertyNames(t).map(function(e) {
                    return t[e]
                }).join(""))
                    return !1;
                var n = {};
                return "abcdefghijklmnopqrst".split("").forEach(function(e) {
                    n[e] = e
                }),
                "abcdefghijklmnopqrst" === Object.keys(Object.assign({}, n)).join("")
            } catch (e) {
                return !1
            }
        }() ? Object.assign : function(e, t) {
            for (var r, a, s = function(e) {
                if (null === e || void 0 === e)
                    throw new TypeError("Object.assign cannot be called with null or undefined");
                return Object(e)
            }(e), u = 1; u < arguments.length; u++) {
                for (var c in r = Object(arguments[u]))
                    i.call(r, c) && (s[c] = r[c]);
                if (n) {
                    a = n(r);
                    for (var l = 0; l < a.length; l++)
                        o.call(r, a[l]) && (s[a[l]] = r[a[l]])
                }
            }
            return s
        }
    }
    , {}],
    22: [function(e, t, r) {
        "use strict";
        var n = e("ua-parser-js");
        t.exports = {
            getPlatformFromFilename: function(e) {
                var t = e.toLowerCase().split(/[-._/]/)
                  , r = t[t.length - 1];
                return "exe" === r ? "win32" : "zip" === r && t.includes("win32") ? "win32" : "zip" === r && t.includes("windows") ? "win32" : "zip" === r && t.includes("win") ? "win32" : "zip" === r && t.includes("ia32") ? "win32" : "dmg" === r ? "darwin" : "pkg" === r ? "darwin" : "zip" === r && t.includes("osx") ? "darwin" : "zip" === r && t.includes("mac") ? "darwin" : "zip" === r && t.includes("macos") ? "darwin" : "zip" === r && t.includes("mas") ? "darwin" : "zip" === r && t.includes("darwin") ? "darwin" : "rpm" === r ? "linux" : "deb" === r ? "linux" : "appimage" === r ? "linux" : "zip" === r && t.includes("linux") ? "linux" : null
            },
            getPlatformFromUserAgent: function(e) {
                var t = e ? n(e).os.name : n().os.name;
                return /mac/i.test(t) ? "darwin" : /windows/i.test(t) ? "win32" : /ubuntu|linux|gentoo|centos|redhat|suse|unix|fedora/i.test(t) ? "linux" : /freebsd/i.test(t) ? "freebsd" : /openbsd/i.test(t) ? "openbsd" : null
            },
            getPlatformLabel: function(e) {
                return "darwin" === e ? "macOS" : "win32" === e ? "Windows" : "linux" === e ? "Linux" : e
            }
        }
    }
    , {
        "ua-parser-js": 29
    }],
    23: [function(e, t, r) {
        "use strict";
        function n(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }
        t.exports = function(e, t, r, o) {
            t = t || "&",
            r = r || "=";
            var a = {};
            if ("string" != typeof e || 0 === e.length)
                return a;
            var s = /\+/g;
            e = e.split(t);
            var u = 1e3;
            o && "number" == typeof o.maxKeys && (u = o.maxKeys);
            var c = e.length;
            u > 0 && c > u && (c = u);
            for (var l = 0; l < c; ++l) {
                var d, f, p, m, h = e[l].replace(s, "%20"), b = h.indexOf(r);
                b >= 0 ? (d = h.substr(0, b),
                f = h.substr(b + 1)) : (d = h,
                f = ""),
                p = decodeURIComponent(d),
                m = decodeURIComponent(f),
                n(a, p) ? i(a[p]) ? a[p].push(m) : a[p] = [a[p], m] : a[p] = m
            }
            return a
        }
        ;
        var i = Array.isArray || function(e) {
            return "[object Array]" === Object.prototype.toString.call(e)
        }
    }
    , {}],
    24: [function(e, t, r) {
        "use strict";
        function n(e) {
            return (n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            }
            : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            }
            )(e)
        }
        var i = function(e) {
            switch (n(e)) {
            case "string":
                return e;
            case "boolean":
                return e ? "true" : "false";
            case "number":
                return isFinite(e) ? e : "";
            default:
                return ""
            }
        };
        t.exports = function(e, t, r, u) {
            return t = t || "&",
            r = r || "=",
            null === e && (e = void 0),
            "object" === n(e) ? a(s(e), function(n) {
                var s = encodeURIComponent(i(n)) + r;
                return o(e[n]) ? a(e[n], function(e) {
                    return s + encodeURIComponent(i(e))
                }).join(t) : s + encodeURIComponent(i(e[n]))
            }).join(t) : u ? encodeURIComponent(i(u)) + r + encodeURIComponent(i(e)) : ""
        }
        ;
        var o = Array.isArray || function(e) {
            return "[object Array]" === Object.prototype.toString.call(e)
        }
        ;
        function a(e, t) {
            if (e.map)
                return e.map(t);
            for (var r = [], n = 0; n < e.length; n++)
                r.push(t(e[n], n));
            return r
        }
        var s = Object.keys || function(e) {
            var t = [];
            for (var r in e)
                Object.prototype.hasOwnProperty.call(e, r) && t.push(r);
            return t
        }
    }
    , {}],
    25: [function(e, t, r) {
        "use strict";
        r.decode = r.parse = e("./decode"),
        r.encode = r.stringify = e("./encode")
    }
    , {
        "./decode": 23,
        "./encode": 24
    }],
    26: [function(e, t, r) {
        "use strict";
        var n = function(e) {
            var t = 864e5
              , r = [[42e3, "just now"], [9e4, "a minute ago"], [36e5, "minutes ago", 6e4], [54e5, "an hour ago"], [t, "hours ago", 36e5], [2 * t, "yesterday"], [7 * t, "days ago", t], [9072e5, "a week ago"], [2628e6, "weeks ago", 6048e5], [3942e6, "a month ago"], [31536e6, "months ago", 2628e6], [47304e6, "a year ago"], [Number.MAX_VALUE, "years ago", 31536e6]];
            return function(t, n) {
                !n && (n = (new Date).getTime()),
                n instanceof Date && (n = n.getTime()),
                t instanceof Date && (t = t.getTime());
                var i, o, a, s = n - t;
                for (o = -1,
                a = r.length; ++o < a; )
                    if (s < (i = r[o])[0])
                        return i[2] == e ? i[1] : Math.round(s / i[2]) + " " + i[1]
            }
        }();
        void 0 !== t && t.exports && (t.exports = n)
    }
    , {}],
    27: [function(e, t, r) {
        "use strict";
        var n = e("keycode")
          , i = e("assert");
        t.exports = function(e, t) {
            i("string" == typeof e, "inputSelector should be a string"),
            i("string" == typeof t, "hitsSelector should be a string");
            var r = 0
              , o = ["up", "down", "enter", "/", "esc"]
              , a = document.querySelector(e);
            function s() {
                Array.from(document.querySelectorAll(t)).forEach(function(e) {
                    e.classList.remove("active")
                })
            }
            function u() {
                return Array.from(document.querySelectorAll(t)).filter(function(e) {
                    return "none" !== e.style.display && null !== e.offsetParent
                })
            }
            function c() {
                (s(),
                0 === r) ? (a.focus(),
                a.select()) : (u()[r - 1].classList.add("active"),
                a.blur())
            }
            a.addEventListener("focus", function() {
                r = 0,
                s()
            }),
            a.addEventListener("keydown", function(e) {
                o.includes(e.code) || (r = 0,
                s())
            }),
            document.addEventListener("keydown", function(e) {
                if (e && e.code && o.includes(n(e))) {
                    var t = u()
                      , i = Boolean(a && a.value && a.value.length > 0);
                    switch (n(e)) {
                    case "esc":
                        return a.focus(),
                        a.select(),
                        void (a.value = "");
                    case "/":
                        e.target !== a && (a.focus(),
                        a.select(),
                        e.preventDefault());
                        break;
                    case "up":
                        if (!i)
                            return;
                        r > 0 && (r--,
                        e.preventDefault()),
                        c();
                        break;
                    case "down":
                        if (!i)
                            return;
                        r < t.length && (r++,
                        e.preventDefault()),
                        c();
                        break;
                    case "enter":
                        if (r > 0) {
                            var s = t[r - 1];
                            if (!s)
                                return;
                            var l = s.querySelector("a");
                            if (!l)
                                return;
                            var d = l.getAttribute("href");
                            if (!d)
                                return;
                            e.ctrlKey ? (window.open(d, "_blank"),
                            window.focus()) : window.location = d
                        }
                    }
                }
            })
        }
    }
    , {
        assert: 12,
        keycode: 20
    }],
    28: [function(e, t, r) {
        "use strict";
        function n(e) {
            return (n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            }
            : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            }
            )(e)
        }
        !function() {
            var e = {
                de_DE: {
                    days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
                    shortDays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
                    months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
                    shortMonths: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
                    AM: "AM",
                    PM: "PM",
                    am: "am",
                    pm: "pm",
                    formats: {
                        c: "%a %d %b %Y %X %Z",
                        D: "%d.%m.%Y",
                        F: "%Y-%m-%d",
                        R: "%H:%M",
                        r: "%I:%M:%S %p",
                        T: "%H:%M:%S",
                        v: "%e-%b-%Y",
                        X: "%T",
                        x: "%D"
                    }
                },
                en_CA: {
                    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    ordinalSuffixes: ["st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "st"],
                    AM: "AM",
                    PM: "PM",
                    am: "am",
                    pm: "pm",
                    formats: {
                        c: "%a %d %b %Y %X %Z",
                        D: "%d/%m/%y",
                        F: "%Y-%m-%d",
                        R: "%H:%M",
                        r: "%I:%M:%S %p",
                        T: "%H:%M:%S",
                        v: "%e-%b-%Y",
                        X: "%r",
                        x: "%D"
                    }
                },
                en_US: {
                    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    ordinalSuffixes: ["st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "st"],
                    AM: "AM",
                    PM: "PM",
                    am: "am",
                    pm: "pm",
                    formats: {
                        c: "%a %d %b %Y %X %Z",
                        D: "%m/%d/%y",
                        F: "%Y-%m-%d",
                        R: "%H:%M",
                        r: "%I:%M:%S %p",
                        T: "%H:%M:%S",
                        v: "%e-%b-%Y",
                        X: "%r",
                        x: "%D"
                    }
                },
                es_MX: {
                    days: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
                    shortDays: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
                    months: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", " diciembre"],
                    shortMonths: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
                    AM: "AM",
                    PM: "PM",
                    am: "am",
                    pm: "pm",
                    formats: {
                        c: "%a %d %b %Y %X %Z",
                        D: "%d/%m/%Y",
                        F: "%Y-%m-%d",
                        R: "%H:%M",
                        r: "%I:%M:%S %p",
                        T: "%H:%M:%S",
                        v: "%e-%b-%Y",
                        X: "%T",
                        x: "%D"
                    }
                },
                fr_FR: {
                    days: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
                    shortDays: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
                    months: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
                    shortMonths: ["janv.", "févr.", "mars", "avril", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."],
                    AM: "AM",
                    PM: "PM",
                    am: "am",
                    pm: "pm",
                    formats: {
                        c: "%a %d %b %Y %X %Z",
                        D: "%d/%m/%Y",
                        F: "%Y-%m-%d",
                        R: "%H:%M",
                        r: "%I:%M:%S %p",
                        T: "%H:%M:%S",
                        v: "%e-%b-%Y",
                        X: "%T",
                        x: "%D"
                    }
                },
                it_IT: {
                    days: ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"],
                    shortDays: ["dom", "lun", "mar", "mer", "gio", "ven", "sab"],
                    months: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
                    shortMonths: ["pr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"],
                    AM: "AM",
                    PM: "PM",
                    am: "am",
                    pm: "pm",
                    formats: {
                        c: "%a %d %b %Y %X %Z",
                        D: "%d/%m/%Y",
                        F: "%Y-%m-%d",
                        R: "%H:%M",
                        r: "%I:%M:%S %p",
                        T: "%H:%M:%S",
                        v: "%e-%b-%Y",
                        X: "%T",
                        x: "%D"
                    }
                },
                nl_NL: {
                    days: ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"],
                    shortDays: ["zo", "ma", "di", "wo", "do", "vr", "za"],
                    months: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"],
                    shortMonths: ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"],
                    AM: "AM",
                    PM: "PM",
                    am: "am",
                    pm: "pm",
                    formats: {
                        c: "%a %d %b %Y %X %Z",
                        D: "%d-%m-%y",
                        F: "%Y-%m-%d",
                        R: "%H:%M",
                        r: "%I:%M:%S %p",
                        T: "%H:%M:%S",
                        v: "%e-%b-%Y",
                        X: "%T",
                        x: "%D"
                    }
                },
                pt_BR: {
                    days: ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"],
                    shortDays: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
                    months: ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"],
                    shortMonths: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
                    AM: "AM",
                    PM: "PM",
                    am: "am",
                    pm: "pm",
                    formats: {
                        c: "%a %d %b %Y %X %Z",
                        D: "%d-%m-%Y",
                        F: "%Y-%m-%d",
                        R: "%H:%M",
                        r: "%I:%M:%S %p",
                        T: "%H:%M:%S",
                        v: "%e-%b-%Y",
                        X: "%T",
                        x: "%D"
                    }
                },
                ru_RU: {
                    days: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
                    shortDays: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
                    months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
                    shortMonths: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"],
                    AM: "AM",
                    PM: "PM",
                    am: "am",
                    pm: "pm",
                    formats: {
                        c: "%a %d %b %Y %X",
                        D: "%d.%m.%y",
                        F: "%Y-%m-%d",
                        R: "%H:%M",
                        r: "%I:%M:%S %p",
                        T: "%H:%M:%S",
                        v: "%e-%b-%Y",
                        X: "%T",
                        x: "%D"
                    }
                },
                tr_TR: {
                    days: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
                    shortDays: ["Paz", "Pzt", "Sal", "Çrş", "Prş", "Cum", "Cts"],
                    months: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
                    shortMonths: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
                    AM: "ÖÖ",
                    PM: "ÖS",
                    am: "ÖÖ",
                    pm: "ÖS",
                    formats: {
                        c: "%a %d %b %Y %X %Z",
                        D: "%d-%m-%Y",
                        F: "%Y-%m-%d",
                        R: "%H:%M",
                        r: "%I:%M:%S %p",
                        T: "%H:%M:%S",
                        v: "%e-%b-%Y",
                        X: "%T",
                        x: "%D"
                    }
                },
                zh_CN: {
                    days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
                    shortDays: ["日", "一", "二", "三", "四", "五", "六"],
                    months: ["一月份", "二月份", "三月份", "四月份", "五月份", "六月份", "七月份", "八月份", "九月份", "十月份", "十一月份", "十二月份"],
                    shortMonths: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                    AM: "上午",
                    PM: "下午",
                    am: "上午",
                    pm: "下午",
                    formats: {
                        c: "%a %d %b %Y %X %Z",
                        D: "%d/%m/%y",
                        F: "%Y-%m-%d",
                        R: "%H:%M",
                        r: "%I:%M:%S %p",
                        T: "%H:%M:%S",
                        v: "%e-%b-%Y",
                        X: "%r",
                        x: "%D"
                    }
                }
            }
              , r = e.en_US
              , i = new function t(i, f, p) {
                var m, h = i || r, b = f || 0, g = p || !1, y = 0;
                var w = function(e, t) {
                    var r;
                    if (t) {
                        if (r = t.getTime(),
                        g) {
                            var n = l(t);
                            if (l(t = new Date(r + n + b)) !== n) {
                                var i = l(t);
                                t = new Date(r + i + b)
                            }
                        }
                    } else {
                        var f = Date.now();
                        f > y ? (y = f,
                        m = new Date(y),
                        r = y,
                        g && (m = new Date(y + l(m) + b))) : r = y,
                        t = m
                    }
                    return function e(t, r, n, i) {
                        var l = ""
                          , f = null
                          , p = !1
                          , m = t.length
                          , h = !1;
                        for (var y = 0; y < m; y++) {
                            var w = t.charCodeAt(y);
                            if (!0 !== p)
                                37 !== w ? l += t[y] : p = !0;
                            else {
                                if (45 === w) {
                                    f = "";
                                    continue
                                }
                                if (95 === w) {
                                    f = " ";
                                    continue
                                }
                                if (48 === w) {
                                    f = "0";
                                    continue
                                }
                                if (58 === w) {
                                    h && d("[WARNING] detected use of unsupported %:: or %::: modifiers to strftime"),
                                    h = !0;
                                    continue
                                }
                                switch (w) {
                                case 37:
                                    l += "%";
                                    break;
                                case 65:
                                    l += n.days[r.getDay()];
                                    break;
                                case 66:
                                    l += n.months[r.getMonth()];
                                    break;
                                case 67:
                                    l += o(Math.floor(r.getFullYear() / 100), f);
                                    break;
                                case 68:
                                    l += e(n.formats.D, r, n, i);
                                    break;
                                case 70:
                                    l += e(n.formats.F, r, n, i);
                                    break;
                                case 72:
                                    l += o(r.getHours(), f);
                                    break;
                                case 73:
                                    l += o(s(r.getHours()), f);
                                    break;
                                case 76:
                                    l += a(Math.floor(i % 1e3));
                                    break;
                                case 77:
                                    l += o(r.getMinutes(), f);
                                    break;
                                case 80:
                                    l += r.getHours() < 12 ? n.am : n.pm;
                                    break;
                                case 82:
                                    l += e(n.formats.R, r, n, i);
                                    break;
                                case 83:
                                    l += o(r.getSeconds(), f);
                                    break;
                                case 84:
                                    l += e(n.formats.T, r, n, i);
                                    break;
                                case 85:
                                    l += o(u(r, "sunday"), f);
                                    break;
                                case 87:
                                    l += o(u(r, "monday"), f);
                                    break;
                                case 88:
                                    l += e(n.formats.X, r, n, i);
                                    break;
                                case 89:
                                    l += r.getFullYear();
                                    break;
                                case 90:
                                    if (g && 0 === b)
                                        l += "GMT";
                                    else {
                                        var v = r.toString().match(/\(([\w\s]+)\)/);
                                        l += v && v[1] || ""
                                    }
                                    break;
                                case 97:
                                    l += n.shortDays[r.getDay()];
                                    break;
                                case 98:
                                    l += n.shortMonths[r.getMonth()];
                                    break;
                                case 99:
                                    l += e(n.formats.c, r, n, i);
                                    break;
                                case 100:
                                    l += o(r.getDate(), f);
                                    break;
                                case 101:
                                    l += o(r.getDate(), null == f ? " " : f);
                                    break;
                                case 104:
                                    l += n.shortMonths[r.getMonth()];
                                    break;
                                case 106:
                                    var S = new Date(r.getFullYear(),0,1)
                                      , x = Math.ceil((r.getTime() - S.getTime()) / 864e5);
                                    l += a(x);
                                    break;
                                case 107:
                                    l += o(r.getHours(), null == f ? " " : f);
                                    break;
                                case 108:
                                    l += o(s(r.getHours()), null == f ? " " : f);
                                    break;
                                case 109:
                                    l += o(r.getMonth() + 1, f);
                                    break;
                                case 110:
                                    l += "\n";
                                    break;
                                case 111:
                                    var x = r.getDate();
                                    n.ordinalSuffixes ? l += String(x) + (n.ordinalSuffixes[x - 1] || c(x)) : l += String(x) + c(x);
                                    break;
                                case 112:
                                    l += r.getHours() < 12 ? n.AM : n.PM;
                                    break;
                                case 114:
                                    l += e(n.formats.r, r, n, i);
                                    break;
                                case 115:
                                    l += Math.floor(i / 1e3);
                                    break;
                                case 116:
                                    l += "\t";
                                    break;
                                case 117:
                                    var x = r.getDay();
                                    l += 0 === x ? 7 : x;
                                    break;
                                case 118:
                                    l += e(n.formats.v, r, n, i);
                                    break;
                                case 119:
                                    l += r.getDay();
                                    break;
                                case 120:
                                    l += e(n.formats.x, r, n, i);
                                    break;
                                case 121:
                                    l += ("" + r.getFullYear()).slice(2);
                                    break;
                                case 122:
                                    if (g && 0 === b)
                                        l += h ? "+00:00" : "+0000";
                                    else {
                                        var k, M = (k = 0 !== b ? b / 6e4 : -r.getTimezoneOffset()) < 0 ? "-" : "+", E = h ? ":" : "", A = Math.floor(Math.abs(k / 60)), D = Math.abs(k % 60);
                                        l += M + o(A) + E + o(D)
                                    }
                                    break;
                                default:
                                    p && (l += "%"),
                                    l += t[y]
                                }
                                f = null,
                                p = !1
                            }
                        }
                        return l
                    }(e, t, h, r)
                };
                w.localize = function(e) {
                    return new t(e || h,b,g)
                }
                ;
                w.localizeByIdentifier = function(t) {
                    var r = e[t];
                    return r ? w.localize(r) : (d('[WARNING] No locale found with identifier "' + t + '".'),
                    w)
                }
                ;
                w.timezone = function(e) {
                    var r = b
                      , i = g
                      , o = n(e);
                    if ("number" === o || "string" === o)
                        if (i = !0,
                        "string" === o) {
                            var a = "-" === e[0] ? -1 : 1
                              , s = parseInt(e.slice(1, 3), 10)
                              , u = parseInt(e.slice(3, 5), 10);
                            r = a * (60 * s + u) * 60 * 1e3
                        } else
                            "number" === o && (r = 60 * e * 1e3);
                    return new t(h,r,i)
                }
                ;
                w.utc = function() {
                    return new t(h,b,!0)
                }
                ;
                return w
            }
            (r,0,!1);
            function o(e, t) {
                return "" === t || e > 9 ? e : (null == t && (t = "0"),
                t + e)
            }
            function a(e) {
                return e > 99 ? e : e > 9 ? "0" + e : "00" + e
            }
            function s(e) {
                return 0 === e ? 12 : e > 12 ? e - 12 : e
            }
            function u(e, t) {
                t = t || "sunday";
                var r = e.getDay();
                "monday" === t && (0 === r ? r = 6 : r--);
                var n = Date.UTC(e.getFullYear(), 0, 1)
                  , i = Date.UTC(e.getFullYear(), e.getMonth(), e.getDate())
                  , o = (Math.floor((i - n) / 864e5) + 7 - r) / 7;
                return Math.floor(o)
            }
            function c(e) {
                var t = e % 10
                  , r = e % 100;
                if (r >= 11 && r <= 13 || 0 === t || t >= 4)
                    return "th";
                switch (t) {
                case 1:
                    return "st";
                case 2:
                    return "nd";
                case 3:
                    return "rd"
                }
            }
            function l(e) {
                return 6e4 * (e.getTimezoneOffset() || 0)
            }
            function d(e) {
                "undefined" != typeof console && "function" == typeof console.warn && console.warn(e)
            }
            void 0 !== t ? t.exports = i : (function() {
                return this || (0,
                eval)("this")
            }()).strftime = i,
            "function" != typeof Date.now && (Date.now = function() {
                return +new Date
            }
            )
        }()
    }
    , {}],
    29: [function(e, t, r) {
        "use strict";
        function n(e) {
            return (n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            }
            : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            }
            )(e)
        }
        !function(e, i) {
            var o = "model"
              , a = "name"
              , s = "type"
              , u = "vendor"
              , c = "version"
              , l = "mobile"
              , d = "tablet"
              , f = {
                extend: function(e, t) {
                    var r = {};
                    for (var n in e)
                        t[n] && t[n].length % 2 == 0 ? r[n] = t[n].concat(e[n]) : r[n] = e[n];
                    return r
                },
                has: function(e, t) {
                    return "string" == typeof e && -1 !== t.toLowerCase().indexOf(e.toLowerCase())
                },
                lowerize: function(e) {
                    return e.toLowerCase()
                },
                major: function(e) {
                    return "string" === n(e) ? e.replace(/[^\d\.]/g, "").split(".")[0] : void 0
                },
                trim: function(e) {
                    return e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
                }
            }
              , p = {
                rgx: function(e, t) {
                    for (var r, i, o, a, s, u, c = 0; c < t.length && !s; ) {
                        var l = t[c]
                          , d = t[c + 1];
                        for (r = i = 0; r < l.length && !s; )
                            if (s = l[r++].exec(e))
                                for (o = 0; o < d.length; o++)
                                    u = s[++i],
                                    "object" === n(a = d[o]) && a.length > 0 ? 2 == a.length ? "function" == n(a[1]) ? this[a[0]] = a[1].call(this, u) : this[a[0]] = a[1] : 3 == a.length ? "function" !== n(a[1]) || a[1].exec && a[1].test ? this[a[0]] = u ? u.replace(a[1], a[2]) : void 0 : this[a[0]] = u ? a[1].call(this, u, a[2]) : void 0 : 4 == a.length && (this[a[0]] = u ? a[3].call(this, u.replace(a[1], a[2])) : void 0) : this[a] = u || void 0;
                        c += 2
                    }
                },
                str: function(e, t) {
                    for (var r in t)
                        if ("object" === n(t[r]) && t[r].length > 0) {
                            for (var i = 0; i < t[r].length; i++)
                                if (f.has(t[r][i], e))
                                    return "?" === r ? void 0 : r
                        } else if (f.has(t[r], e))
                            return "?" === r ? void 0 : r;
                    return e
                }
            }
              , m = {
                browser: {
                    oldsafari: {
                        version: {
                            "1.0": "/8",
                            1.2: "/1",
                            1.3: "/3",
                            "2.0": "/412",
                            "2.0.2": "/416",
                            "2.0.3": "/417",
                            "2.0.4": "/419",
                            "?": "/"
                        }
                    }
                },
                device: {
                    amazon: {
                        model: {
                            "Fire Phone": ["SD", "KF"]
                        }
                    },
                    sprint: {
                        model: {
                            "Evo Shift 4G": "7373KT"
                        },
                        vendor: {
                            HTC: "APA",
                            Sprint: "Sprint"
                        }
                    }
                },
                os: {
                    windows: {
                        version: {
                            ME: "4.90",
                            "NT 3.11": "NT3.51",
                            "NT 4.0": "NT4.0",
                            2000: "NT 5.0",
                            XP: ["NT 5.1", "NT 5.2"],
                            Vista: "NT 6.0",
                            7: "NT 6.1",
                            8: "NT 6.2",
                            8.1: "NT 6.3",
                            10: ["NT 6.4", "NT 10.0"],
                            RT: "ARM"
                        }
                    }
                }
            }
              , h = {
                browser: [[/(opera\smini)\/([\w\.-]+)/i, /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i, /(opera).+version\/([\w\.]+)/i, /(opera)[\/\s]+([\w\.]+)/i], [a, c], [/(opios)[\/\s]+([\w\.]+)/i], [[a, "Opera Mini"], c], [/\s(opr)\/([\w\.]+)/i], [[a, "Opera"], c], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]*)/i, /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i, /(?:ms|\()(ie)\s([\w\.]+)/i, /(rekonq)\/([\w\.]*)/i, /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark)\/([\w\.-]+)/i], [a, c], [/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i], [[a, "IE"], c], [/(edge|edgios|edga)\/((\d+)?[\w\.]+)/i], [[a, "Edge"], c], [/(yabrowser)\/([\w\.]+)/i], [[a, "Yandex"], c], [/(puffin)\/([\w\.]+)/i], [[a, "Puffin"], c], [/(focus)\/([\w\.]+)/i], [[a, "Firefox Focus"], c], [/(opt)\/([\w\.]+)/i], [[a, "Opera Touch"], c], [/((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i], [[a, "UCBrowser"], c], [/(comodo_dragon)\/([\w\.]+)/i], [[a, /_/g, " "], c], [/(micromessenger)\/([\w\.]+)/i], [[a, "WeChat"], c], [/(brave)\/([\w\.]+)/i], [[a, "Brave"], c], [/(qqbrowserlite)\/([\w\.]+)/i], [a, c], [/(QQ)\/([\d\.]+)/i], [a, c], [/m?(qqbrowser)[\/\s]?([\w\.]+)/i], [a, c], [/(BIDUBrowser)[\/\s]?([\w\.]+)/i], [a, c], [/(2345Explorer)[\/\s]?([\w\.]+)/i], [a, c], [/(MetaSr)[\/\s]?([\w\.]+)/i], [a], [/(LBBROWSER)/i], [a], [/xiaomi\/miuibrowser\/([\w\.]+)/i], [c, [a, "MIUI Browser"]], [/;fbav\/([\w\.]+);/i], [c, [a, "Facebook"]], [/safari\s(line)\/([\w\.]+)/i, /android.+(line)\/([\w\.]+)\/iab/i], [a, c], [/headlesschrome(?:\/([\w\.]+)|\s)/i], [c, [a, "Chrome Headless"]], [/\swv\).+(chrome)\/([\w\.]+)/i], [[a, /(.+)/, "$1 WebView"], c], [/((?:oculus|samsung)browser)\/([\w\.]+)/i], [[a, /(.+(?:g|us))(.+)/, "$1 $2"], c], [/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i], [c, [a, "Android Browser"]], [/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i], [a, c], [/(dolfin)\/([\w\.]+)/i], [[a, "Dolphin"], c], [/((?:android.+)crmo|crios)\/([\w\.]+)/i], [[a, "Chrome"], c], [/(coast)\/([\w\.]+)/i], [[a, "Opera Coast"], c], [/fxios\/([\w\.-]+)/i], [c, [a, "Firefox"]], [/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i], [c, [a, "Mobile Safari"]], [/version\/([\w\.]+).+?(mobile\s?safari|safari)/i], [c, a], [/webkit.+?(gsa)\/([\w\.]+).+?(mobile\s?safari|safari)(\/[\w\.]+)/i], [[a, "GSA"], c], [/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i], [a, [c, p.str, m.browser.oldsafari.version]], [/(konqueror)\/([\w\.]+)/i, /(webkit|khtml)\/([\w\.]+)/i], [a, c], [/(navigator|netscape)\/([\w\.-]+)/i], [[a, "Netscape"], c], [/(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i, /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([\w\.-]+)$/i, /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i, /(links)\s\(([\w\.]+)/i, /(gobrowser)\/?([\w\.]*)/i, /(ice\s?browser)\/v?([\w\._]+)/i, /(mosaic)[\/\s]([\w\.]+)/i], [a, c]],
                cpu: [[/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i], [["architecture", "amd64"]], [/(ia32(?=;))/i], [["architecture", f.lowerize]], [/((?:i[346]|x)86)[;\)]/i], [["architecture", "ia32"]], [/windows\s(ce|mobile);\sppc;/i], [["architecture", "arm"]], [/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i], [["architecture", /ower/, "", f.lowerize]], [/(sun4\w)[;\)]/i], [["architecture", "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+[;l]))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i], [["architecture", f.lowerize]]],
                device: [[/\((ipad|playbook);[\w\s\);-]+(rim|apple)/i], [o, u, [s, d]], [/applecoremedia\/[\w\.]+ \((ipad)/], [o, [u, "Apple"], [s, d]], [/(apple\s{0,1}tv)/i], [[o, "Apple TV"], [u, "Apple"]], [/(archos)\s(gamepad2?)/i, /(hp).+(touchpad)/i, /(hp).+(tablet)/i, /(kindle)\/([\w\.]+)/i, /\s(nook)[\w\s]+build\/(\w+)/i, /(dell)\s(strea[kpr\s\d]*[\dko])/i], [u, o, [s, d]], [/(kf[A-z]+)\sbuild\/.+silk\//i], [o, [u, "Amazon"], [s, d]], [/(sd|kf)[0349hijorstuw]+\sbuild\/.+silk\//i], [[o, p.str, m.device.amazon.model], [u, "Amazon"], [s, l]], [/android.+aft([bms])\sbuild/i], [o, [u, "Amazon"], [s, "smarttv"]], [/\((ip[honed|\s\w*]+);.+(apple)/i], [o, u, [s, l]], [/\((ip[honed|\s\w*]+);/i], [o, [u, "Apple"], [s, l]], [/(blackberry)[\s-]?(\w+)/i, /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]*)/i, /(hp)\s([\w\s]+\w)/i, /(asus)-?(\w+)/i], [u, o, [s, l]], [/\(bb10;\s(\w+)/i], [o, [u, "BlackBerry"], [s, l]], [/android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone)/i], [o, [u, "Asus"], [s, d]], [/(sony)\s(tablet\s[ps])\sbuild\//i, /(sony)?(?:sgp.+)\sbuild\//i], [[u, "Sony"], [o, "Xperia Tablet"], [s, d]], [/android.+\s([c-g]\d{4}|so[-l]\w+)\sbuild\//i], [o, [u, "Sony"], [s, l]], [/\s(ouya)\s/i, /(nintendo)\s([wids3u]+)/i], [u, o, [s, "console"]], [/android.+;\s(shield)\sbuild/i], [o, [u, "Nvidia"], [s, "console"]], [/(playstation\s[34portablevi]+)/i], [o, [u, "Sony"], [s, "console"]], [/(sprint\s(\w+))/i], [[u, p.str, m.device.sprint.vendor], [o, p.str, m.device.sprint.model], [s, l]], [/(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i], [u, o, [s, d]], [/(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i, /(zte)-(\w*)/i, /(alcatel|geeksphone|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]*)/i], [u, [o, /_/g, " "], [s, l]], [/(nexus\s9)/i], [o, [u, "HTC"], [s, d]], [/d\/huawei([\w\s-]+)[;\)]/i, /(nexus\s6p)/i], [o, [u, "Huawei"], [s, l]], [/(microsoft);\s(lumia[\s\w]+)/i], [u, o, [s, l]], [/[\s\(;](xbox(?:\sone)?)[\s\);]/i], [o, [u, "Microsoft"], [s, "console"]], [/(kin\.[onetw]{3})/i], [[o, /\./g, " "], [u, "Microsoft"], [s, l]], [/\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?:?(\s4g)?)[\w\s]+build\//i, /mot[\s-]?(\w*)/i, /(XT\d{3,4}) build\//i, /(nexus\s6)/i], [o, [u, "Motorola"], [s, l]], [/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i], [o, [u, "Motorola"], [s, d]], [/hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i], [[u, f.trim], [o, f.trim], [s, "smarttv"]], [/hbbtv.+maple;(\d+)/i], [[o, /^/, "SmartTV"], [u, "Samsung"], [s, "smarttv"]], [/\(dtv[\);].+(aquos)/i], [o, [u, "Sharp"], [s, "smarttv"]], [/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i, /((SM-T\w+))/i], [[u, "Samsung"], o, [s, d]], [/smart-tv.+(samsung)/i], [u, [s, "smarttv"], o], [/((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i, /(sam[sung]*)[\s-]*(\w+-?[\w-]*)/i, /sec-((sgh\w+))/i], [[u, "Samsung"], o, [s, l]], [/sie-(\w*)/i], [o, [u, "Siemens"], [s, l]], [/(maemo|nokia).*(n900|lumia\s\d+)/i, /(nokia)[\s_-]?([\w-]*)/i], [[u, "Nokia"], o, [s, l]], [/android\s3\.[\s\w;-]{10}(a\d{3})/i], [o, [u, "Acer"], [s, d]], [/android.+([vl]k\-?\d{3})\s+build/i], [o, [u, "LG"], [s, d]], [/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i], [[u, "LG"], o, [s, d]], [/(lg) netcast\.tv/i], [u, o, [s, "smarttv"]], [/(nexus\s[45])/i, /lg[e;\s\/-]+(\w*)/i, /android.+lg(\-?[\d\w]+)\s+build/i], [o, [u, "LG"], [s, l]], [/android.+(ideatab[a-z0-9\-\s]+)/i], [o, [u, "Lenovo"], [s, d]], [/linux;.+((jolla));/i], [u, o, [s, l]], [/((pebble))app\/[\d\.]+\s/i], [u, o, [s, "wearable"]], [/android.+;\s(oppo)\s?([\w\s]+)\sbuild/i], [u, o, [s, l]], [/crkey/i], [[o, "Chromecast"], [u, "Google"]], [/android.+;\s(glass)\s\d/i], [o, [u, "Google"], [s, "wearable"]], [/android.+;\s(pixel c)[\s)]/i], [o, [u, "Google"], [s, d]], [/android.+;\s(pixel( [23])?( xl)?)\s/i], [o, [u, "Google"], [s, l]], [/android.+;\s(\w+)\s+build\/hm\1/i, /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i, /android.+(mi[\s\-_]*(?:one|one[\s_]plus|note lte)?[\s_]*(?:\d?\w?)[\s_]*(?:plus)?)\s+build/i, /android.+(redmi[\s\-_]*(?:note)?(?:[\s_]*[\w\s]+))\s+build/i], [[o, /_/g, " "], [u, "Xiaomi"], [s, l]], [/android.+(mi[\s\-_]*(?:pad)(?:[\s_]*[\w\s]+))\s+build/i], [[o, /_/g, " "], [u, "Xiaomi"], [s, d]], [/android.+;\s(m[1-5]\snote)\sbuild/i], [o, [u, "Meizu"], [s, d]], [/(mz)-([\w-]{2,})/i], [[u, "Meizu"], o, [s, l]], [/android.+a000(1)\s+build/i, /android.+oneplus\s(a\d{4})\s+build/i], [o, [u, "OnePlus"], [s, l]], [/android.+[;\/]\s*(RCT[\d\w]+)\s+build/i], [o, [u, "RCA"], [s, d]], [/android.+[;\/\s]+(Venue[\d\s]{2,7})\s+build/i], [o, [u, "Dell"], [s, d]], [/android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i], [o, [u, "Verizon"], [s, d]], [/android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(V?.*)\s+build/i], [[u, "Barnes & Noble"], o, [s, d]], [/android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i], [o, [u, "NuVision"], [s, d]], [/android.+;\s(k88)\sbuild/i], [o, [u, "ZTE"], [s, d]], [/android.+[;\/]\s*(gen\d{3})\s+build.*49h/i], [o, [u, "Swiss"], [s, l]], [/android.+[;\/]\s*(zur\d{3})\s+build/i], [o, [u, "Swiss"], [s, d]], [/android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i], [o, [u, "Zeki"], [s, d]], [/(android).+[;\/]\s+([YR]\d{2})\s+build/i, /android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(\w{5})\sbuild/i], [[u, "Dragon Touch"], o, [s, d]], [/android.+[;\/]\s*(NS-?\w{0,9})\sbuild/i], [o, [u, "Insignia"], [s, d]], [/android.+[;\/]\s*((NX|Next)-?\w{0,9})\s+build/i], [o, [u, "NextBook"], [s, d]], [/android.+[;\/]\s*(Xtreme\_)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i], [[u, "Voice"], o, [s, l]], [/android.+[;\/]\s*(LVTEL\-)?(V1[12])\s+build/i], [[u, "LvTel"], o, [s, l]], [/android.+;\s(PH-1)\s/i], [o, [u, "Essential"], [s, l]], [/android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i], [o, [u, "Envizen"], [s, d]], [/android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(\w{1,9})\s+build/i], [u, o, [s, d]], [/android.+[;\/]\s*(Trio[\s\-]*.*)\s+build/i], [o, [u, "MachSpeed"], [s, d]], [/android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i], [u, o, [s, d]], [/android.+[;\/]\s*TU_(1491)\s+build/i], [o, [u, "Rotor"], [s, d]], [/android.+(KS(.+))\s+build/i], [o, [u, "Amazon"], [s, d]], [/android.+(Gigaset)[\s\-]+(Q\w{1,9})\s+build/i], [u, o, [s, d]], [/\s(tablet|tab)[;\/]/i, /\s(mobile)(?:[;\/]|\ssafari)/i], [[s, f.lowerize], u, o], [/(android[\w\.\s\-]{0,9});.+build/i], [o, [u, "Generic"]]],
                engine: [[/windows.+\sedge\/([\w\.]+)/i], [c, [a, "EdgeHTML"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i, /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i, /(icab)[\/\s]([23]\.[\d\.]+)/i], [a, c], [/rv\:([\w\.]{1,9}).+(gecko)/i], [c, a]],
                os: [[/microsoft\s(windows)\s(vista|xp)/i], [a, c], [/(windows)\snt\s6\.2;\s(arm)/i, /(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s\w]*)/i, /(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i], [a, [c, p.str, m.os.windows.version]], [/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i], [[a, "Windows"], [c, p.str, m.os.windows.version]], [/\((bb)(10);/i], [[a, "BlackBerry"], c], [/(blackberry)\w*\/?([\w\.]*)/i, /(tizen)[\/\s]([\w\.]+)/i, /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]*)/i, /linux;.+(sailfish);/i], [a, c], [/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]*)/i], [[a, "Symbian"], c], [/\((series40);/i], [a], [/mozilla.+\(mobile;.+gecko.+firefox/i], [[a, "Firefox OS"], c], [/(nintendo|playstation)\s([wids34portablevu]+)/i, /(mint)[\/\s\(]?(\w*)/i, /(mageia|vectorlinux)[;\s]/i, /(joli|[kxln]?ubuntu|debian|suse|opensuse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]*)/i, /(hurd|linux)\s?([\w\.]*)/i, /(gnu)\s?([\w\.]*)/i], [a, c], [/(cros)\s[\w]+\s([\w\.]+\w)/i], [[a, "Chromium OS"], c], [/(sunos)\s?([\w\.\d]*)/i], [[a, "Solaris"], c], [/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]*)/i], [a, c], [/(haiku)\s(\w+)/i], [a, c], [/cfnetwork\/.+darwin/i, /ip[honead]{2,4}(?:.*os\s([\w]+)\slike\smac|;\sopera)/i], [[c, /_/g, "."], [a, "iOS"]], [/(mac\sos\sx)\s?([\w\s\.]*)/i, /(macintosh|mac(?=_powerpc)\s)/i], [[a, "Mac OS"], [c, /_/g, "."]], [/((?:open)?solaris)[\/\s-]?([\w\.]*)/i, /(aix)\s((\d)(?=\.|\)|\s)[\w\.])*/i, /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms|fuchsia)/i, /(unix)\s?([\w\.]*)/i], [a, c]]
            }
              , b = function t(r, i) {
                if ("object" === n(r) && (i = r,
                r = void 0),
                !(this instanceof t))
                    return new t(r,i).getResult();
                var o = r || (e && e.navigator && e.navigator.userAgent ? e.navigator.userAgent : "")
                  , a = i ? f.extend(h, i) : h;
                return this.getBrowser = function() {
                    var e = {
                        name: void 0,
                        version: void 0
                    };
                    return p.rgx.call(e, o, a.browser),
                    e.major = f.major(e.version),
                    e
                }
                ,
                this.getCPU = function() {
                    var e = {
                        architecture: void 0
                    };
                    return p.rgx.call(e, o, a.cpu),
                    e
                }
                ,
                this.getDevice = function() {
                    var e = {
                        vendor: void 0,
                        model: void 0,
                        type: void 0
                    };
                    return p.rgx.call(e, o, a.device),
                    e
                }
                ,
                this.getEngine = function() {
                    var e = {
                        name: void 0,
                        version: void 0
                    };
                    return p.rgx.call(e, o, a.engine),
                    e
                }
                ,
                this.getOS = function() {
                    var e = {
                        name: void 0,
                        version: void 0
                    };
                    return p.rgx.call(e, o, a.os),
                    e
                }
                ,
                this.getResult = function() {
                    return {
                        ua: this.getUA(),
                        browser: this.getBrowser(),
                        engine: this.getEngine(),
                        os: this.getOS(),
                        device: this.getDevice(),
                        cpu: this.getCPU()
                    }
                }
                ,
                this.getUA = function() {
                    return o
                }
                ,
                this.setUA = function(e) {
                    return o = e,
                    this
                }
                ,
                this
            };
            b.VERSION = "0.7.19",
            b.BROWSER = {
                NAME: a,
                MAJOR: "major",
                VERSION: c
            },
            b.CPU = {
                ARCHITECTURE: "architecture"
            },
            b.DEVICE = {
                MODEL: o,
                VENDOR: u,
                TYPE: s,
                CONSOLE: "console",
                MOBILE: l,
                SMARTTV: "smarttv",
                TABLET: d,
                WEARABLE: "wearable",
                EMBEDDED: "embedded"
            },
            b.ENGINE = {
                NAME: a,
                VERSION: c
            },
            b.OS = {
                NAME: a,
                VERSION: c
            },
            "undefined" !== (void 0 === r ? "undefined" : n(r)) ? ("undefined" !== (void 0 === t ? "undefined" : n(t)) && t.exports && (r = t.exports = b),
            r.UAParser = b) : "function" === ("undefined" == typeof define ? "undefined" : n(define)) && define.amd ? define(function() {
                return b
            }) : e && (e.UAParser = b);
            var g = e && (e.jQuery || e.Zepto);
            if ("undefined" !== n(g) && !g.ua) {
                var y = new b;
                g.ua = y.getResult(),
                g.ua.get = function() {
                    return y.getUA()
                }
                ,
                g.ua.set = function(e) {
                    y.setUA(e);
                    var t = y.getResult();
                    for (var r in t)
                        g.ua[r] = t[r]
                }
            }
        }("object" === ("undefined" == typeof window ? "undefined" : n(window)) ? window : void 0)
    }
    , {}]
}, {}, [6])


console.log("index.js 运行结束");
