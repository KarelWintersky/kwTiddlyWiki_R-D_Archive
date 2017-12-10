function main() {
    window.originalHTML = recreateOriginal();
    var a, b, c, d, e, f, g, h, i, j, k = new Date;
    startingUp = !0;
    var l = jQuery(document);
    jQuery.noConflict(), window.onbeforeunload = function (a) {
        if (window.confirmExit)return confirmExit()
    }, params = getParameters(), params && (params = params.parseParams("open", null, !1)), store = new TiddlyWiki({config: config}), invokeParamifier(params, "oninit"), story = new Story("tiddlerDisplay", "tiddler"), addEvent(document, "click", Popup.onDocumentClick), saveTest();
    var m;
    for (m = 0; m < config.notifyTiddlers.length; m++)store.addNotification(config.notifyTiddlers[m].name, config.notifyTiddlers[m].notify);
    j = new Date, loadShadowTiddlers(), l.trigger("loadShadows"), i = new Date, store.loadFromDiv("storeArea", "store", !0), l.trigger("loadTiddlers"), loadOptions(), h = new Date, invokeParamifier(params, "onload"), g = new Date, readOnly = !window.isLocal() && config.options.chkHttpReadOnly;
    var n = loadPlugins("systemConfig");
    l.trigger("loadPlugins"), f = new Date, formatter = new Formatter(config.formatters), invokeParamifier(params, "onconfig"), story.switchTheme(config.options.txtTheme), showBackstage = void 0 !== showBackstage ? showBackstage : !readOnly, e = new Date;
    var o;
    for (o in config.macros)config.macros[o].init && config.macros[o].init();
    d = new Date, store.notifyAll(), c = new Date, restart(), refreshDisplay(), b = new Date, n && (story.displayTiddler(null, "PluginManager"), displayMessage(config.messages.customConfigError)), showBackstage && backstage.init(), a = new Date, config.options.chkDisplayInstrumentation && (displayMessage("LoadShadows " + (i - j) + " ms"), displayMessage("LoadFromDiv " + (h - i) + " ms"), displayMessage("LoadPlugins " + (f - g) + " ms"), displayMessage("Macro init " + (d - e) + " ms"), displayMessage("Notify " + (c - d) + " ms"), displayMessage("Restart " + (b - c) + " ms"), displayMessage("Total: " + (a - k) + " ms")), startingUp = !1, l.trigger("startup")
}
function unload() {
    window.checkUnsavedChanges && checkUnsavedChanges(), window.scrubNodes && scrubNodes(document.body)
}
function restart() {
    invokeParamifier(params, "onstart"), story.isEmpty() && story.displayDefaultTiddlers(), window.scrollTo(0, 0)
}
function saveTest() {
    var a = document.getElementById("saveTest");
    a.hasChildNodes() && alert(config.messages.savedSnapshotError), a.appendChild(document.createTextNode("savetest"))
}
function loadShadowTiddlers() {
    var a = new TiddlyWiki;
    a.loadFromDiv("shadowArea", "shadows", !0), a.forEachTiddler(function (a, b) {
        config.shadowTiddlers[a] = b.text
    })
}
function loadPlugins(a) {
    if (safeMode)return !1;
    var b = store.getTaggedTiddlers(a);
    b.sort(function (a, b) {
        return a.title < b.title ? -1 : a.title == b.title ? 0 : 1
    });
    var c = [], d = 0, e = {}, f = b.length;
    installedPlugins = [];
    var g;
    for (g = 0; g < f; g++) {
        var h = getPluginInfo(b[g]);
        installedPlugins[g] = h;
        var i = h.Name || h.title;
        i && (e[i] = h), i = h.Source, i && (e[i] = h)
    }
    var j = function (a) {
        if (a && !a.done) {
            a.done = 1;
            var b = a.Requires;
            if (b) {
                b = b.readBracketedList();
                var d;
                for (d = 0; d < b.length; d++)j(e[b[d]])
            }
            c.push(a)
        }
    };
    for (g = 0; g < f; g++)j(installedPlugins[g]);
    for (g = 0; g < c.length; g++)if (h = c[g], pluginInfo = h, tiddler = h.tiddler, isPluginExecutable(h))if (isPluginEnabled(h)) {
        h.executed = !0;
        var k = new Date;
        try {
            tiddler.text && window.eval(tiddler.text), d++
        } catch (a) {
            h.log.push(config.messages.pluginError.format([exceptionText(a)])), h.error = !0, console.tiddlywiki || console.log("error evaluating " + tiddler.title, a)
        }
        pluginInfo.startupTime = String(new Date - k) + "ms"
    } else f--; else h.warning = !0;
    return d != f
}
function getPluginInfo(a) {
    var b = store.getTiddlerSlices(a.title, ["Name", "Description", "Version", "Requires", "CoreVersion", "Date", "Source", "Author", "License", "Browsers"]);
    return b.tiddler = a, b.title = a.title, b.log = [], b
}
function isPluginExecutable(a) {
    if (a.tiddler.isTagged("systemConfigForce"))return a.log.push(config.messages.pluginForced), !0;
    if (a.CoreVersion) {
        var b = a.CoreVersion.split("."), c = parseInt(b[0], 10) - version.major;
        if (0 == c && b[1] && (c = parseInt(b[1], 10) - version.minor), 0 == c && b[2] && (c = parseInt(b[2], 10) - version.revision), c > 0)return a.log.push(config.messages.pluginVersionError), !1
    }
    return !0
}
function isPluginEnabled(a) {
    return !a.tiddler.isTagged("systemConfigDisable") || (a.log.push(config.messages.pluginDisabled), !1)
}
function getParameters() {
    var a = null;
    return window.location.hash && (a = decodeURIComponent(window.location.hash.substr(1)), null != config.browser.firefoxDate && config.browser.firefoxDate[1] < "20051111" && (a = convertUTF8ToUnicode(a))), a
}
function invokeParamifier(a, b) {
    if (a && void 0 != a.length && !(a.length <= 1)) {
        var c;
        for (c = 1; c < a.length; c++) {
            var d = config.paramifiers[a[c].name];
            if (d && d[b]instanceof Function)d[b](a[c].value); else {
                var e = config.optionHandlers[a[c].name.substr(0, 3)];
                e && e.set instanceof Function && e.set(a[c].name, a[c].value)
            }
        }
    }
}
function Formatter(a) {
    var b;
    this.formatters = [];
    var c = [];
    for (b = 0; b < a.length; b++)c.push("(" + a[b].match + ")"), this.formatters.push(a[b]);
    this.formatterRegExp = new RegExp(c.join("|"), "mg")
}
function getParser(a, b) {
    if (a) {
        b || (b = a.fields.wikiformat);
        var c;
        if (b) {
            for (c in config.parsers)if (b == config.parsers[c].format)return config.parsers[c]
        } else for (c in config.parsers)if (a.isTagged(config.parsers[c].formatTag))return config.parsers[c]
    }
    return formatter
}
function Wikifier(a, b, c, d) {
    this.source = a, this.output = null, this.formatter = b, this.nextMatch = 0, this.autoLinkWikiWords = !d || 0 != d.autoLinkWikiWords(), this.highlightRegExp = c, this.highlightMatch = null, this.isStatic = !1, c && (c.lastIndex = 0, this.highlightMatch = c.exec(a)), this.tiddler = d
}
function wikify(a, b, c, d) {
    if (a) {
        var e = new Wikifier(a, getParser(d), c, d), f = new Date;
        e.subWikify(b), d && config.options.chkDisplayInstrumentation && displayMessage("wikify:" + d.title + " in " + (new Date - f) + " ms")
    }
}
function wikifyStatic(a, b, c, d) {
    var e = createTiddlyElement(document.body, "pre");
    e.style.display = "none";
    var f = "";
    if (a && "" != a) {
        c || (c = new Tiddler("temp"));
        var g = new Wikifier(a, getParser(c, d), b, c);
        g.isStatic = !0, g.subWikify(e), f = e.innerHTML, jQuery(e).remove()
    }
    return f
}
function wikifyPlainText(a, b, c) {
    b > 0 && (a = a.substr(0, b));
    var d = new Wikifier(a, formatter, null, c);
    return d.wikifyPlain()
}
function highlightify(a, b, c, d) {
    if (a) {
        var e = new Wikifier(a, formatter, c, d);
        e.outputText(b, 0, a.length)
    }
}
function invokeMacro(a, b, c, d, e) {
    try {
        var f = config.macros[b];
        if (f && f.handler) {
            var g = story.findContainingTiddler(a);
            window.tiddler = g ? store.getTiddler(g.getAttribute("tiddler")) : null, window.place = a;
            var h = !0;
            "system" == config.evaluateMacroParameters && (e && e.tags.indexOf("systemAllowEval") != -1 || (h = !1)), f.handler(a, b, f.noPreParse ? null : c.readMacroParams(!h), d, c, e)
        } else createTiddlyError(a, config.messages.macroError.format([b]), config.messages.macroErrorDetails.format([b, config.messages.missingMacro]))
    } catch (c) {
        createTiddlyError(a, config.messages.macroError.format([b]), config.messages.macroErrorDetails.format([b, c.toString()]))
    }
}
function Tiddler(a) {
    return this.title = a, this.text = "", this.creator = null, this.modifier = null, this.created = new Date, this.modified = this.created, this.links = [], this.linksUpdated = !1, this.tags = [], this.fields = {}, this
}
function TiddlyWiki(a) {
    var b = {};
    a && a.config && (this.config = config), this.tiddlersUpdated = !1, this.namedNotifications = [], this.notificationLevel = 0, this.slices = {}, this.clear = function () {
        b = {}, this.setDirty(!1)
    }, this.fetchTiddler = function (a) {
        var c = b[a];
        return c instanceof Tiddler ? c : null
    }, this.deleteTiddler = function (a) {
        delete this.slices[a], delete b[a]
    }, this.addTiddler = function (a) {
        delete this.slices[a.title], b[a.title] = a
    }, this.forEachTiddler = function (a) {
        var c;
        for (c in b) {
            var d = b[c];
            d instanceof Tiddler && a.call(this, c, d)
        }
    }
}
function StringFieldAccess(a, b) {
    this.set = b ? function (b, c) {
        if (c != b[a])throw config.messages.fieldCannotBeChanged.format([a])
    } : function (b, c) {
        if (c != b[a])return b[a] = c, !0
    }, this.get = function (b) {
        return b[a]
    }
}
function DateFieldAccess(a) {
    this.set = function (b, c) {
        var d = c instanceof Date ? c : Date.convertFromYYYYMMDDHHMM(c);
        if (d != b[a])return b[a] = d, !0
    }, this.get = function (b) {
        return b[a].convertToYYYYMMDDHHMM()
    }
}
function LinksFieldAccess(a) {
    this.set = function (b, c) {
        var d = "string" == typeof c ? c.readBracketedList() : c;
        if (d.toString() != b[a].toString())return b[a] = d, !0
    }, this.get = function (b) {
        return String.encodeTiddlyLinkList(b[a])
    }
}
function Story(a, b) {
    this.container = a, this.idPrefix = b, this.highlightRegExp = null, this.tiddlerId = function (a) {
        a = a.replace(/_/g, "__").replace(/ /g, "_");
        var b = this.idPrefix + a;
        return b == this.container ? this.idPrefix + "_" + a : b
    }, this.containerId = function () {
        return this.container
    }
}
function upgradeFrom(a) {
    var b = new TiddlyWiki, c = loadFile(a);
    void 0 !== window.netscape && (c = convertUTF8ToUnicode(c)), b.importTiddlyWiki(c), b.forEachTiddler(function (a, b) {
        store.getTiddler(a) || store.addTiddler(b)
    }), refreshDisplay(), saveChanges(), alert(config.messages.upgradeDone.format([formatVersion()])), window.location = window.location.toString().substr(0, window.location.toString().lastIndexOf("?"))
}
function getMessageDiv() {
    var a = document.getElementById("messageArea");
    return a ? (a.hasChildNodes() || createTiddlyButton(createTiddlyElement(a, "div", null, "messageToolbar"), config.messages.messageClose.text, config.messages.messageClose.tooltip, clearMessage), a.style.display = "block", createTiddlyElement(a, "div")) : null
}
function displayMessage(a, b) {
    var c = getMessageDiv();
    if (!c)return void alert(a);
    if (b) {
        var d = createTiddlyElement(c, "a", null, null, a);
        d.href = b, d.target = "_blank"
    } else c.appendChild(document.createTextNode(a))
}
function clearMessage() {
    var a = document.getElementById("messageArea");
    return a && (jQuery(a).empty(), a.style.display = "none"), !1
}
function refreshElements(a, b) {
    var c, d = a.childNodes;
    for (c = 0; c < d.length; c++) {
        var e = d[c], f = null;
        !e.getAttribute || e.tagName && "IFRAME" == e.tagName || (f = e.getAttribute("refresh"));
        var g = config.refreshers[f], h = !1;
        void 0 != g && (h = g(e, b)), e.hasChildNodes() && !h && refreshElements(e, b)
    }
}
function applyHtmlMacros(a, b) {
    for (var c = a.firstChild; c;) {
        var d = c.nextSibling;
        if (c.getAttribute) {
            var e = c.getAttribute("macro");
            if (e) {
                c.removeAttribute("macro");
                var f = "", g = e.indexOf(" ");
                g != -1 && (f = e.substr(g + 1), e = e.substr(0, g)), invokeMacro(c, e, f, null, b)
            }
        }
        c.hasChildNodes() && applyHtmlMacros(c, b), c = d
    }
}
function refreshPageTemplate(a) {
    var d, e, b = jQuery("<div/>").appendTo("body").hide()[0], c = story.getContainer();
    if (c)for (d = c.childNodes, e = d.length - 1; e >= 0; e--)b.appendChild(d[e]);
    var f = document.getElementById("contentWrapper");
    for (a && store.isAvailable(a) || (a = config.refresherData.pageTemplate), store.isAvailable(a) || (a = config.refresherData.defaultPageTemplate), f.innerHTML = store.getRecursiveTiddlerText(a, null, 10), applyHtmlMacros(f), refreshElements(f), c = story.getContainer(), jQuery(c).empty(), c || (c = createTiddlyElement(f, "div", story.containerId())), d = b.childNodes, e = d.length - 1; e >= 0; e--)c.appendChild(d[e]);
    jQuery(b).remove()
}
function refreshDisplay(a) {
    "string" == typeof a && (a = [a]);
    var b = document.getElementById("contentWrapper");
    refreshElements(b, a), backstage.isPanelVisible() && (b = document.getElementById("backstage"), refreshElements(b, a))
}
function refreshPageTitle() {
    document.title = getPageTitle()
}
function getPageTitle() {
    return wikifyPlainText(store.getTiddlerText("WindowTitle", ""), null, tiddler)
}
function refreshStyles(a, b) {
    setStylesheet(null == a ? "" : store.getRecursiveTiddlerText(a, "", 10), a, b || document)
}
function refreshColorPalette(a) {
    startingUp || refreshAll()
}
function refreshAll() {
    refreshPageTemplate(), refreshDisplay(), refreshStyles("StyleSheetLayout"), refreshStyles("StyleSheetColors"), refreshStyles(config.refresherData.styleSheet), refreshStyles("StyleSheetPrint")
}
function setOption(a, b) {
    var c = a.substr(0, 3);
    config.optionHandlers[c] && config.optionHandlers[c].set && config.optionHandlers[c].set(a, b)
}
function getOption(a) {
    var b = a.substr(0, 3);
    return config.optionHandlers[b] && config.optionHandlers[b].get ? config.optionHandlers[b].get(a) : null
}
function loadOptions() {
    safeMode || (loadCookies(), loadSystemSettings())
}
function getCookies() {
    var b, a = document.cookie.split(";"), c = {};
    for (b = 0; b < a.length; b++) {
        var d = a[b].indexOf("=");
        if (d != -1) {
            var e = a[b].substr(0, d).trim(), f = a[b].substr(d + 1).trim();
            c[e] = f
        }
    }
    return c
}
function loadCookies() {
    var a, b = getCookies();
    b.TiddlyWiki && (b = b.TiddlyWiki.decodeHashMap());
    for (a in b)"setting" != config.optionsSource[a] && setOption(a, b[a])
}
function loadSystemSettings() {
    var a, b = store.calcAllSlices("SystemSettings");
    config.optionsSource = {};
    for (a in b)setOption(a, b[a]), config.optionsSource[a] = "setting"
}
function onSystemSettingsChange() {
    startingUp || loadSystemSettings()
}
function saveOption(a) {
    if (!safeMode) {
        if (a.match(/[()\s]/g, "_"))return void alert(config.messages.invalidCookie.format([a]));
        saveCookie(a), "setting" == config.optionsSource[a] && saveSystemSetting(a, !0)
    }
}
function removeCookie(a) {
    document.cookie = a + "=; expires=Thu, 01-Jan-1970 00:00:01 UTC; path=/;"
}
function saveCookie(a) {
    var b, c = {};
    for (b in config.options) {
        var d = getOption(b);
        d = null == d ? "false" : d, c[b] = d
    }
    document.cookie = "TiddlyWiki=" + String.encodeHashMap(c) + "; expires=Fri, 1 Jan 2038 12:00:00 UTC; path=/", c = getCookies();
    var e;
    for (e in c) {
        var f = e.substr(0, 3);
        config.optionHandlers[f] && removeCookie(e)
    }
}
function commitSystemSettings(a) {
    systemSettingSave && window.clearTimeout(systemSettingSave), systemSettingSave = window.setTimeout(function () {
        var a = store.getTiddler("SystemSettings");
        autoSaveChanges(null, [a])
    }, 1e3)
}
function saveSystemSetting(a, b) {
    var c = "SystemSettings", d = store.getTiddlerSlice(c, a);
    if (!readOnly && d !== getOption(a)) {
        var f, e = store.calcAllSlices(c);
        for (f in config.optionsSource) {
            var g = getOption(f) || "";
            e[f] !== g && (e[f] = g)
        }
        var h = [];
        for (f in e)h.push("%0: %1".format([f, e[f]]));
        h = h.sort().join("\n");
        var i = store.isDirty(), j = store.getTiddler(c);
        j ? (j.text = h, j = store.saveTiddler(j)) : j = store.saveTiddler(c, c, h, "System", new Date, ["excludeLists"], config.defaultCustomFields), b && commitSystemSettings(i)
    }
}
function encodeCookie(a) {
    return escape(convertUnicodeToHtmlEntities(a))
}
function decodeCookie(s) {
    s = unescape(s);
    var re = /&#[0-9]{1,5};/g;
    return s.replace(re, function ($0) {
        return String.fromCharCode(eval($0.replace(/[&#;]/g, "")))
    })
}
function confirmExit() {
    if (hadConfirmExit = !0, store && store.isDirty && store.isDirty() || story && story.areAnyDirty && story.areAnyDirty())return config.messages.confirmExit
}
function checkUnsavedChanges() {
    store && store.isDirty && store.isDirty() && window.hadConfirmExit === !1 && confirm(config.messages.unsavedChangesWarning) && saveChanges()
}
function updateLanguageAttribute(a) {
    if (config.locale) {
        var b = /(<html(?:.*?)?)(?: xml:lang\="([a-z]+)")?(?: lang\="([a-z]+)")?>/, c = b.exec(a);
        if (c) {
            var d = c[1];
            c[2] && (d += ' xml:lang="' + config.locale + '"'), c[3] && (d += ' lang="' + config.locale + '"'), d += ">", a = a.substr(0, c.index) + d + a.substr(c.index + c[0].length)
        }
    }
    return a
}
function updateMarkupBlock(a, b, c) {
    return a.replaceChunk("<!--%0-START-->".format([b]), "<!--%0-END-->".format([b]), "\n" + convertUnicodeToFileFormat(store.getRecursiveTiddlerText(c, "")) + "\n")
}
function updateOriginal(a, b, c) {
    if (b || (b = locateStoreArea(a)), !b)return alert(config.messages.invalidFileError.format([c])), null;
    var d = a.substr(0, b[0] + startSaveArea.length) + "\n" + convertUnicodeToFileFormat(store.allTiddlersAsHtml()) + "\n" + a.substr(b[1]), e = convertUnicodeToFileFormat(getPageTitle()).htmlEncode();
    return d = d.replaceChunk("<title>", "</title>", " " + e + " "), d = updateLanguageAttribute(d), d = updateMarkupBlock(d, "PRE-HEAD", "MarkupPreHead"), d = updateMarkupBlock(d, "POST-HEAD", "MarkupPostHead"), d = updateMarkupBlock(d, "PRE-BODY", "MarkupPreBody"), d = updateMarkupBlock(d, "POST-SCRIPT", "MarkupPostBody")
}
function locateStoreArea(a) {
    if (!a)return null;
    var b = a.search(startSaveAreaRE), c = a.indexOf("<!--POST-STOREAREA-->");
    c == -1 && (c = a.indexOf("<!--POST-BODY-START-->"));
    var d = c == -1 ? a.length : c, e = a.lastIndexOf(endSaveArea, d);
    return e == -1 && (e = a.lastIndexOf(endSaveAreaCaps, d)), b != -1 && e != -1 ? [b, e] : null
}
function autoSaveChanges(a, b) {
    config.options.chkAutoSave && saveChanges(a, b)
}
function loadOriginal(a) {
    var b = loadFile(a);
    return b || (b = window.originalHTML || recreateOriginal()), b
}
function recreateOriginal() {
    var a = "<!DOCTYPE ", b = document.doctype;
    return b ? (a += b.name, b.publicId ? a += ' PUBLIC "' + b.publicId + '"' : b.systemId && (a += ' SYSTEM "' + b.systemId + '"')) : a += "html", a += ' "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"', a += ">\n", a += document.documentElement.outerHTML, a = a.replace(/<div id="saveTest">savetest<\/div>/, '<div id="saveTest"></div>'), a = a.replace(/script><applet [^\>]*><\/applet>/g, "script>"), a = a.replace(/><head>/, ">\n<head>"), a = a.replace(/\n\n<\/body><\/html>$/, "</body>\n</html>\n"), a = a.replace(/(<(meta) [^\>]*[^\/])>/g, "$1 />"), a = a.replace(/<noscript>[^\<]*<\/noscript>/, function (a) {
        return a.replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    }), a = a.replace(/<div id="copyright">[^\<]*<\/div>/, function (a) {
        return a.replace(/\xA9/g, "&copy;")
    })
}
function saveChanges(a, b) {
    if (!a || store.isDirty()) {
        clearMessage();
        var c = new Date, d = config.messages, e = document.location.toString();
        if (!window.allowSave()) return alert(d.notFileUrlError), void(store.tiddlerExists(d.saveInstructions) && story.displayTiddler(null, d.saveInstructions));
        var f = getLocalPath(e), g = loadOriginal(f);
        if (null == g)return alert(d.cantSaveError), void(store.tiddlerExists(d.saveInstructions) && story.displayTiddler(null, d.saveInstructions));
        var h = locateStoreArea(g);
        if (!h)return void alert(d.invalidFileError.format([f]));
        var i = config.options;
        config.saveByDownload = !1, config.saveByManualDownload = !1, saveMain(f, g, h), config.saveByDownload || config.saveByManualDownload || (i.chkSaveBackups && saveBackup(f, g), i.chkSaveEmptyTemplate && saveEmpty(f, g, h), i.chkGenerateAnRssFeed && saveRss instanceof Function && saveRss(f)), i.chkDisplayInstrumentation && displayMessage("saveChanges " + (new Date - c) + " ms")
    }
}
function saveMain(a, b, c) {
    var d;
    try {
        var e = updateOriginal(b, c, a);
        d = saveFile(a, e)
    } catch (a) {
        showException(a)
    }
    if (d) {
        if (!config.saveByManualDownload) {
            if (config.saveByDownload)var f = getDataURI(e), g = config.messages.mainDownload; else var f = "file://" + a, g = config.messages.mainSaved;
            displayMessage(g, f)
        }
        store.setDirty(!1)
    } else alert(config.messages.mainFailed)
}
function saveBackup(a, b) {
    var c = getBackupPath(a), d = copyFile(c, a);
    d || (d = saveFile(c, b)), d ? displayMessage(config.messages.backupSaved, "file://" + c) : alert(config.messages.backupFailed)
}
function saveEmpty(a, b, c) {
    var d, e;
    d = (e = a.lastIndexOf("/")) != -1 ? a.substr(0, e) + "/" : (e = a.lastIndexOf("\\")) != -1 ? a.substr(0, e) + "\\" : a + ".", d += "empty.html";
    var f = b.substr(0, c[0] + startSaveArea.length) + b.substr(c[1]), g = saveFile(d, f);
    g ? displayMessage(config.messages.emptySaved, "file://" + d) : alert(config.messages.emptyFailed)
}
function getBackupPath(a, b, c) {
    var d = "\\", e = a.lastIndexOf("\\");
    e == -1 && (e = a.lastIndexOf("/"), d = "/");
    var f = config.options.txtBackupFolder;
    f && "" != f || (f = ".");
    var g = a.substr(0, e) + d + f + a.substr(e);
    return g = g.substr(0, g.lastIndexOf(".")) + ".", b && (g += b.replace(/[\\\/\*\?\":<> ]/g, "_") + "."), g += (new Date).convertToYYYYMMDDHHMMSSMMM() + "." + (c || "html")
}
function saveRss(a) {
    var b = a.substr(0, a.lastIndexOf(".")) + ".xml";
    saveFile(b, convertUnicodeToFileFormat(generateRss())) ? displayMessage(config.messages.rssSaved, "file://" + b) : alert(config.messages.rssFailed)
}
function generateRss() {
    var a = [], b = new Date, c = store.getTiddlerText("SiteUrl");
    a.push('<?xml version="1.0"?>'), a.push('<rss version="2.0">'), a.push("<channel>"), a.push("<title>" + wikifyPlainText(store.getTiddlerText("SiteTitle", ""), null, tiddler).htmlEncode() + "</title>"), c && a.push("<link>" + c.htmlEncode() + "</link>"), a.push("<description>" + wikifyPlainText(store.getTiddlerText("SiteSubtitle", ""), null, tiddler).htmlEncode() + "</description>"), a.push("<language>" + config.locale + "</language>"), a.push("<copyright>Copyright " + b.getFullYear() + " " + config.options.txtUserName.htmlEncode() + "</copyright>"), a.push("<pubDate>" + b.toGMTString() + "</pubDate>"), a.push("<lastBuildDate>" + b.toGMTString() + "</lastBuildDate>"), a.push("<docs>http://blogs.law.harvard.edu/tech/rss</docs>"), a.push("<generator>TiddlyWiki " + formatVersion() + "</generator>");
    var e, d = store.getTiddlers("modified", "excludeLists"), f = config.numRssItems > d.length ? 0 : d.length - config.numRssItems;
    for (e = d.length - 1; e >= f; e--)a.push("<item>\n" + tiddlerToRssItem(d[e], c) + "\n</item>");
    return a.push("</channel>"), a.push("</rss>"), a.join("\n")
}
function ieCreatePath(a) {
    try {
        var b = new ActiveXObject("Scripting.FileSystemObject")
    } catch (a) {
        return null
    }
    var c = a.lastIndexOf("\\");
    c == -1 && (c = a.lastIndexOf("/")), c != -1 && (a = a.substring(0, c + 1));
    for (var d = [a], e = b.GetParentFolderName(a); e && !b.FolderExists(e);)d.push(e), e = b.GetParentFolderName(e);
    for (i = d.length - 1; i >= 0; i--)b.FolderExists(d[i]) || b.CreateFolder(d[i]);
    return !0
}
function ieSaveFile(a, b) {
    ieCreatePath(a);
    try {
        var c = new ActiveXObject("Scripting.FileSystemObject")
    } catch (a) {
        return null
    }
    var d = c.OpenTextFile(a, 2, -1, 0);
    return d.Write(b), d.Close(), !0
}
function ieLoadFile(a) {
    try {
        var b = new ActiveXObject("Scripting.FileSystemObject"), c = b.OpenTextFile(a, 1), d = c.ReadAll();
        c.Close()
    } catch (a) {
        return null
    }
    return d
}
function ieCopyFile(a, b) {
    ieCreatePath(a);
    try {
        var c = new ActiveXObject("Scripting.FileSystemObject");
        c.GetFile(b).Copy(a)
    } catch (a) {
        return !1
    }
    return !0
}
function mozillaSaveFile(a, b) {
    if (window.Components)try {
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        var c = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
        c.initWithPath(a), c.exists() || c.create(0, 436);
        var d = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
        return d.init(c, 34, 4, null), d.write(b, b.length), d.flush(), d.close(), !0
    } catch (a) {
        return !1
    }
    return null
}
function mozillaLoadFile(a) {
    if (window.Components)try {
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        var b = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
        if (b.initWithPath(a), !b.exists())return null;
        var c = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
        c.init(b, 1, 4, null);
        var d = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
        d.init(c);
        var e = d.read(d.available());
        return d.close(), c.close(), e
    } catch (a) {
        return !1
    }
    return null
}
function javaUrlToFilename(a) {
    var b = "//localhost";
    if (0 == a.indexOf(b))return a.substring(b.length);
    var c = a.indexOf(":");
    return c > 0 ? a.substring(c - 1) : a
}
function logTiddlySaverException(a, b) {
    var c = document.applets.TiddlySaver;
    if (console.log(a + ": " + b), LOG_TIDDLYSAVER && c)try {
        console.log(a + ": " + c.getLastErrorMsg()), console.log(a + ": " + c.getLastErrorStackTrace())
    } catch (a) {
    }
}
function javaDebugInformation() {
    function c(b, c) {
        try {
            result = String(c.call(a))
        } catch (a) {
            result = String(a)
        }
        return b + ": " + result
    }

    var a = document.applets.TiddlySaver, b = [["Java Version", a.getJavaVersion], ["Last Exception", a.getLastErrorMessage], ["Last Exception Stack Trace", a.getLastErrorStackTrace], ["System Properties", a.getSystemProperties]];
    return jQuery.map(b, function (a) {
        return c.apply(this, a)
    }).join("\n\n")
}
function javaSaveFile(a, b) {
    var c = document.applets.TiddlySaver;
    try {
        if (c && a)return c.saveFile(javaUrlToFilename(a), "UTF-8", b)
    } catch (a) {
        logTiddlySaverException("javaSaveFile", a)
    }
    try {
        var d = new java.io.PrintStream(new java.io.FileOutputStream(javaUrlToFilename(a)));
        d.print(b), d.close()
    } catch (a) {
        return null
    }
    return !0
}
function javaLoadFile(a) {
    var b = document.applets.TiddlySaver;
    try {
        if (b && a) {
            var c = b.loadFile(javaUrlToFilename(a), "UTF-8");
            return c ? String(c) : null
        }
    } catch (a) {
        logTiddlySaverException("javaLoadFile", a)
    }
    var d = [];
    try {
        for (var f, e = new java.io.BufferedReader(new java.io.FileReader(javaUrlToFilename(a))); null != (f = e.readLine());)d.push(String(f));
        e.close()
    } catch (a) {
        return null
    }
    return d.join("\n")
}
function HTML5DownloadSaveFile(a, b) {
    if (void 0 !== document.createElement("a").download) {
        config.saveByDownload = !0;
        var c = a.lastIndexOf("/");
        c == -1 && (c = a.lastIndexOf("\\"));
        var d = a.substr(c + 1), e = getDataURI(b), f = document.createElement("a");
        return f.setAttribute("target", "_blank"), f.setAttribute("href", e), f.setAttribute("download", d), document.body.appendChild(f), f.click(), document.body.removeChild(f), !0
    }
    return null
}
function manualSaveFile(a, b) {
    config.saveByManualDownload = !0;
    var c = a.lastIndexOf("/");
    c == -1 && (c = a.lastIndexOf("\\"));
    var e = (a.substr(c + 1), getDataURI(b));
    return displayMessage(config.messages.mainDownloadManual, e), !0
}
function getDataURI(a) {
    return config.browser.isIE ? "data:text/html," + encodeURIComponent(a) : "data:text/html;base64," + encodeBase64(a)
}
function encodeBase64(a) {
    if (!a)return "";
    for (var d, e, g, h, i, b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", c = "", f = "", j = "", l = 0; l < a.length;)d = a.charCodeAt(l++), e = a.charCodeAt(l++), f = a.charCodeAt(l++), g = d >> 2, h = (3 & d) << 4 | e >> 4, i = (15 & e) << 2 | f >> 6, j = 63 & f, isNaN(e) ? i = j = 64 : isNaN(f) && (j = 64), c += b.charAt(g) + b.charAt(h) + b.charAt(i) + b.charAt(j), d = e = f = g = h = i = j = "";
    return c
}
function convertUTF8ToUnicode(a) {
    return config.browser.isOpera || !window.netscape ? manualConvertUTF8ToUnicode(a) : mozConvertUTF8ToUnicode(a)
}
function manualConvertUTF8ToUnicode(a) {
    for (var e, f, g, h, b = a, c = 0, d = 0; c < a.length;)e = a.charCodeAt(c++), e < 128 ? d++ : e < 224 ? (f = a.charCodeAt(c++), h = String.fromCharCode((31 & e) << 6 | 63 & f), b = b.substring(0, d++).concat(h, a.substr(c))) : (f = a.charCodeAt(c++), g = a.charCodeAt(c++), h = String.fromCharCode((15 & e) << 12 | (63 & f) << 6 | 63 & g), b = b.substring(0, d++).concat(h, a.substr(c)));
    return b
}
function mozConvertUTF8ToUnicode(a) {
    try {
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        var b = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
        b.charset = "UTF-8"
    } catch (b) {
        return manualConvertUTF8ToUnicode(a)
    }
    var c = b.ConvertToUnicode(a), d = b.Finish();
    return d.length > 0 ? c + d : c
}
function convertUnicodeToFileFormat(a) {
    return config.browser.isOpera || !window.netscape ? config.browser.isIE ? convertUnicodeToHtmlEntities(a) : a : mozConvertUnicodeToUTF8(a)
}
function convertUnicodeToHtmlEntities(a) {
    var b = /[^\u0000-\u007F]/g;
    return a.replace(b, function (a) {
        return "&#" + a.charCodeAt(0).toString() + ";"
    })
}
function convertUnicodeToUTF8(a) {
    return convertUnicodeToFileFormat(a)
}
function manualConvertUnicodeToUTF8(a) {
    return unescape(encodeURIComponent(a))
}
function mozConvertUnicodeToUTF8(a) {
    try {
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        var b = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
        b.charset = "UTF-8"
    } catch (b) {
        return manualConvertUnicodeToUTF8(a)
    }
    var c = b.ConvertFromUnicode(a), d = b.Finish();
    return d.length > 0 ? c + d : c
}
function convertUriToUTF8(a, b) {
    if (void 0 == window.netscape || void 0 == b || "" == b)return a;
    try {
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        var c = Components.classes["@mozilla.org/intl/utf8converterservice;1"].getService(Components.interfaces.nsIUTF8ConverterService)
    } catch (b) {
        return a
    }
    return c.convertURISpecToUTF8(a, b)
}
function AdaptorBase() {
    return this.host = null, this.store = null, this
}
function FileAdaptor() {
}
function ajaxReq(a) {
    return a.file || a.url.startsWith("file") ? localAjax(a) : jQuery.ajax(a)
}
function localAjax(a) {
    var b = function (b) {
        a.success(b, "success", {responseText: b})
    }, c = function (b) {
        a.error({message: b + ": cannot read local file"}, "error", 0)
    };
    if (a.file)try {
        var d = new FileReader;
        return d.onload = function (a) {
            b(a.target.result)
        }, d.onerror = function (a) {
            c("FileReader")
        }, d.readAsText(a.file), !0
    } catch (a) {
    }
    try {
        var e = loadFile(getLocalPath(a.url));
        return e ? b(e) : c("loadFile"), !0
    } catch (a) {
    }
    return !0
}
function httpReq(a, b, c, d, e, f, g, h, i, j) {
    var k = function (a) {
        try {
            return !a.status && "file:" === location.protocol || a.status >= 200 && a.status < 300 || 304 === a.status || 1223 === a.status
        } catch (a) {
        }
        return !1
    }, l = {
        type: a, url: b, processData: !1, data: f, cache: !!j, beforeSend: function (a) {
            var b;
            for (b in e)a.setRequestHeader(b, e[b])
        }
    };
    c && (l.complete = function (a, e) {
        k(a) ? c(!0, d, a.responseText, b, a) : c(!1, d, null, b, a)
    }), g && (l.contentType = g), h && (l.username = h), i && (l.password = i);
    try {
        window.Components && window.netscape && window.netscape.security && document.location.protocol.indexOf("http") == -1 && window.netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead")
    } catch (a) {
    }
    return jQuery.ajax(l)
}
function formatVersion(a) {
    return a = a || version, a.major + "." + a.minor + "." + a.revision + (a.alpha ? " (alpha " + a.alpha + ")" : "") + (a.beta ? " (beta " + a.beta + ")" : "")
}
function compareVersions(a, b) {
    var c, d, e, f = ["major", "minor", "revision"];
    for (e = 0; e < f.length; e++) {
        if (c = a[f[e]] || 0, d = b[f[e]] || 0, c < d)return 1;
        if (c > d)return -1
    }
    return c = a.beta || 9999, d = b.beta || 9999, c < d ? 1 : c > d ? -1 : 0
}
function merge(a, b, c) {
    var d;
    for (d in b)c && void 0 !== a[d] || (a[d] = b[d]);
    return a
}
function resolveTarget(a) {
    var b;
    return a.target ? b = a.target : a.srcElement && (b = a.srcElement), 3 == b.nodeType && (b = b.parentNode), b
}
function exceptionText(a, b) {
    var c = a.description || a.toString();
    return b ? "%0:\n%1".format([b, c]) : c
}
function showException(a, b) {
    alert(exceptionText(a, b))
}
function alertAndThrow(a) {
    throw alert(a), a
}
function glyph(a) {
    var b = config.glyphs, c = b.currBrowser;
    if (null == c) {
        for (c = 0; c < b.browsers.length - 1 && !b.browsers[c]();)c++;
        b.currBrowser = c
    }
    return b.codes[a] ? b.codes[a][c] : ""
}
function createTiddlyText(a, b) {
    return a.appendChild(document.createTextNode(b))
}
function createTiddlyCheckbox(a, b, c, d) {
    var e = document.createElement("input");
    return e.setAttribute("type", "checkbox"), e.onclick = d, a.appendChild(e), e.checked = c, e.className = "chkOptionInput", b && wikify(b, a), e
}
function createTiddlyElement(a, b, c, d, e, f) {
    var g, h = document.createElement(b);
    if (null != d && (h.className = d), null != c && h.setAttribute("id", c), null != e && h.appendChild(document.createTextNode(e)), f)for (g in f)h.setAttribute(g, f[g]);
    return null != a && a.appendChild(h), h
}
function createTiddlyButton(a, b, c, d, e, f, g, h) {
    var i, j = document.createElement("a");
    if (j.setAttribute("href", "javascript:;"), d && (j.onclick = d), c && j.setAttribute("title", c), b && j.appendChild(document.createTextNode(b)), j.className = e || "button", f && (j.id = f), h)for (i in h)j.setAttribute(i, h[i]);
    return a && a.appendChild(j), g && j.setAttribute("accessKey", g), j
}
function createExternalLink(a, b, c) {
    var d = document.createElement("a");
    d.className = "externalLink", d.href = b;
    var e = config.messages.externalLinkTooltip;
    return d.title = e ? e.format([b]) : b, config.options.chkOpenInNewWindow && (d.target = "_blank"), a.appendChild(d), c && createTiddlyText(d, c), d
}
function getTiddlyLinkInfo(a, b) {
    var c = b ? b.split(" ") : [];
    c.pushUnique("tiddlyLink");
    var e, d = store.fetchTiddler(a);
    if (d)e = d.getSubtitle(), c.pushUnique("tiddlyLinkExisting"), c.remove("tiddlyLinkNonExisting"), c.remove("shadow"); else {
        var f;
        c.remove("tiddlyLinkExisting"), c.pushUnique("tiddlyLinkNonExisting"), store.isShadowTiddler(a) ? (f = config.messages.shadowedTiddlerToolTip, c.pushUnique("shadow")) : (f = config.messages.undefinedTiddlerToolTip, c.remove("shadow")), e = f ? f.format([a]) : ""
    }
    return "string" == typeof config.annotations[a] && (e = config.annotations[a]), {classes: c.join(" "), subTitle: e}
}
function onClickTiddlerLink(a) {
    var b = a || window.event, c = resolveTarget(b), d = c, e = null, f = null, g = null;
    do e = d.getAttribute("tiddlyLink"), f = d.getAttribute("tiddlyFields"), g = d.getAttribute("noToggle"), d = d.parentNode; while (null == e && null != d);
    if (!store.isShadowTiddler(e)) {
        var h = f ? f.decodeHashMap() : {};
        f = String.encodeHashMap(merge(h, config.defaultCustomFields, !0))
    }
    if (e) {
        var i = b.metaKey || b.ctrlKey;
        config.options.chkToggleLinks && (i = !i), g && (i = !1), store.getTiddler(e) && (f = null), story.displayTiddler(c, e, null, !0, null, f, i)
    }
    return clearMessage(), !1
}
function createTiddlyLink(a, b, c, d, e, f, g) {
    var b = jQuery.trim(b), h = c ? b : null, i = getTiddlyLinkInfo(b, d), j = e ? createExternalLink(a, store.getTiddlerText("SiteUrl", null) + "#" + b) : createTiddlyButton(a, h, i.subTitle, onClickTiddlerLink, i.classes);
    if (e && (j.className += " " + d), j.setAttribute("refresh", "link"), j.setAttribute("tiddlyLink", b), g && j.setAttribute("noToggle", "true"), f) {
        var k = f.getInheritedFields();
        k && j.setAttribute("tiddlyFields", k)
    }
    return j
}
function refreshTiddlyLink(a, b) {
    var c = getTiddlyLinkInfo(b, a.className);
    a.className = c.classes, a.title = c.subTitle
}
function createTiddlyDropDown(a, b, c, d) {
    var e = createTiddlyElement(a, "select");
    e.onchange = b;
    var f;
    for (f = 0; f < c.length; f++) {
        var g = createTiddlyElement(e, "option", null, null, c[f].caption);
        g.value = c[f].name, c[f].name == d && (g.selected = !0)
    }
    return e
}
function onClickTagOpenAll(a) {
    var b = store.getTaggedTiddlers(this.getAttribute("tag")), c = this.getAttribute("sortby");
    return c && c.length && store.sortTiddlers(b, c), story.displayTiddlers(this, b), !1
}
function onClickTag(a) {
    var b = a || window.event, c = Popup.create(this);
    jQuery(c).addClass("taggedTiddlerList");
    var d = this.getAttribute("tag"), e = this.getAttribute("tiddler");
    if (c && d) {
        var f = d.indexOf("[") == -1 ? store.getTaggedTiddlers(d) : store.filterTiddlers(d), g = this.getAttribute("sortby");
        g && g.length && store.sortTiddlers(f, g);
        var i, h = [];
        for (i = 0; i < f.length; i++)f[i].title != e && h.push(f[i].title);
        var j = config.views.wikified.tag;
        if (h.length > 0) {
            var k = createTiddlyButton(createTiddlyElement(c, "li"), j.openAllText.format([d]), j.openAllTooltip, onClickTagOpenAll);
            for (k.setAttribute("tag", d), k.setAttribute("sortby", g), createTiddlyElement(createTiddlyElement(c, "li", null, "listBreak"), "div"), i = 0; i < h.length; i++)createTiddlyLink(createTiddlyElement(c, "li"), h[i], !0)
        } else createTiddlyElement(c, "li", null, "disabled", j.popupNone.format([d]));
        createTiddlyElement(createTiddlyElement(c, "li", null, "listBreak"), "div");
        var l = createTiddlyLink(createTiddlyElement(c, "li"), d, !1);
        createTiddlyText(l, j.openTag.format([d]))
    }
    return Popup.show(), b.cancelBubble = !0, b.stopPropagation && b.stopPropagation(), !1
}
function createTagButton(a, b, c, d, e) {
    var f = createTiddlyButton(a, d || b, (e || config.views.wikified.tag.tooltip).format([b]), onClickTag);
    return f.setAttribute("tag", b), c && f.setAttribute("tiddler", c), f
}
function onClickTiddlyPopup(a) {
    var b = a || window.event, c = this.tiddler;
    if (c.text) {
        var d = Popup.create(this, "div", "popupTiddler");
        wikify(c.text, d, null, c), Popup.show()
    }
    return b && (b.cancelBubble = !0), b && b.stopPropagation && b.stopPropagation(), !1
}
function createTiddlyPopup(a, b, c, d) {
    if (d.text) {
        createTiddlyLink(a, b, !0);
        var e = createTiddlyButton(a, glyph("downArrow"), c, onClickTiddlyPopup, "tiddlerPopupButton");
        e.tiddler = d
    } else createTiddlyText(a, b)
}
function onClickError(a) {
    var e, b = a || window.event, c = Popup.create(this), d = this.getAttribute("errorText").split("\n");
    for (e = 0; e < d.length; e++)createTiddlyElement(c, "li", null, null, d[e]);
    return Popup.show(), b.cancelBubble = !0, b.stopPropagation && b.stopPropagation(), !1
}
function createTiddlyError(a, b, c) {
    var d = createTiddlyButton(a, b, null, onClickError, "errorButton");
    c && d.setAttribute("errorText", c)
}
function Animator() {
    return this.running = 0, this.timerID = 0, this.animations = [], this
}
function Morpher(a, b, c, d) {
    return this.element = a, this.duration = b, this.properties = c, this.startTime = new Date, this.endTime = Number(this.startTime) + b, this.callback = d, this.tick(), this
}
function Zoomer(a, b, c, d) {
    var e = createTiddlyElement(document.body, "div", null, "zoomer");
    createTiddlyElement(e, "div", null, null, a);
    var f = findWindowWidth(), g = findWindowHeight(), h = [{
        style: "left",
        start: findPosX(b),
        end: findPosX(c),
        template: "%0px"
    }, {style: "top", start: findPosY(b), end: findPosY(c), template: "%0px"}, {
        style: "width",
        start: Math.min(b.scrollWidth, f),
        end: Math.min(c.scrollWidth, f),
        template: "%0px",
        atEnd: "auto"
    }, {
        style: "height",
        start: Math.min(b.scrollHeight, g),
        end: Math.min(c.scrollHeight, g),
        template: "%0px",
        atEnd: "auto"
    }, {style: "fontSize", start: 8, end: 24, template: "%0pt"}], i = function (a, b) {
        jQuery(a).remove()
    };
    return new Morpher(e, config.animDuration, h, i)
}
function Scroller(a) {
    var b = [{style: "-tw-vertScroll", start: findScrollY(), end: ensureVisible(a)}];
    return new Morpher(a, config.animDuration, b)
}
function Slider(a, b, c, d) {
    a.style.overflow = "hidden", b && (a.style.height = "0px"), a.style.display = "block";
    var e = a.scrollHeight, f = [], g = null;
    if (b)f.push({style: "height", start: 0, end: e, template: "%0px", atEnd: "auto"}), f.push({
        style: "opacity",
        start: 0,
        end: 1,
        template: "%0"
    }), f.push({
        style: "filter",
        start: 0,
        end: 100,
        template: "alpha(opacity:%0)"
    }); else switch (f.push({style: "height", start: e, end: 0, template: "%0px"}), f.push({
        style: "display",
        atEnd: "none"
    }), f.push({style: "opacity", start: 1, end: 0, template: "%0"}), f.push({
        style: "filter",
        start: 100,
        end: 0,
        template: "alpha(opacity:%0)"
    }), d) {
        case"all":
            g = function (a, b) {
                jQuery(a).remove()
            };
            break;
        case"children":
            g = function (a, b) {
                jQuery(a).empty()
            }
    }
    return new Morpher(a, config.animDuration, f, g)
}
function Wizard(a) {
    a ? (this.formElem = findRelated(a, "wizard", "className"), this.bodyElem = findRelated(this.formElem.firstChild, "wizardBody", "className", "nextSibling"), this.footElem = findRelated(this.formElem.firstChild, "wizardFooter", "className", "nextSibling")) : (this.formElem = null, this.bodyElem = null, this.footElem = null)
}
function getParam(a, b, c) {
    if (!a)return c;
    var d = a[0][b];
    return d ? d[0] : c
}
function getFlag(a, b, c) {
    return !!getParam(a, b, c)
}
function RGB(a, b, c) {
    if (this.r = 0, this.g = 0, this.b = 0, "string" == typeof a)if ("#" == a.substr(0, 1))7 == a.length ? (this.r = parseInt(a.substr(1, 2), 16) / 255, this.g = parseInt(a.substr(3, 2), 16) / 255, this.b = parseInt(a.substr(5, 2), 16) / 255) : (this.r = parseInt(a.substr(1, 1), 16) / 15, this.g = parseInt(a.substr(2, 1), 16) / 15, this.b = parseInt(a.substr(3, 1), 16) / 15); else {
        var d = /rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/, e = a.match(d);
        e && (this.r = parseInt(e[1], 10) / 255, this.g = parseInt(e[2], 10) / 255, this.b = parseInt(e[3], 10) / 255)
    } else this.r = a, this.g = b, this.b = c;
    return this
}
function drawGradient(a, b, c, d) {
    d || (d = c);
    var e;
    for (e = 0; e <= 100; e += 2) {
        var f = document.createElement("div");
        a.appendChild(f), f.style.position = "absolute", f.style.left = b ? e + "%" : 0, f.style.top = b ? 0 : e + "%", f.style.width = b ? 101 - e + "%" : "100%", f.style.height = b ? "100%" : 101 - e + "%", f.style.zIndex = -1;
        var g = e / 100 * (c.length - 1), h = d[Math.floor(g)];
        "string" == typeof h && (h = new RGB(h));
        var i = c[Math.ceil(g)];
        "string" == typeof i && (i = new RGB(i)), f.style.backgroundColor = h.mix(i, g - Math.floor(g)).toString()
    }
}
function addEvent(a, b, c) {
    a.attachEvent ? (a["e" + b + c] = c, a[b + c] = function () {
        a["e" + b + c](window.event)
    }, a.attachEvent("on" + b, a[b + c])) : a.addEventListener(b, c, !1)
}
function removeEvent(a, b, c) {
    a.detachEvent ? (a.detachEvent("on" + b, a[b + c]), a[b + c] = null) : a.removeEventListener(b, c, !1)
}
function findRelated(a, b, c, d) {
    if (c = c || "tagName", d = d || "parentNode", "className" == c)for (; a && !jQuery(a).hasClass(b);)a = a[d]; else for (; a && a[c] != b;)a = a[d];
    return a
}
function ensureVisible(a) {
    var b = findPosY(a), c = b + a.offsetHeight, d = findScrollY(), e = findWindowHeight(), f = d + e;
    return b < d ? b : c > f ? a.offsetHeight < e ? b - (e - a.offsetHeight) : b : d
}
function findWindowWidth() {
    return window.innerWidth || document.documentElement.clientWidth
}
function findWindowHeight() {
    return window.innerHeight || document.documentElement.clientHeight
}
function findDocHeight() {
    var a = document;
    return Math.max(Math.max(a.body.scrollHeight, a.documentElement.scrollHeight), Math.max(a.body.offsetHeight, a.documentElement.offsetHeight), Math.max(a.body.clientHeight, a.documentElement.clientHeight))
}
function findScrollX() {
    return window.scrollX || document.documentElement.scrollLeft
}
function findScrollY() {
    return window.scrollY || document.documentElement.scrollTop
}
function findPosX(a) {
    for (var b = 0; a.offsetParent;)b += a.offsetLeft, a = a.offsetParent;
    return b
}
function findPosY(a) {
    for (var b = 0; a.offsetParent;)b += a.offsetTop, a = a.offsetParent;
    return b
}
function blurElement(a) {
    a && a.focus && a.blur && (a.focus(), a.blur())
}
function insertSpacer(a) {
    var b = document.createTextNode(String.fromCharCode(160));
    return a && a.appendChild(b), b
}
function replaceSelection(a, b) {
    if (a.setSelectionRange) {
        var c = a.selectionStart, d = a.selectionEnd > a.selectionStart;
        a.value = a.value.substr(0, a.selectionStart) + b + a.value.substr(a.selectionEnd), a.setSelectionRange(d ? c : c + b.length, c + b.length);
        var e = a.value.split("\n").length, f = a.value.substr(0, a.selectionStart).split("\n").length - 1;
        a.scrollTop = Math.floor((f - a.rows / 2) * a.scrollHeight / e)
    } else if (document.selection) {
        var g = document.selection.createRange();
        if (g.parentElement() == a) {
            var h = "" == g.text;
            g.text = b, h || (g.moveStart("character", -b.length), g.select())
        }
    }
}
function setCaretPosition(a, b) {
    if (a.selectionStart || "0" == a.selectionStart)a.selectionStart = b, a.selectionEnd = b, a.focus(); else if (document.selection) {
        a.focus();
        var c = document.selection.createRange();
        c.moveStart("character", -a.value.length), c.moveStart("character", b), c.moveEnd("character", 0), c.select()
    }
}
function getNodeText(a) {
    for (var b = ""; a && "#text" == a.nodeName;)b += a.nodeValue, a = a.nextSibling;
    return b
}
function isDescendant(a, b) {
    for (; a;) {
        if (a === b)return !0;
        a = a.parentNode
    }
    return !1
}
function stopEvent(a) {
    var b = a || window.event;
    return b.cancelBubble = !0, b.stopPropagation && b.stopPropagation(), !1
}
function scrubNode(a) {
    if (config.browser.isIE) {
        var b = a.attributes;
        if (b) {
            var c;
            for (c = 0; c < b.length; c++) {
                var d = b[c].name;
                if ("style" !== d && ("function" == typeof a[d] || "object" == typeof a[d] && null != a[d]))try {
                    a[d] = null
                } catch (a) {
                }
            }
        }
        for (var e = a.firstChild; e;)scrubNode(e), e = e.nextSibling
    }
}
function setStylesheet(a, b, c) {
    jQuery.twStylesheet(a, {id: b, doc: c})
}
function removeStyleSheet(a) {
    jQuery.twStylesheet.remove({id: a})
}
function LoaderBase() {
}
function SaverBase() {
}
function TW21Loader() {
}
function TW21Saver() {
}
function Crypto() {
}
function allTiddlersAsHtml() {
    return store.allTiddlersAsHtml()
}
function applyPageTemplate(a) {
    refreshPageTemplate(a)
}
function displayTiddlers(a, b, c, d, e, f, g) {
    story.displayTiddlers(a, b, c, f)
}
function displayTiddler(a, b, c, d, e, f, g) {
    story.displayTiddler(a, b, c, f)
}
function loadRemoteFile(a, b, c) {
    return httpReq("GET", a, b, c)
}
function doHttp(a, b, c, d, e, f, g, h, i, j) {
    return httpReq(a, b, g, h, i, c, d, e, f, j)
}
function removeChildren(a) {
    jQuery(a).empty()
}
function removeNode(a) {
    jQuery(a).remove()
}
function getPlainText(a) {
    return jQuery(a).text()
}
function addClass(a, b) {
    jQuery(a).addClass(b)
}
function removeClass(a, b) {
    jQuery(a).removeClass(b)
}
function hasClass(a, b) {
    return jQuery(a).hasClass(b)
}
function wikifyPlain(a, b, c) {
    return b || (b = store), b.tiddlerExists(a) || b.isShadowTiddler(a) ? wikifyPlainText(b.getTiddlerText(a), c, tiddler) : ""
}
var config = {numRssItems: 20, animDuration: 400, cascadeFast: 20, cascadeSlow: 60, cascadeDepth: 5, locale: "en"};
config.parsers = {}, config.adaptors = {}, config.defaultAdaptor = null, config.tasks = {}, config.annotations = {}, config.defaultCustomFields = {}, config.messages = {
    messageClose: {},
    dates: {},
    tiddlerPopup: {}
}, config.options = {
    chkRegExpSearch: !1,
    chkCaseSensitiveSearch: !1,
    chkIncrementalSearch: !0,
    chkAnimate: !0,
    chkSaveBackups: !0,
    chkAutoSave: !1,
    chkGenerateAnRssFeed: !1,
    chkSaveEmptyTemplate: !1,
    chkOpenInNewWindow: !0,
    chkToggleLinks: !1,
    chkHttpReadOnly: !0,
    chkForceMinorUpdate: !1,
    chkConfirmDelete: !0,
    chkInsertTabs: !1,
    chkUsePreForStorage: !0,
    chkDisplayInstrumentation: !1,
    txtBackupFolder: "",
    txtEditorFocus: "text",
    txtMainTab: "tabTimeline",
    txtMoreTab: "moreTabAll",
    txtMaxEditRows: "30",
    txtFileSystemCharSet: "UTF-8",
    txtTheme: ""
}, config.optionsDesc = {}, config.optionsSource = {};
var DEFAULT_VIEW_TEMPLATE = 1, DEFAULT_EDIT_TEMPLATE = 2;
config.tiddlerTemplates = {1: "ViewTemplate", 2: "EditTemplate"}, config.views = {
    wikified: {tag: {}},
    editor: {tagChooser: {}}
}, config.backstageTasks = ["save", "importTask", "tweak", "upgrade", "plugins"], config.extensions = {}, config.macros = {
    today: {},
    version: {},
    search: {sizeTextbox: 15},
    tiddler: {},
    tag: {},
    tags: {},
    tagging: {},
    timeline: {},
    allTags: {},
    list: {all: {}, missing: {}, orphans: {}, shadowed: {}, touched: {}, filter: {}},
    closeAll: {},
    permaview: {},
    saveChanges: {},
    slider: {},
    option: {},
    options: {},
    newTiddler: {},
    newJournal: {},
    tabs: {},
    gradient: {},
    message: {},
    view: {defaultView: "text"},
    edit: {},
    tagChooser: {},
    toolbar: {},
    plugins: {},
    refreshDisplay: {},
    importTiddlers: {},
    upgrade: {source: "http://tiddlywiki-releases.tiddlyspace.com/upgrade", backupExtension: "pre.core.upgrade"},
    sync: {},
    annotations: {}
}, config.commands = {
    closeTiddler: {},
    closeOthers: {},
    editTiddler: {},
    saveTiddler: {hideReadOnly: !0},
    cancelTiddler: {},
    deleteTiddler: {hideReadOnly: !0},
    permalink: {},
    references: {type: "popup"},
    jump: {type: "popup"},
    syncing: {type: "popup"},
    fields: {type: "popup"}
}, config.evaluateMacroParameters = "all", config.textPrimitives = {
    upperLetter: "[A-ZÀ-ÞŐŰ]",
    lowerLetter: "[a-z0-9_\\-ß-ÿőű]",
    anyLetter: "[A-Za-z0-9_\\-À-Þß-ÿŐŰőű]",
    anyLetterStrict: "[A-Za-z0-9À-Þß-ÿŐŰőű]"
}, new RegExp("[ŐŰ]", "g").test("Ő") || (config.textPrimitives = {
    upperLetter: "[A-ZÀ-Þ]",
    lowerLetter: "[a-z0-9_\\-ß-ÿ]",
    anyLetter: "[A-Za-z0-9_\\-À-Þß-ÿ]",
    anyLetterStrict: "[A-Za-z0-9À-Þß-ÿ]"
}), config.textPrimitives.sliceSeparator = "::", config.textPrimitives.sectionSeparator = "##", config.textPrimitives.urlPattern = "(?:file|http|https|mailto|ftp|irc|news|data):[^\\s'\"]+(?:/|\\b)", config.textPrimitives.unWikiLink = "~", config.textPrimitives.wikiLink = "(?:(?:" + config.textPrimitives.upperLetter + "+" + config.textPrimitives.lowerLetter + "+" + config.textPrimitives.upperLetter + config.textPrimitives.anyLetter + "*)|(?:" + config.textPrimitives.upperLetter + "{2,}" + config.textPrimitives.lowerLetter + "+))", config.textPrimitives.cssLookahead = "(?:(" + config.textPrimitives.anyLetter + "+)\\(([^\\)\\|\\n]+)(?:\\):))|(?:(" + config.textPrimitives.anyLetter + "+):([^;\\|\\n]+);)", config.textPrimitives.cssLookaheadRegExp = new RegExp(config.textPrimitives.cssLookahead, "mg"), config.textPrimitives.brackettedLink = "\\[\\[([^\\]]+)\\]\\]", config.textPrimitives.titledBrackettedLink = "\\[\\[([^\\[\\]\\|]+)\\|([^\\[\\]\\|]+)\\]\\]", config.textPrimitives.tiddlerForcedLinkRegExp = new RegExp("(?:" + config.textPrimitives.titledBrackettedLink + ")|(?:" + config.textPrimitives.brackettedLink + ")|(?:" + config.textPrimitives.urlPattern + ")", "mg"), config.textPrimitives.tiddlerAnyLinkRegExp = new RegExp("(" + config.textPrimitives.wikiLink + ")|(?:" + config.textPrimitives.titledBrackettedLink + ")|(?:" + config.textPrimitives.brackettedLink + ")|(?:" + config.textPrimitives.urlPattern + ")", "mg"), config.glyphs = {
    currBrowser: null,
    browsers: [],
    codes: {}
}, config.shadowTiddlers = {
    StyleSheet: "",
    MarkupPreHead: "",
    MarkupPostHead: "",
    MarkupPreBody: "",
    MarkupPostBody: "",
    TabTimeline: "<<timeline>>",
    TabAll: "<<list all>>",
    TabTags: "<<allTags excludeLists>>",
    TabMoreMissing: "<<list missing>>",
    TabMoreOrphans: "<<list orphans>>",
    TabMoreShadowed: "<<list shadowed>>",
    AdvancedOptions: "<<options>>",
    PluginManager: "<<plugins>>",
    SystemSettings: "",
    ToolbarCommands: "|~ViewToolbar|closeTiddler closeOthers +editTiddler > fields syncing permalink references jump|\n|~EditToolbar|+saveTiddler -cancelTiddler deleteTiddler|",
    WindowTitle: "<<tiddler SiteTitle>> - <<tiddler SiteSubtitle>>"
}, config.userAgent = navigator.userAgent.toLowerCase(), config.browser = {
    isIE: config.userAgent.indexOf("msie") != -1 && config.userAgent.indexOf("opera") == -1,
    isGecko: "Gecko" == navigator.product && config.userAgent.indexOf("WebKit") == -1,
    ieVersion: /MSIE (\d{1,2}.\d)/i.exec(config.userAgent),
    isSafari: config.userAgent.indexOf("applewebkit") != -1,
    isBadSafari: !new RegExp("[ŐŰ]", "g").test("Ő"),
    firefoxDate: /gecko\/(\d{8})/i.exec(config.userAgent),
    isOpera: config.userAgent.indexOf("opera") != -1,
    isChrome: config.userAgent.indexOf("chrome") > -1,
    isLinux: config.userAgent.indexOf("linux") != -1,
    isUnix: config.userAgent.indexOf("x11") != -1,
    isMac: config.userAgent.indexOf("mac") != -1,
    isWindows: config.userAgent.indexOf("win") != -1
}, merge(config.glyphs, {
    browsers: [function () {
        return config.browser.isIE
    }, function () {
        return !0
    }], codes: {downTriangle: ["▼", "▾"], downArrow: ["↓", "↓"], bentArrowLeft: ["←", "↩"], bentArrowRight: ["→", "↪"]}
}), merge(config.options, {txtUserName: "YourName"}), merge(config.tasks, {
    save: {
        text: "save",
        tooltip: "Save your changes to this TiddlyWiki"
    },
    importTask: {
        text: "import",
        tooltip: "Import tiddlers and plugins from other TiddlyWiki files and servers",
        content: "<<importTiddlers>>"
    },
    tweak: {text: "tweak", tooltip: "Tweak the appearance and behaviour of TiddlyWiki", content: "<<options>>"},
    upgrade: {text: "upgrade", tooltip: "Upgrade TiddlyWiki core code", content: "<<upgrade>>"},
    plugins: {text: "plugins", tooltip: "Manage installed plugins", content: "<<plugins>>"}
}), merge(config.optionsDesc, {
    txtUserName: "Username for signing your edits",
    chkRegExpSearch: "Enable regular expressions for searches",
    chkCaseSensitiveSearch: "Case-sensitive searching",
    chkIncrementalSearch: "Incremental key-by-key searching",
    chkAnimate: "Enable animations",
    chkSaveBackups: "Keep backup file when saving changes",
    chkAutoSave: "Automatically save changes",
    chkGenerateAnRssFeed: "Generate an RSS feed when saving changes",
    chkSaveEmptyTemplate: "Generate an empty template when saving changes",
    chkOpenInNewWindow: "Open external links in a new window",
    chkToggleLinks: "Clicking on links to open tiddlers causes them to close",
    chkHttpReadOnly: "Hide editing features when viewed over HTTP",
    chkForceMinorUpdate: "Don't update modifier username and date when editing tiddlers",
    chkConfirmDelete: "Require confirmation before deleting tiddlers",
    chkInsertTabs: "Use the tab key to insert tab characters instead of moving between fields",
    txtBackupFolder: "Name of folder to use for backups",
    txtMaxEditRows: "Maximum number of rows in edit boxes",
    txtTheme: "Name of the theme to use",
    txtFileSystemCharSet: "Default character set for saving changes (Firefox/Mozilla only)"
}), merge(config.messages, {
    customConfigError: "Problems were encountered loading plugins. See PluginManager for details",
    pluginError: "Error: %0",
    pluginDisabled: "Not executed because disabled via 'systemConfigDisable' tag",
    pluginForced: "Executed because forced via 'systemConfigForce' tag",
    pluginVersionError: "Not executed because this plugin needs a newer version of TiddlyWiki",
    nothingSelected: "Nothing is selected. You must select one or more items first",
    savedSnapshotError: "It appears that this TiddlyWiki has been incorrectly saved. Please see http://www.tiddlywiki.com/#Download for details",
    subtitleUnknown: "(unknown)",
    undefinedTiddlerToolTip: "The tiddler '%0' doesn't yet exist",
    shadowedTiddlerToolTip: "The tiddler '%0' doesn't yet exist, but has a pre-defined shadow value",
    tiddlerLinkTooltip: "%0 - %1, %2",
    externalLinkTooltip: "External link to %0",
    noTags: "There are no tagged tiddlers",
    notFileUrlError: "You need to save this TiddlyWiki to a file before you can save changes",
    cantSaveError: "It's not possible to save changes. Possible reasons include:\n- your browser doesn't support saving (Firefox, Internet Explorer, Safari and Opera all work if properly configured)\n- the pathname to your TiddlyWiki file contains illegal characters\n- the TiddlyWiki HTML file has been moved or renamed",
    invalidFileError: "The original file '%0' does not appear to be a valid TiddlyWiki",
    backupSaved: "Backup saved",
    backupFailed: "Failed to save backup file",
    rssSaved: "RSS feed saved",
    rssFailed: "Failed to save RSS feed file",
    emptySaved: "Empty template saved",
    emptyFailed: "Failed to save empty template file",
    mainSaved: "Main TiddlyWiki file saved",
    mainDownload: "Downloading/saving main TiddlyWiki file",
    mainDownloadManual: "RIGHT CLICK HERE to download/save main TiddlyWiki file",
    mainFailed: "Failed to save main TiddlyWiki file. Your changes have not been saved",
    macroError: "Error in macro <<%0>>",
    macroErrorDetails: "Error while executing macro <<%0>>:\n%1",
    missingMacro: "No such macro",
    overwriteWarning: "A tiddler named '%0' already exists. Choose OK to overwrite it",
    unsavedChangesWarning: "WARNING! There are unsaved changes in TiddlyWiki\n\nChoose OK to save\nChoose CANCEL to discard",
    confirmExit: "--------------------------------\n\nThere are unsaved changes in TiddlyWiki. If you continue you will lose those changes\n\n--------------------------------",
    saveInstructions: "SaveChanges",
    unsupportedTWFormat: "Unsupported TiddlyWiki format '%0'",
    tiddlerSaveError: "Error when saving tiddler '%0'",
    tiddlerLoadError: "Error when loading tiddler '%0'",
    wrongSaveFormat: "Cannot save with storage format '%0'. Using standard format for save.",
    invalidFieldName: "Invalid field name %0",
    fieldCannotBeChanged: "Field '%0' cannot be changed",
    loadingMissingTiddler: "Attempting to retrieve the tiddler '%0' from the '%1' server at:\n\n'%2' in the workspace '%3'",
    upgradeDone: "The upgrade to version %0 is now complete\n\nClick 'OK' to reload the newly upgraded TiddlyWiki",
    invalidCookie: "Invalid cookie '%0'"
}), merge(config.messages.messageClose, {
    text: "close",
    tooltip: "close this message area"
}), config.messages.backstage = {
    open: {
        text: "backstage",
        tooltip: "Open the backstage area to perform authoring and editing tasks"
    },
    close: {text: "close", tooltip: "Close the backstage area"},
    prompt: "backstage: ",
    decal: {edit: {text: "edit", tooltip: "Edit the tiddler '%0'"}}
}, config.messages.listView = {
    tiddlerTooltip: "Click for the full text of this tiddler",
    previewUnavailable: "(preview not available)"
}, config.messages.dates.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], config.messages.dates.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], config.messages.dates.shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], config.messages.dates.shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], config.messages.dates.daySuffixes = ["st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "st"], config.messages.dates.am = "am", config.messages.dates.pm = "pm", merge(config.messages.tiddlerPopup, {}), merge(config.views.wikified.tag, {
    labelNoTags: "no tags",
    labelTags: "tags: ",
    openTag: "Open tag '%0'",
    tooltip: "Show tiddlers tagged with '%0'",
    openAllText: "Open all",
    openAllTooltip: "Open all of these tiddlers",
    popupNone: "No other tiddlers tagged with '%0'"
}), merge(config.views.wikified, {
    defaultText: "The tiddler '%0' doesn't yet exist. Double-click to create it",
    defaultModifier: "(missing)",
    shadowModifier: "(built-in shadow tiddler)",
    dateFormat: "DD MMM YYYY",
    createdPrompt: "created"
}), merge(config.views.editor, {
    tagPrompt: "Type tags separated with spaces, [[use double square brackets]] if necessary, or add existing",
    defaultText: "Type the text for '%0'"
}), merge(config.views.editor.tagChooser, {
    text: "tags",
    tooltip: "Choose existing tags to add to this tiddler",
    popupNone: "There are no tags defined",
    tagTooltip: "Add the tag '%0'"
}), merge(config.messages, {
    sizeTemplates: [{unit: 1073741824, template: "%0 GB"}, {
        unit: 1048576,
        template: "%0 MB"
    }, {unit: 1024, template: "%0 KB"}, {unit: 1, template: "%0 B"}]
}), merge(config.macros.search, {
    label: "search",
    prompt: "Search this TiddlyWiki",
    placeholder: "",
    accessKey: "F",
    successMsg: "%0 tiddlers found matching %1",
    failureMsg: "No tiddlers found matching %0"
}), merge(config.macros.tagging, {
    label: "Tiddlers with tag '%0' are: ",
    labelNotTag: "Tiddlers with tag '%0' not found.",
    tooltip: "List of tiddlers tagged with '%0'"
}), merge(config.macros.timeline, {dateFormat: "DD MMM YYYY"}), merge(config.macros.allTags, {
    tooltip: "Show tiddlers tagged with '%0'",
    noTags: "There are no tagged tiddlers"
}), config.macros.list.all.prompt = "All tiddlers in alphabetical order", config.macros.list.missing.prompt = "Tiddlers that have links to them but are not defined", config.macros.list.orphans.prompt = "Tiddlers that are not linked to from any other tiddlers", config.macros.list.shadowed.prompt = "Tiddlers shadowed with default contents", config.macros.list.touched.prompt = "Tiddlers that have been modified locally", merge(config.macros.closeAll, {
    label: "close all",
    prompt: "Close all displayed tiddlers (except any that are being edited)"
}), merge(config.macros.permaview, {
    label: "permaview",
    prompt: "Link to an URL that retrieves all the currently displayed tiddlers"
}), merge(config.macros.saveChanges, {
    label: "save changes",
    prompt: "Save all tiddlers to create a new TiddlyWiki",
    accessKey: "S"
}), merge(config.macros.newTiddler, {
    label: "new tiddler",
    prompt: "Create a new tiddler",
    title: "New Tiddler",
    accessKey: "N"
}), merge(config.macros.newJournal, {
    label: "new journal",
    prompt: "Create a new tiddler from the current date and time",
    accessKey: "J"
}), merge(config.macros.options, {
    wizardTitle: "Tweak advanced options",
    step1Title: "These options are saved in cookies in your browser",
    step1Html: "<input type='hidden' name='markList'></input><br><input type='checkbox' checked='false' name='chkUnknown'>Show unknown options</input>",
    unknownDescription: "//(unknown)//",
    listViewTemplate: {
        columns: [{
            name: "Option",
            field: "option",
            title: "Option",
            type: "String"
        }, {name: "Description", field: "description", title: "Description", type: "WikiText"}, {
            name: "Name",
            field: "name",
            title: "Name",
            type: "String"
        }], rowClasses: [{className: "lowlight", field: "lowlight"}]
    }
}), merge(config.macros.plugins, {
    wizardTitle: "Manage plugins",
    step1Title: "Currently loaded plugins",
    step1Html: "<input type='hidden' name='markList'></input>",
    skippedText: "(This plugin has not been executed because it was added since startup)",
    noPluginText: "There are no plugins installed",
    confirmDeleteText: "Are you sure you want to delete these plugins:\n\n%0",
    removeLabel: "remove systemConfig tag",
    removePrompt: "Remove systemConfig tag",
    deleteLabel: "delete",
    deletePrompt: "Delete these tiddlers forever",
    listViewTemplate: {
        columns: [{
            name: "Selected",
            field: "Selected",
            rowName: "title",
            type: "Selector"
        }, {name: "Tiddler", field: "tiddler", title: "Tiddler", type: "Tiddler"}, {
            name: "Description",
            field: "Description",
            title: "Description",
            type: "String"
        }, {name: "Version", field: "Version", title: "Version", type: "String"}, {
            name: "Size",
            field: "size",
            tiddlerLink: "size",
            title: "Size",
            type: "Size"
        }, {
            name: "Forced",
            field: "forced",
            title: "Forced",
            tag: "systemConfigForce",
            type: "TagCheckbox"
        }, {
            name: "Disabled",
            field: "disabled",
            title: "Disabled",
            tag: "systemConfigDisable",
            type: "TagCheckbox"
        }, {
            name: "Executed",
            field: "executed",
            title: "Loaded",
            type: "Boolean",
            trueText: "Yes",
            falseText: "No"
        }, {name: "Startup Time", field: "startupTime", title: "Startup Time", type: "String"}, {
            name: "Error",
            field: "error",
            title: "Status",
            type: "Boolean",
            trueText: "Error",
            falseText: "OK"
        }, {name: "Log", field: "log", title: "Log", type: "StringList"}],
        rowClasses: [{className: "error", field: "error"}, {className: "warning", field: "warning"}]
    },
    listViewTemplateReadOnly: {
        columns: [{
            name: "Tiddler",
            field: "tiddler",
            title: "Tiddler",
            type: "Tiddler"
        }, {name: "Description", field: "Description", title: "Description", type: "String"}, {
            name: "Version",
            field: "Version",
            title: "Version",
            type: "String"
        }, {name: "Size", field: "size", tiddlerLink: "size", title: "Size", type: "Size"}, {
            name: "Executed",
            field: "executed",
            title: "Loaded",
            type: "Boolean",
            trueText: "Yes",
            falseText: "No"
        }, {name: "Startup Time", field: "startupTime", title: "Startup Time", type: "String"}, {
            name: "Error",
            field: "error",
            title: "Status",
            type: "Boolean",
            trueText: "Error",
            falseText: "OK"
        }, {name: "Log", field: "log", title: "Log", type: "StringList"}],
        rowClasses: [{className: "error", field: "error"}, {className: "warning", field: "warning"}]
    }
}), merge(config.macros.toolbar, {
    moreLabel: "more",
    morePrompt: "Show additional commands",
    lessLabel: "less",
    lessPrompt: "Hide additional commands",
    separator: "|"
}), merge(config.macros.refreshDisplay, {
    label: "refresh",
    prompt: "Redraw the entire TiddlyWiki display"
}), merge(config.macros.importTiddlers, {
    readOnlyWarning: "You cannot import into a read-only TiddlyWiki file. Try opening it from a file:// URL",
    wizardTitle: "Import tiddlers from another file or server",
    step1Title: "Step 1: Locate the server or TiddlyWiki file",
    step1Html: "Specify the type of the server: <select name='selTypes'><option value=''>Choose...</option></select><br>Enter the URL or pathname here: <input type='text' size=50 name='txtPath'><br>...or browse for a file: <input type='file' size=50 name='txtBrowse'><br><hr>...or select a pre-defined feed: <select name='selFeeds'><option value=''>Choose...</option></select>",
    openLabel: "open",
    openPrompt: "Open the connection to this file or server",
    statusOpenHost: "Opening the host",
    statusGetWorkspaceList: "Getting the list of available workspaces",
    step2Title: "Step 2: Choose the workspace",
    step2Html: "Enter a workspace name: <input type='text' size=50 name='txtWorkspace'><br>...or select a workspace: <select name='selWorkspace'><option value=''>Choose...</option></select>",
    cancelLabel: "cancel",
    cancelPrompt: "Cancel this import",
    statusOpenWorkspace: "Opening the workspace",
    statusGetTiddlerList: "Getting the list of available tiddlers",
    errorGettingTiddlerList: "Error getting list of tiddlers, click Cancel to try again",
    errorGettingTiddlerListHttp404: "Error retrieving tiddlers from url, please ensure the url exists. Click Cancel to try again.",
    errorGettingTiddlerListHttp: "Error retrieving tiddlers from url, please ensure this url exists and is <a href='http://enable-cors.org/'>CORS</a> enabled",
    errorGettingTiddlerListFile: "Error retrieving tiddlers from local file, please make sure the file is in the same directory as your TiddlyWiki. Click Cancel to try again.",
    step3Title: "Step 3: Choose the tiddlers to import",
    step3Html: "<input type='hidden' name='markList'></input><br><input type='checkbox' checked='true' name='chkSync'>Keep these tiddlers linked to this server so that you can synchronise subsequent changes</input><br><input type='checkbox' name='chkSave'>Save the details of this server in a 'systemServer' tiddler called:</input> <input type='text' size=25 name='txtSaveTiddler'>",
    importLabel: "import",
    importPrompt: "Import these tiddlers",
    confirmOverwriteText: "Are you sure you want to overwrite these tiddlers:\n\n%0",
    step4Title: "Step 4: Importing %0 tiddler(s)",
    step4Html: "<input type='hidden' name='markReport'></input>",
    doneLabel: "done",
    donePrompt: "Close this wizard",
    statusDoingImport: "Importing tiddlers",
    statusDoneImport: "All tiddlers imported",
    systemServerNamePattern: "%2 on %1",
    systemServerNamePatternNoWorkspace: "%1",
    confirmOverwriteSaveTiddler: "The tiddler '%0' already exists. Click 'OK' to overwrite it with the details of this server, or 'Cancel' to leave it unchanged",
    serverSaveTemplate: "|''Type:''|%0|\n|''URL:''|%1|\n|''Workspace:''|%2|\n\nThis tiddler was automatically created to record the details of this server",
    serverSaveModifier: "(System)",
    listViewTemplate: {
        columns: [{
            name: "Selected",
            field: "Selected",
            rowName: "title",
            type: "Selector"
        }, {name: "Tiddler", field: "tiddler", title: "Tiddler", type: "Tiddler"}, {
            name: "Size",
            field: "size",
            tiddlerLink: "size",
            title: "Size",
            type: "Size"
        }, {name: "Tags", field: "tags", title: "Tags", type: "Tags"}], rowClasses: []
    }
}), merge(config.macros.upgrade, {
    wizardTitle: "Upgrade TiddlyWiki core code",
    step1Title: "Update or repair this TiddlyWiki to the latest release",
    step1Html: "You are about to upgrade to the latest release of the TiddlyWiki core code (from <a href='%0' class='externalLink' target='_blank'>%1</a>). Your content will be preserved across the upgrade.<br><br>Note that core upgrades have been known to interfere with older plugins. If you run into problems with the upgraded file, see <a href='http://www.tiddlywiki.org/wiki/CoreUpgrades' class='externalLink' target='_blank'>http://www.tiddlywiki.org/wiki/CoreUpgrades</a>",
    errorCantUpgrade: "Unable to upgrade this TiddlyWiki. You can only perform upgrades on TiddlyWiki files stored locally",
    errorNotSaved: "You must save changes before you can perform an upgrade",
    step2Title: "Confirm the upgrade details",
    step2Html_downgrade: "You are about to downgrade to TiddlyWiki version %0 from %1.<br><br>Downgrading to an earlier version of the core code is not recommended",
    step2Html_restore: "This TiddlyWiki appears to be already using the latest version of the core code (%0).<br><br>You can continue to upgrade anyway to ensure that the core code hasn't been corrupted or damaged",
    step2Html_upgrade: "You are about to upgrade to TiddlyWiki version %0 from %1",
    upgradeLabel: "upgrade",
    upgradePrompt: "Prepare for the upgrade process",
    statusPreparingBackup: "Preparing backup",
    statusSavingBackup: "Saving backup file",
    errorSavingBackup: "There was a problem saving the backup file",
    statusLoadingCore: "Loading core code",
    errorLoadingCore: "Error loading the core code",
    errorCoreFormat: "Error with the new core code",
    statusSavingCore: "Saving the new core code",
    statusReloadingCore: "Reloading the new core code",
    startLabel: "start",
    startPrompt: "Start the upgrade process",
    cancelLabel: "cancel",
    cancelPrompt: "Cancel the upgrade process",
    step3Title: "Upgrade cancelled",
    step3Html: "You have cancelled the upgrade process"
}), merge(config.macros.annotations, {}), merge(config.commands.closeTiddler, {
    text: "close",
    tooltip: "Close this tiddler"
}), merge(config.commands.closeOthers, {
    text: "close others",
    tooltip: "Close all other tiddlers"
}), merge(config.commands.editTiddler, {
    text: "edit",
    tooltip: "Edit this tiddler",
    readOnlyText: "view",
    readOnlyTooltip: "View the source of this tiddler"
}), merge(config.commands.saveTiddler, {
    text: "done",
    tooltip: "Save changes to this tiddler"
}), merge(config.commands.cancelTiddler, {
    text: "cancel",
    tooltip: "Undo changes to this tiddler",
    warning: "Are you sure you want to abandon your changes to '%0'?",
    readOnlyText: "done",
    readOnlyTooltip: "View this tiddler normally"
}), merge(config.commands.deleteTiddler, {
    text: "delete",
    tooltip: "Delete this tiddler",
    warning: "Are you sure you want to delete '%0'?"
}), merge(config.commands.permalink, {
    text: "permalink",
    tooltip: "Permalink for this tiddler"
}), merge(config.commands.references, {
    text: "references",
    tooltip: "Show tiddlers that link to this one",
    popupNone: "No references"
}), merge(config.commands.jump, {
    text: "jump",
    tooltip: "Jump to another open tiddler"
}), merge(config.commands.fields, {
    text: "fields",
    tooltip: "Show the extended fields of this tiddler",
    emptyText: "There are no extended fields for this tiddler",
    listViewTemplate: {
        columns: [{name: "Field", field: "field", title: "Field", type: "String"}, {
            name: "Value",
            field: "value",
            title: "Value",
            type: "String"
        }], rowClasses: [], buttons: []
    }
}), merge(config.shadowTiddlers, {
    DefaultTiddlers: "[[GettingStarted]]",
    MainMenu: "[[GettingStarted]]",
    SiteTitle: "My TiddlyWiki",
    SiteSubtitle: "a reusable non-linear personal web notebook",
    SiteUrl: "",
    SideBarOptions: '<<search>><<closeAll>><<permaview>><<newTiddler>><<newJournal "DD MMM YYYY" "journal">><<saveChanges>><<slider chkSliderOptionsPanel OptionsPanel "options »" "Change TiddlyWiki advanced options">>',
    SideBarTabs: '<<tabs txtMainTab "Timeline" "Timeline" TabTimeline "All" "All tiddlers" TabAll "Tags" "All tags" TabTags "More" "More lists" TabMore>>',
    TabMore: '<<tabs txtMoreTab "Missing" "Missing tiddlers" TabMoreMissing "Orphans" "Orphaned tiddlers" TabMoreOrphans "Shadowed" "Shadowed tiddlers" TabMoreShadowed>>'
}), merge(config.annotations, {
    AdvancedOptions: "This shadow tiddler provides access to several advanced options",
    ColorPalette: "These values in this shadow tiddler determine the colour scheme of the ~TiddlyWiki user interface",
    DefaultTiddlers: "The tiddlers listed in this shadow tiddler will be automatically displayed when ~TiddlyWiki starts up",
    EditTemplate: "The HTML template in this shadow tiddler determines how tiddlers look while they are being edited",
    GettingStarted: "This shadow tiddler provides basic usage instructions",
    ImportTiddlers: "This shadow tiddler provides access to importing tiddlers",
    MainMenu: "This shadow tiddler is used as the contents of the main menu in the left-hand column of the screen",
    MarkupPreHead: "This tiddler is inserted at the top of the <head> section of the TiddlyWiki HTML file",
    MarkupPostHead: "This tiddler is inserted at the bottom of the <head> section of the TiddlyWiki HTML file",
    MarkupPreBody: "This tiddler is inserted at the top of the <body> section of the TiddlyWiki HTML file",
    MarkupPostBody: "This tiddler is inserted at the end of the <body> section of the TiddlyWiki HTML file immediately after the script block",
    OptionsPanel: "This shadow tiddler is used as the contents of the options panel slider in the right-hand sidebar",
    PageTemplate: "The HTML template in this shadow tiddler determines the overall ~TiddlyWiki layout",
    PluginManager: "This shadow tiddler provides access to the plugin manager",
    SideBarOptions: "This shadow tiddler is used as the contents of the option panel in the right-hand sidebar",
    SideBarTabs: "This shadow tiddler is used as the contents of the tabs panel in the right-hand sidebar",
    SiteSubtitle: "This shadow tiddler is used as the second part of the page title",
    SiteTitle: "This shadow tiddler is used as the first part of the page title",
    SiteUrl: "This shadow tiddler should be set to the full target URL for publication",
    StyleSheetColors: "This shadow tiddler contains CSS definitions related to the color of page elements. ''DO NOT EDIT THIS TIDDLER'', instead make your changes in the StyleSheet shadow tiddler",
    StyleSheet: "This tiddler can contain custom CSS definitions",
    StyleSheetLayout: "This shadow tiddler contains CSS definitions related to the layout of page elements. ''DO NOT EDIT THIS TIDDLER'', instead make your changes in the StyleSheet shadow tiddler",
    StyleSheetLocale: "This shadow tiddler contains CSS definitions related to the translation locale",
    StyleSheetPrint: "This shadow tiddler contains CSS definitions for printing",
    SystemSettings: "This tiddler is used to store configuration options for this TiddlyWiki document",
    TabAll: "This shadow tiddler contains the contents of the 'All' tab in the right-hand sidebar",
    TabMore: "This shadow tiddler contains the contents of the 'More' tab in the right-hand sidebar",
    TabMoreMissing: "This shadow tiddler contains the contents of the 'Missing' tab in the right-hand sidebar",
    TabMoreOrphans: "This shadow tiddler contains the contents of the 'Orphans' tab in the right-hand sidebar",
    TabMoreShadowed: "This shadow tiddler contains the contents of the 'Shadowed' tab in the right-hand sidebar",
    TabTags: "This shadow tiddler contains the contents of the 'Tags' tab in the right-hand sidebar",
    TabTimeline: "This shadow tiddler contains the contents of the 'Timeline' tab in the right-hand sidebar",
    ToolbarCommands: "This shadow tiddler determines which commands are shown in tiddler toolbars",
    ViewTemplate: "The HTML template in this shadow tiddler determines how tiddlers look"
});
var params = null, store = null, story = null, formatter = null, anim = "function" == typeof Animator ? new Animator : null, readOnly = !1, highlightHack = null, hadConfirmExit = !1, safeMode = !1, showBackstage, installedPlugins = [], startingUp = !1, pluginInfo, tiddler;
window.allowSave = window.allowSave || function (a) {
        return !0
    }, window.isLocal = function () {
    return "file:" == document.location.protocol
};
var useJavaSaver = window.isLocal() && (config.browser.isSafari || config.browser.isOpera);
window.tweakConfig && window.tweakConfig(), window && window.console || (console = {
    tiddlywiki: !0, log: function (a) {
        displayMessage(a)
    }
}), config.paramifiers = {}, config.paramifiers.start = {
    oninit: function (a) {
        safeMode = "safe" == a.toLowerCase()
    }
}, config.paramifiers.open = {
    onstart: function (a) {
        (!readOnly || store.tiddlerExists(a) || store.isShadowTiddler(a)) && story.displayTiddler("bottom", a, null, !1, null)
    }
}, config.paramifiers.story = {
    onstart: function (a) {
        var b = store.getTiddlerText(a, "").parseParams("open", null, !1);
        invokeParamifier(b, "onstart")
    }
}, config.paramifiers.search = {
    onstart: function (a) {
        story.search(a, !1, !1)
    }
}, config.paramifiers.searchRegExp = {
    onstart: function (a) {
        story.prototype.search(a, !1, !0)
    }
}, config.paramifiers.tag = {
    onstart: function (a) {
        story.displayTiddlers(null, store.filterTiddlers("[tag[" + a + "]]"), null, !1, null)
    }
}, config.paramifiers.newTiddler = {
    onstart: function (a) {
        var b = a.parseParams("anon", null, null)[0], c = b.title ? b.title[0] : a, d = b.fields ? b.fields[0] : null;
        if (!readOnly) {
            story.displayTiddler(null, c, DEFAULT_EDIT_TEMPLATE, !1, null, d), story.focusTiddler(c, "text");
            var e, f = b.tag || [];
            for (e = 0; e < f.length; e++)story.setTiddlerTag(c, f[e], 1)
        }
    }
}, config.paramifiers.newJournal = {
    onstart: function (a) {
        if (!readOnly) {
            var b = new Date, c = b.formatString(a.trim());
            story.displayTiddler(null, c, DEFAULT_EDIT_TEMPLATE), story.focusTiddler(c, "text")
        }
    }
}, config.paramifiers.readOnly = {
    onconfig: function (a) {
        var b = a.toLowerCase();
        readOnly = "yes" == b || "no" != b && readOnly
    }
}, config.paramifiers.theme = {
    onconfig: function (a) {
        story.switchTheme(a)
    }
}, config.paramifiers.upgrade = {
    onstart: function (a) {
        upgradeFrom(a)
    }
}, config.paramifiers.recent = {
    onstart: function (a) {
        var c, b = [], d = store.getTiddlers("modified", "excludeLists").reverse();
        for (c = 0; c < a && c < d.length; c++)b.push(d[c].title);
        story.displayTiddlers(null, b)
    }
}, config.paramifiers.filter = {
    onstart: function (a) {
        story.displayTiddlers(null, store.filterTiddlers(a), null, !1)
    }
}, config.formatterHelpers = {
    createElementAndWikify: function (a) {
        a.subWikifyTerm(createTiddlyElement(a.output, this.element), this.termRegExp)
    }, inlineCssHelper: function (a) {
        var b = [];
        config.textPrimitives.cssLookaheadRegExp.lastIndex = a.nextMatch;
        for (var c = config.textPrimitives.cssLookaheadRegExp.exec(a.source); c && c.index == a.nextMatch;) {
            var d, e;
            c[1] ? (d = c[1].unDash(), e = c[2]) : (d = c[3].unDash(), e = c[4]), "bgcolor" == d && (d = "backgroundColor"), "float" == d && (d = "cssFloat"), b.push({
                style: d,
                value: e
            }), a.nextMatch = c.index + c[0].length, config.textPrimitives.cssLookaheadRegExp.lastIndex = a.nextMatch, c = config.textPrimitives.cssLookaheadRegExp.exec(a.source)
        }
        return b
    }, applyCssHelper: function (a, b) {
        var c;
        for (c = 0; c < b.length; c++)try {
            a.style[b[c].style] = b[c].value
        } catch (a) {
        }
    }, enclosedTextHelper: function (a) {
        this.lookaheadRegExp.lastIndex = a.matchStart;
        var b = this.lookaheadRegExp.exec(a.source);
        if (b && b.index == a.matchStart) {
            var c = b[1];
            config.browser.isIE && config.browser.ieVersion[1] < 10 && (c = c.replace(/\n/g, "\r")), createTiddlyElement(a.output, this.element, null, null, c), a.nextMatch = b.index + b[0].length
        }
    }, isExternalLink: function (a) {
        if (store.tiddlerExists(a) || store.isShadowTiddler(a))return !1;
        var b = new RegExp(config.textPrimitives.urlPattern, "mg");
        return !!b.exec(a) || (a.indexOf(".") != -1 || a.indexOf("\\") != -1 || a.indexOf("/") != -1 || a.indexOf("#") != -1)
    }
}, config.formatters = [{
    name: "table",
    match: "^\\|(?:[^\\n]*)\\|(?:[fhck]?)$",
    lookaheadRegExp: /^\|([^\n]*)\|([fhck]?)$/gm,
    rowTermRegExp: /(\|(?:[fhck]?)$\n?)/gm,
    cellRegExp: /(?:\|([^\n\|]*)\|)|(\|[fhck]?$\n?)/gm,
    cellTermRegExp: /((?:\x20*)\|)/gm,
    rowTypes: {c: "caption", h: "thead", "": "tbody", f: "tfoot"},
    handler: function (a) {
        var e, b = createTiddlyElement(a.output, "table", null, "twtable"), c = [], d = null, f = 0, g = function () {
            jQuery(this).addClass("hoverRow")
        }, h = function () {
            jQuery(this).removeClass("hoverRow")
        };
        a.nextMatch = a.matchStart, this.lookaheadRegExp.lastIndex = a.nextMatch;
        for (var i = this.lookaheadRegExp.exec(a.source); i && i.index == a.nextMatch;) {
            var j = i[2];
            if ("k" == j)b.className = i[1], a.nextMatch += i[0].length + 1; else if (j != d && (e = createTiddlyElement(b, this.rowTypes[j]), d = j), "c" == d)a.nextMatch++, e != b.firstChild && b.insertBefore(e, b.firstChild), e.setAttribute("align", 0 == f ? "top" : "bottom"), a.subWikifyTerm(e, this.rowTermRegExp); else {
                var k = createTiddlyElement(e, "tr", null, f % 2 ? "oddRow" : "evenRow");
                k.onmouseover = g, k.onmouseout = h, this.rowHandler(a, k, c), f++
            }
            this.lookaheadRegExp.lastIndex = a.nextMatch, i = this.lookaheadRegExp.exec(a.source)
        }
    },
    rowHandler: function (a, b, c) {
        var d = 0, e = 1, f = null;
        this.cellRegExp.lastIndex = a.nextMatch;
        for (var g = this.cellRegExp.exec(a.source); g && g.index == a.nextMatch;) {
            if ("~" == g[1]) {
                var h = c[d];
                h && (h.rowSpanCount++, h.element.setAttribute("rowspan", h.rowSpanCount), h.element.setAttribute("rowSpan", h.rowSpanCount), h.element.valign = "center", e > 1 && (h.element.setAttribute("colspan", e), h.element.setAttribute("colSpan", e), e = 1)), a.nextMatch = this.cellRegExp.lastIndex - 1
            } else if (">" == g[1])e++, a.nextMatch = this.cellRegExp.lastIndex - 1; else {
                if (g[2]) {
                    f && e > 1 && (f.setAttribute("colspan", e), f.setAttribute("colSpan", e)), a.nextMatch = this.cellRegExp.lastIndex;
                    break
                }
                a.nextMatch++;
                for (var i = config.formatterHelpers.inlineCssHelper(a), j = !1, k = a.source.substr(a.nextMatch, 1); " " == k;)j = !0, a.nextMatch++, k = a.source.substr(a.nextMatch, 1);
                var l;
                "!" == k ? (l = createTiddlyElement(b, "th"), a.nextMatch++) : l = createTiddlyElement(b, "td"), f = l, c[d] = {
                    rowSpanCount: 1,
                    element: l
                }, e > 1 && (l.setAttribute("colspan", e), l.setAttribute("colSpan", e), e = 1), config.formatterHelpers.applyCssHelper(l, i), a.subWikifyTerm(l, this.cellTermRegExp), " " == a.matchText.substr(a.matchText.length - 2, 1) ? l.align = j ? "center" : "left" : j && (l.align = "right"), a.nextMatch--
            }
            d++, this.cellRegExp.lastIndex = a.nextMatch, g = this.cellRegExp.exec(a.source)
        }
    }
}, {
    name: "heading", match: "^!{1,6}", termRegExp: /(\n)/gm, handler: function (a) {
        a.subWikifyTerm(createTiddlyElement(a.output, "h" + a.matchLength), this.termRegExp)
    }
}, {
    name: "list",
    match: "^(?:[\\*#;:]+)",
    lookaheadRegExp: /^(?:(?:(\*)|(#)|(;)|(:))+)/gm,
    termRegExp: /(\n)/gm,
    handler: function (a) {
        var e, f, g, h, b = [a.output], c = 0, d = null;
        a.nextMatch = a.matchStart, this.lookaheadRegExp.lastIndex = a.nextMatch;
        for (var i = this.lookaheadRegExp.exec(a.source); i && i.index == a.nextMatch;) {
            i[1] ? (f = "ul", g = "li") : i[2] ? (f = "ol", g = "li") : i[3] ? (f = "dl", g = "dt") : i[4] && (f = "dl", g = "dd"), h || (h = f), e = i[0].length, a.nextMatch += i[0].length;
            var j;
            if (e > c)for (j = c; j < e; j++) {
                var k = 0 == c ? b[b.length - 1] : b[b.length - 1].lastChild;
                b.push(createTiddlyElement(k, f))
            } else {
                if (f != h && 1 == e)return void(a.nextMatch -= i[0].length);
                if (e < c)for (j = c; j > e; j--)b.pop(); else e == c && f != d && (b.pop(), b.push(createTiddlyElement(b[b.length - 1].lastChild, f)))
            }
            c = e, d = f;
            var l = createTiddlyElement(b[b.length - 1], g);
            a.subWikifyTerm(l, this.termRegExp), this.lookaheadRegExp.lastIndex = a.nextMatch, i = this.lookaheadRegExp.exec(a.source)
        }
    }
}, {
    name: "quoteByBlock",
    match: "^<<<\\n",
    termRegExp: /(^<<<(\n|$))/gm,
    element: "blockquote",
    handler: config.formatterHelpers.createElementAndWikify
}, {
    name: "quoteByLine",
    match: "^>+",
    lookaheadRegExp: /^>+/gm,
    termRegExp: /(\n)/gm,
    element: "blockquote",
    handler: function (a) {
        var e, f, b = [a.output], c = 0, d = a.matchLength;
        do {
            if (d > c)for (e = c; e < d; e++)b.push(createTiddlyElement(b[b.length - 1], this.element)); else if (d < c)for (e = c; e > d; e--)b.pop();
            c = d, a.subWikifyTerm(b[b.length - 1], this.termRegExp), createTiddlyElement(b[b.length - 1], "br"), this.lookaheadRegExp.lastIndex = a.nextMatch;
            var g = this.lookaheadRegExp.exec(a.source);
            f = g && g.index == a.nextMatch, f && (d = g[0].length, a.nextMatch += g[0].length)
        } while (f)
    }
}, {
    name: "rule", match: "^----+$\\n?|<hr ?/?>\\n?", handler: function (a) {
        createTiddlyElement(a.output, "hr")
    }
}, {
    name: "monospacedByLine",
    match: "^(?:/\\*\\{\\{\\{\\*/|\\{\\{\\{|//\\{\\{\\{|<!--\\{\\{\\{-->)\\n",
    element: "pre",
    handler: function (a) {
        switch (a.matchText) {
            case"/*{{{*/\n":
                this.lookaheadRegExp = /\/\*\{\{\{\*\/\n*((?:^[^\n]*\n)+?)(\n*^\f*\/\*\}\}\}\*\/$\n?)/gm;
                break;
            case"{{{\n":
                this.lookaheadRegExp = /^\{\{\{\n((?:^[^\n]*\n)+?)(^\f*\}\}\}$\n?)/gm;
                break;
            case"//{{{\n":
                this.lookaheadRegExp = /^\/\/\{\{\{\n\n*((?:^[^\n]*\n)+?)(\n*^\f*\/\/\}\}\}$\n?)/gm;
                break;
            case"<!--{{{-->\n":
                this.lookaheadRegExp = /<!--\{\{\{-->\n*((?:^[^\n]*\n)+?)(\n*^\f*<!--\}\}\}-->$\n?)/gm
        }
        config.formatterHelpers.enclosedTextHelper.call(this, a)
    }
}, {
    name: "wikifyComment", match: "^(?:/\\*\\*\\*|<!---)\\n", handler: function (a) {
        var b = "/***\n" == a.matchText ? /(^\*\*\*\/\n)/gm : /(^--->\n)/gm;
        a.subWikifyTerm(a.output, b)
    }
}, {
    name: "macro", match: "<<", lookaheadRegExp: /<<([^>\s]+)(?:\s*)((?:[^>]|(?:>(?!>)))*)>>/gm, handler: function (a) {
        this.lookaheadRegExp.lastIndex = a.matchStart;
        var b = this.lookaheadRegExp.exec(a.source);
        b && b.index == a.matchStart && b[1] && (a.nextMatch = this.lookaheadRegExp.lastIndex, invokeMacro(a.output, b[1], b[2], a, a.tiddler))
    }
}, {
    name: "prettyLink", match: "\\[\\[", lookaheadRegExp: /\[\[(.*?)(?:\|(~)?(.*?))?\]\]/gm, handler: function (a) {
        this.lookaheadRegExp.lastIndex = a.matchStart;
        var b = this.lookaheadRegExp.exec(a.source);
        if (b && b.index == a.matchStart) {
            var c, d = b[1];
            if (b[3]) {
                var e = b[3];
                c = !b[2] && config.formatterHelpers.isExternalLink(e) ? createExternalLink(a.output, e) : createTiddlyLink(a.output, e, !1, null, a.isStatic, a.tiddler)
            } else c = createTiddlyLink(a.output, d, !1, null, a.isStatic, a.tiddler);
            createTiddlyText(c, d), a.nextMatch = this.lookaheadRegExp.lastIndex
        }
    }
}, {
    name: "wikiLink",
    match: config.textPrimitives.unWikiLink + "?" + config.textPrimitives.wikiLink,
    handler: function (a) {
        if (a.matchText.substr(0, 1) == config.textPrimitives.unWikiLink)return void a.outputText(a.output, a.matchStart + 1, a.nextMatch);
        if (a.matchStart > 0) {
            var b = new RegExp(config.textPrimitives.anyLetterStrict, "mg");
            b.lastIndex = a.matchStart - 1;
            var c = b.exec(a.source);
            if (c.index == a.matchStart - 1)return void a.outputText(a.output, a.matchStart, a.nextMatch)
        }
        if (a.autoLinkWikiWords || store.isShadowTiddler(a.matchText)) {
            var d = createTiddlyLink(a.output, a.matchText, !1, null, a.isStatic, a.tiddler);
            a.outputText(d, a.matchStart, a.nextMatch)
        } else a.outputText(a.output, a.matchStart, a.nextMatch)
    }
}, {
    name: "urlLink", match: config.textPrimitives.urlPattern, handler: function (a) {
        a.outputText(createExternalLink(a.output, a.matchText), a.matchStart, a.nextMatch)
    }
}, {
    name: "image",
    match: "\\[[<>]?[Ii][Mm][Gg]\\[",
    lookaheadRegExp: /\[([<]?)(>?)[Ii][Mm][Gg]\[(?:([^\|\]]+)\|)?([^\[\]\|]+)\](?:\[([^\]]*)\])?\]/gm,
    handler: function (a) {
        this.lookaheadRegExp.lastIndex = a.matchStart;
        var b = this.lookaheadRegExp.exec(a.source);
        if (b && b.index == a.matchStart) {
            var c = a.output;
            if (b[5]) {
                var d = b[5];
                c = config.formatterHelpers.isExternalLink(d) ? createExternalLink(a.output, d) : createTiddlyLink(a.output, d, !1, null, a.isStatic, a.tiddler), jQuery(c).addClass("imageLink")
            }
            var e = createTiddlyElement(c, "img");
            b[1] ? e.align = "left" : b[2] && (e.align = "right"), b[3] && (e.title = b[3], e.setAttribute("alt", b[3])), e.src = b[4], a.nextMatch = this.lookaheadRegExp.lastIndex
        }
    }
}, {
    name: "html",
    match: "<[Hh][Tt][Mm][Ll]>",
    lookaheadRegExp: /<[Hh][Tt][Mm][Ll]>((?:.|\n)*?)<\/[Hh][Tt][Mm][Ll]>/gm,
    handler: function (a) {
        this.lookaheadRegExp.lastIndex = a.matchStart;
        var b = this.lookaheadRegExp.exec(a.source);
        b && b.index == a.matchStart && (createTiddlyElement(a.output, "span").innerHTML = b[1], a.nextMatch = this.lookaheadRegExp.lastIndex)
    }
}, {
    name: "commentByBlock", match: "/%", lookaheadRegExp: /\/%((?:.|\n)*?)%\//gm, handler: function (a) {
        this.lookaheadRegExp.lastIndex = a.matchStart;
        var b = this.lookaheadRegExp.exec(a.source);
        b && b.index == a.matchStart && (a.nextMatch = this.lookaheadRegExp.lastIndex)
    }
}, {
    name: "characterFormat", match: "''|//|__|\\^\\^|~~|--(?!\\s|$)|\\{\\{\\{", handler: function (a) {
        switch (a.matchText) {
            case"''":
                a.subWikifyTerm(a.output.appendChild(document.createElement("strong")), /('')/gm);
                break;
            case"//":
                a.subWikifyTerm(createTiddlyElement(a.output, "em"), /(\/\/)/gm);
                break;
            case"__":
                a.subWikifyTerm(createTiddlyElement(a.output, "u"), /(__)/gm);
                break;
            case"^^":
                a.subWikifyTerm(createTiddlyElement(a.output, "sup"), /(\^\^)/gm);
                break;
            case"~~":
                a.subWikifyTerm(createTiddlyElement(a.output, "sub"), /(~~)/gm);
                break;
            case"--":
                a.subWikifyTerm(createTiddlyElement(a.output, "strike"), /(--)/gm);
                break;
            case"{{{":
                var b = /\{\{\{((?:.|\n)*?)\}\}\}/gm;
                b.lastIndex = a.matchStart;
                var c = b.exec(a.source);
                c && c.index == a.matchStart && (createTiddlyElement(a.output, "code", null, null, c[1]), a.nextMatch = b.lastIndex)
        }
    }
}, {
    name: "customFormat", match: "@@|\\{\\{", handler: function (a) {
        switch (a.matchText) {
            case"@@":
                var b = createTiddlyElement(a.output, "span"), c = config.formatterHelpers.inlineCssHelper(a);
                0 == c.length ? b.className = "marked" : config.formatterHelpers.applyCssHelper(b, c), a.subWikifyTerm(b, /(@@)/gm);
                break;
            case"{{":
                var d = /\{\{[\s]*([\w]+[\s\w]*)[\s]*\{(\n?)/gm;
                d.lastIndex = a.matchStart;
                var e = d.exec(a.source);
                e && (a.nextMatch = d.lastIndex, b = createTiddlyElement(a.output, "\n" == e[2] ? "div" : "span", null, e[1]), a.subWikifyTerm(b, /(\}\}\})/gm))
        }
    }
}, {
    name: "mdash", match: "--", handler: function (a) {
        createTiddlyElement(a.output, "span").innerHTML = "&mdash;"
    }
}, {
    name: "lineBreak", match: "\\n|<br ?/?>", handler: function (a) {
        createTiddlyElement(a.output, "br")
    }
}, {
    name: "rawText",
    match: '"{3}|<nowiki>',
    lookaheadRegExp: /(?:\"{3}|<nowiki>)((?:.|\n)*?)(?:\"{3}|<\/nowiki>)/gm,
    handler: function (a) {
        this.lookaheadRegExp.lastIndex = a.matchStart;
        var b = this.lookaheadRegExp.exec(a.source);
        b && b.index == a.matchStart && (createTiddlyElement(a.output, "span", null, null, b[1]), a.nextMatch = this.lookaheadRegExp.lastIndex)
    }
}, {
    name: "htmlEntitiesEncoding",
    match: "(?:(?:&#?[a-zA-Z0-9]{2,8};|.)(?:&#?(?:x0*(?:3[0-6][0-9a-fA-F]|1D[c-fC-F][0-9a-fA-F]|20[d-fD-F][0-9a-fA-F]|FE2[0-9a-fA-F])|0*(?:76[89]|7[7-9][0-9]|8[0-7][0-9]|761[6-9]|76[2-7][0-9]|84[0-3][0-9]|844[0-7]|6505[6-9]|6506[0-9]|6507[0-1]));)+|&#?[a-zA-Z0-9]{2,8};)",
    handler: function (a) {
        createTiddlyElement(a.output, "span").innerHTML = a.matchText
    }
}], Wikifier.prototype.wikifyPlain = function () {
    var a = createTiddlyElement(document.body, "div");
    a.style.display = "none", this.subWikify(a);
    var b = jQuery(a).text();
    return jQuery(a).remove(), b
}, Wikifier.prototype.subWikify = function (a, b) {
    try {
        b ? this.subWikifyTerm(a, new RegExp("(" + b + ")", "mg")) : this.subWikifyUnterm(a)
    } catch (a) {
        showException(a)
    }
}, Wikifier.prototype.subWikifyUnterm = function (a) {
    var b = this.output;
    this.output = a, this.formatter.formatterRegExp.lastIndex = this.nextMatch;
    for (var c = this.formatter.formatterRegExp.exec(this.source); c;) {
        c.index > this.nextMatch && this.outputText(this.output, this.nextMatch, c.index), this.matchStart = c.index, this.matchLength = c[0].length, this.matchText = c[0], this.nextMatch = this.formatter.formatterRegExp.lastIndex;
        var d;
        for (d = 1; d < c.length; d++)if (c[d]) {
            this.formatter.formatters[d - 1].handler(this), this.formatter.formatterRegExp.lastIndex = this.nextMatch;
            break
        }
        c = this.formatter.formatterRegExp.exec(this.source)
    }
    this.nextMatch < this.source.length && (this.outputText(this.output, this.nextMatch, this.source.length), this.nextMatch = this.source.length), this.output = b
}, Wikifier.prototype.subWikifyTerm = function (a, b) {
    var c = this.output;
    this.output = a, b.lastIndex = this.nextMatch;
    var d = b.exec(this.source);
    this.formatter.formatterRegExp.lastIndex = this.nextMatch;
    for (var e = this.formatter.formatterRegExp.exec(d ? this.source.substr(0, d.index) : this.source); d || e;) {
        if (d && (!e || d.index <= e.index))return d.index > this.nextMatch && this.outputText(this.output, this.nextMatch, d.index), this.matchText = d[1], this.matchLength = d[1].length, this.matchStart = d.index, this.nextMatch = this.matchStart + this.matchLength, void(this.output = c);
        e.index > this.nextMatch && this.outputText(this.output, this.nextMatch, e.index), this.matchStart = e.index, this.matchLength = e[0].length, this.matchText = e[0], this.nextMatch = this.formatter.formatterRegExp.lastIndex;
        var f;
        for (f = 1; f < e.length; f++)if (e[f]) {
            this.formatter.formatters[f - 1].handler(this), this.formatter.formatterRegExp.lastIndex = this.nextMatch;
            break
        }
        b.lastIndex = this.nextMatch, d = b.exec(this.source), e = this.formatter.formatterRegExp.exec(d ? this.source.substr(0, d.index) : this.source)
    }
    this.nextMatch < this.source.length && (this.outputText(this.output, this.nextMatch, this.source.length), this.nextMatch = this.source.length), this.output = c
}, Wikifier.prototype.outputText = function (a, b, c) {
    for (; this.highlightMatch && this.highlightRegExp.lastIndex > b && this.highlightMatch.index < c && b < c;) {
        this.highlightMatch.index > b && (createTiddlyText(a, this.source.substring(b, this.highlightMatch.index)), b = this.highlightMatch.index);
        var d = Math.min(this.highlightRegExp.lastIndex, c);
        createTiddlyElement(a, "span", null, "highlight", this.source.substring(b, d)), b = d, b >= this.highlightRegExp.lastIndex && (this.highlightMatch = this.highlightRegExp.exec(this.source))
    }
    b < c && createTiddlyText(a, this.source.substring(b, c))
}, config.macros.version.handler = function (a) {
    jQuery("<span/>").text(formatVersion()).appendTo(a)
}, config.macros.today.handler = function (a, b, c) {
    var d = new Date, e = c[0] ? d.formatString(c[0].trim()) : d.toLocaleString();
    jQuery("<span/>").text(e).appendTo(a)
}, config.macros.list.template = "<<view title link>>", config.macros.list.handler = function (a, b, c, d, e) {
    var f = document.createElement("ul");
    jQuery(f).attr({refresh: "macro", macroName: b}).data("params", e), a.appendChild(f), this.refresh(f)
}, config.macros.list.refresh = function (a) {
    var b = jQuery(a).data("params"), c = b.readMacroParams(), d = b.parseParams("anon", null, null)[0], e = d.anon ? d.anon[0] : "all";
    jQuery(a).empty().addClass("list list-" + e);
    var f = !!d.template && store.getTiddlerText(d.template[0]);
    f || (f = config.macros.list.template), this[e].prompt && createTiddlyElement(a, "li", null, "listTitle", this[e].prompt);
    var g;
    this[e].handler && (g = this[e].handler(c));
    var h;
    for (h = 0; h < g.length; h++) {
        var i = document.createElement("li");
        a.appendChild(i);
        var j = g[h];
        "string" == typeof j && (j = store.getTiddler(j) || new Tiddler(j)), wikify(f, i, null, j)
    }
    0 === g.length && d.emptyMessage && (jQuery(a).addClass("emptyList"), jQuery("<li />").text(d.emptyMessage[0]).appendTo(a))
}, config.macros.list.all.handler = function (a) {
    return store.reverseLookup("tags", "excludeLists", !1, "title")
}, config.macros.list.missing.handler = function (a) {
    return store.getMissingLinks()
}, config.macros.list.orphans.handler = function (a) {
    return store.getOrphans()
}, config.macros.list.shadowed.handler = function (a) {
    return store.getShadowed()
}, config.macros.list.touched.handler = function (a) {
    return store.getTouched()
}, config.macros.list.filter.handler = function (a) {
    var b = a[1], c = [];
    if (b) {
        var e, d = store.filterTiddlers(b);
        for (e = 0; e < d.length; e++)c.push(d[e].title)
    }
    return c
}, config.macros.allTags.handler = function (a, b, c) {
    var d = store.getTags(c[0]), e = createTiddlyElement(a, "ul");
    0 == d.length && createTiddlyElement(e, "li", null, "listTitle", this.noTags);
    var f;
    for (f = 0; f < d.length; f++) {
        var g = d[f][0], h = getTiddlyLinkInfo(g), i = createTiddlyElement(e, "li"), j = createTiddlyButton(i, g + " (" + d[f][1] + ")", this.tooltip.format([g]), onClickTag, h.classes);
        j.setAttribute("tag", g), j.setAttribute("refresh", "link"), j.setAttribute("tiddlyLink", g), c[1] && j.setAttribute("sortby", c[1])
    }
};
var macro = config.macros.timeline;
merge(macro, {
    handler: function (a, b, c, d, e, f) {
        var g = jQuery("<div />").attr("params", e).attr("macroName", b).appendTo(a)[0];
        macro.refresh(g)
    }, refresh: function (a) {
        jQuery(a).attr("refresh", "macro").empty();
        var b = jQuery(a).attr("params"), c = b.parseParams("anon", null, null)[0], d = c.anon || [], e = d[0] || "modified", f = e.charAt(0), g = "-" === f || "+" === f ? e.substr(1, e.length) : e, h = d[2] || this.dateFormat, i = macro.groupTemplate.format(g, h);
        i = c.groupTemplate ? store.getTiddlerText(c.groupTemplate[0]) || i : i;
        var j = macro.itemTemplate;
        j = c.template ? store.getTiddlerText(c.template[0]) || j : j;
        var m, o, k = c.filter ? store.sortTiddlers(store.filterTiddlers(c.filter[0]), e) : store.reverseLookup("tags", "excludeLists", !1, e), l = "", n = d[1] ? k.length - Math.min(k.length, parseInt(d[1], 10)) : 0;
        for (o = k.length - 1; o >= n; o--) {
            var p = k[o], q = wikifyPlainText(i, 0, p);
            "undefined" != typeof m && q == l || (m = document.createElement("ul"), jQuery(m).addClass("timeline"), a.appendChild(m), createTiddlyElement(m, "li", null, "listTitle", q), l = q);
            var r = createTiddlyElement(m, "li", null, "listLink");
            wikify(j, r, null, p)
        }
    }, groupTemplate: "<<view %0 date '%1'>>", itemTemplate: "<<view title link>>"
}), config.macros.tiddler.handler = function (a, b, c, d, e, f) {
    var g = !0, h = config.macros.tiddler.tiddlerStack;
    if (h.length > 0 && "system" == config.evaluateMacroParameters) {
        var i = h[h.length - 1], j = i.indexOf(config.textPrimitives.sectionSeparator);
        j != -1 && (i = i.substr(0, j));
        var k = store.getTiddler(i);
        k && k.tags.indexOf("systemAllowEval") != -1 || (g = !1)
    }
    c = e.parseParams("name", null, g, !1, !0);
    var l = c[0].name, m = l[0], n = l[1] || null, o = c[0].with, p = createTiddlyElement(a, "span", null, n, null, {
        refresh: "content",
        tiddler: m
    });
    void 0 !== o && p.setAttribute("args", "[[" + o.join("]] [[") + "]]"), this.transclude(p, m, o)
}, config.macros.tiddler.transclude = function (a, b, c) {
    var d = store.getTiddlerText(b);
    if (d) {
        var e = config.macros.tiddler.tiddlerStack;
        if (e.indexOf(b) === -1) {
            e.push(b);
            try {
                "string" == typeof c && (c = c.readBracketedList());
                var g, f = c ? Math.min(c.length, 9) : 0;
                for (g = 0; g < f; g++) {
                    var h = new RegExp("\\$" + (g + 1), "mg");
                    d = d.replace(h, c[g])
                }
                config.macros.tiddler.renderText(a, d, b)
            } finally {
                e.pop()
            }
        }
    }
}, config.macros.tiddler.renderText = function (a, b, c) {
    wikify(b, a, null, store.getTiddler(c))
}, config.macros.tiddler.tiddlerStack = [], config.macros.tag.handler = function (a, b, c) {
    var d = createTagButton(a, c[0], null, c[1], c[2]);
    c[3] && d.setAttribute("sortby", c[3])
}, config.macros.tags.handler = function (a, b, c, d, e, f) {
    c = e.parseParams("anon", null, !0, !1, !1);
    var g = createTiddlyElement(a, "ul"), h = getParam(c, "anon", "");
    h && store.tiddlerExists(h) && (f = store.getTiddler(h));
    var l, i = getParam(c, "sep", " "), j = config.views.wikified.tag, k = null;
    for (l = 0; l < f.tags.length; l++) {
        var m = store.getTiddler(f.tags[l]);
        m && m.tags.contains("excludeLists") || (k || (k = createTiddlyElement(g, "li", null, "listTitle", j.labelTags.format([f.title]))), createTagButton(createTiddlyElement(g, "li"), f.tags[l], f.title), l < f.tags.length - 1 && createTiddlyText(g, i))
    }
    k || createTiddlyElement(g, "li", null, "listTitle", j.labelNoTags.format([f.title]))
}, config.macros.tagging.handler = function (a, b, c, d, e, f) {
    c = e.parseParams("anon", null, !0, !1, !1);
    var g = createTiddlyElement(a, "ul"), h = getParam(c, "anon", "");
    "" == h && f instanceof Tiddler && (h = f.title);
    var i = getParam(c, "sep", " ");
    g.setAttribute("title", this.tooltip.format([h]));
    var j = getParam(c, "sortBy", !1), k = store.getTaggedTiddlers(h, j), l = 0 == k.length ? this.labelNotTag : this.label;
    createTiddlyElement(g, "li", null, "tagging-listTitle", l.format([h, k.length]));
    var m;
    for (m = 0; m < k.length; m++)createTiddlyLink(createTiddlyElement(g, "li"), k[m].title, !0), m < k.length - 1 && createTiddlyText(g, i)
}, config.macros.closeAll.handler = function (a) {
    createTiddlyButton(a, this.label, this.prompt, this.onClick)
}, config.macros.closeAll.onClick = function (a) {
    return story.closeAllTiddlers(), !1
}, config.macros.permaview.handler = function (a) {
    createTiddlyButton(a, this.label, this.prompt, this.onClick)
}, config.macros.permaview.onClick = function (a) {
    return story.permaView(), !1
}, config.macros.saveChanges.handler = function (a, b, c) {
    readOnly || createTiddlyButton(a, c[0] || this.label, c[1] || this.prompt, this.onClick, null, null, this.accessKey)
}, config.macros.saveChanges.onClick = function (a) {
    return saveChanges(), !1
}, config.macros.slider.onClickSlider = function (a) {
    var b = this.nextSibling, c = b.getAttribute("cookie"), d = "none" != b.style.display;
    return config.options.chkAnimate && anim && "function" == typeof Slider ? anim.startAnimating(new Slider(b, !d, null, "none")) : b.style.display = d ? "none" : "block", config.options[c] = !d, saveOption(c), !1
}, config.macros.slider.createSlider = function (a, b, c, d) {
    var e = b || "";
    createTiddlyButton(a, c, d, this.onClickSlider);
    var f = createTiddlyElement(null, "div", null, "sliderPanel");
    return f.setAttribute("cookie", e), f.style.display = config.options[e] ? "block" : "none", a.appendChild(f), f
}, config.macros.slider.handler = function (a, b, c) {
    var d = this.createSlider(a, c[0], c[2], c[3]), e = store.getTiddlerText(c[1]);
    d.setAttribute("refresh", "content"), d.setAttribute("tiddler", c[1]), e && wikify(e, d, null, store.getTiddler(c[1]))
}, config.macros.gradient.handler = function (a, b, c, d, e, f) {
    var g = d ? createTiddlyElement(a, "div", null, "gradient") : a;
    if (g.style.position = "relative", g.style.overflow = "hidden", g.style.zIndex = "0", d) {
        var h = config.formatterHelpers.inlineCssHelper(d);
        config.formatterHelpers.applyCssHelper(g, h)
    }
    c = e.parseParams("color");
    var k, i = [], j = [];
    for (k = 2; k < c.length; k++) {
        var l = c[k].value;
        "snap" == c[k].name ? j[j.length - 1] = l : (i.push(l), j.push(l))
    }
    drawGradient(g, "vert" != c[1].value, i, j), d && d.subWikify(g, ">>"), document.all && (g.style.height = "100%", g.style.width = "100%")
}, config.macros.message.handler = function (a, b, c) {
    if (c[0]) {
        var d = c[0].split("."), e = function (a, b) {
            return a[d[b]] ? b < d.length - 1 ? e(a[d[b]], b + 1) : a[d[b]] : null
        }, f = e(config, 0);
        null == f && (f = e(window, 0)), createTiddlyText(a, f.toString().format(c.splice(1)))
    }
}, config.macros.view.depth = 0, config.macros.view.values = [], config.macros.view.views = {
    text: function (a, b, c, d, e, f) {
        highlightify(a, b, highlightHack, f)
    }, link: function (a, b, c, d, e, f) {
        createTiddlyLink(b, a, !0)
    }, wikified: function (a, b, c, d, e, f) {
        config.macros.view.depth > 50 || config.macros.view.depth > 0 && a == config.macros.view.values[config.macros.view.depth - 1] || (config.macros.view.values[config.macros.view.depth] = a, config.macros.view.depth++, c[2] && (a = c[2].unescapeLineBreaks().format([a])), wikify(a, b, highlightHack, f), config.macros.view.depth--, config.macros.view.values[config.macros.view.depth] = null)
    }, date: function (a, b, c, d, e, f) {
        a = Date.convertFromYYYYMMDDHHMM(a), createTiddlyText(b, a.formatString(c[2] || config.views.wikified.dateFormat))
    }
}, config.macros.view.handler = function (a, b, c, d, e, f) {
    if (f instanceof Tiddler && c[0]) {
        var g = store.getValue(f, c[0]);
        if (g) {
            var h = c[1] || config.macros.view.defaultView, i = config.macros.view.views[h];
            i && i(g, a, c, d, e, f)
        }
    }
}, config.macros.edit.handler = function (a, b, c, d, e, f) {
    var g = c[0], h = c[1] || 0, i = c[2] || "";
    if (f instanceof Tiddler && g) {
        story.setDirty(f.title, !0);
        var j, k;
        if ("text" == g || h) {
            var l = createTiddlyElement(null, "fieldset", null, "fieldsetFix"), m = createTiddlyElement(l, "div");
            j = createTiddlyElement(m, "textarea"), j.value = k = store.getValue(f, g) || i, h = h || 20;
            var n = k.match(/\n/gm), o = Math.max(parseInt(config.options.txtMaxEditRows, 10), 5);
            null != n && n.length > h && (h = n.length + 5), h = Math.min(h, o), j.setAttribute("rows", h), j.setAttribute("edit", g), a.appendChild(l)
        } else j = createTiddlyElement(null, "input", null, null, null, {
            type: "text",
            edit: g,
            size: "40",
            autocomplete: "off"
        }), j.value = store.getValue(f, g) || i, a.appendChild(j);
        return f.isReadOnly() && (j.setAttribute("readOnly", "readOnly"), jQuery(j).addClass("readOnly")), j
    }
}, config.macros.tagChooser.onClick = function (a) {
    var b = a || window.event, c = config.views.editor.tagChooser, d = Popup.create(this), e = store.getTags(this.getAttribute("tags"));
    0 == e.length && jQuery("<li/>").text(c.popupNone).appendTo(d);
    var f;
    for (f = 0; f < e.length; f++) {
        var g = createTiddlyButton(createTiddlyElement(d, "li"), e[f][0], c.tagTooltip.format([e[f][0]]), config.macros.tagChooser.onTagClick);
        g.setAttribute("tag", e[f][0]), g.setAttribute("tiddler", this.getAttribute("tiddler"))
    }
    return Popup.show(), b.cancelBubble = !0, b.stopPropagation && b.stopPropagation(), !1
}, config.macros.tagChooser.onTagClick = function (a) {
    var b = a || window.event;
    (b.metaKey || b.ctrlKey) && stopEvent(b);
    var c = this.getAttribute("tag"), d = this.getAttribute("tiddler");
    return readOnly || story.setTiddlerTag(d, c, 0), !1
}, config.macros.tagChooser.handler = function (a, b, c, d, e, f) {
    if (f instanceof Tiddler) {
        var g = config.views.editor.tagChooser, h = createTiddlyButton(a, g.text, g.tooltip, this.onClick);
        h.setAttribute("tiddler", f.title), h.setAttribute("tags", c[0])
    }
}, config.macros.refreshDisplay.handler = function (a) {
    createTiddlyButton(a, this.label, this.prompt, this.onClick)
}, config.macros.refreshDisplay.onClick = function (a) {
    return refreshAll(), !1
}, config.macros.annotations.handler = function (a, b, c, d, e, f) {
    var g = f ? f.title : null, h = g ? config.annotations[g] : null;
    if (f && g && h) {
        var i = h.format([g]);
        wikify(i, createTiddlyElement(a, "div", null, "annotation"), null, f);
    }
}, config.macros.newTiddler.createNewTiddlerButton = function (a, b, c, d, e, f, g, h) {
    var j, i = [];
    for (j = 1; j < c.length; j++)("anon" == c[j].name && 1 != j || "tag" == c[j].name) && i.push(c[j].value);
    d = getParam(c, "label", d), e = getParam(c, "prompt", e), f = getParam(c, "accessKey", f), g = getParam(c, "focus", g);
    var k = getParam(c, "fields", "");
    k || store.isShadowTiddler(b) || (k = String.encodeHashMap(config.defaultCustomFields));
    var l = createTiddlyButton(a, d, e, this.onClickNewTiddler, null, null, f);
    l.setAttribute("newTitle", b), l.setAttribute("isJournal", h ? "true" : "false"), i.length > 0 && l.setAttribute("params", i.join("|")), l.setAttribute("newFocus", g), l.setAttribute("newTemplate", getParam(c, "template", DEFAULT_EDIT_TEMPLATE)), "" !== k && l.setAttribute("customFields", k);
    var m = getParam(c, "text");
    return void 0 !== m && l.setAttribute("newText", m), l
}, config.macros.newTiddler.onClickNewTiddler = function () {
    var a = this.getAttribute("newTitle");
    "true" == this.getAttribute("isJournal") && (a = (new Date).formatString(a.trim()));
    var b = this.getAttribute("params"), c = b ? b.split("|") : [], d = this.getAttribute("newFocus"), e = this.getAttribute("newTemplate"), f = this.getAttribute("customFields");
    f || store.isShadowTiddler(a) || (f = String.encodeHashMap(config.defaultCustomFields)), story.displayTiddler(null, a, e, !1, null, null);
    var g = story.getTiddler(a);
    f && story.addCustomFields(g, f);
    var h = this.getAttribute("newText");
    "string" == typeof h && story.getTiddlerField(a, "text") && (story.getTiddlerField(a, "text").value = h.format([a]));
    var i;
    for (i = 0; i < c.length; i++)story.setTiddlerTag(a, c[i], 1);
    return story.focusTiddler(a, d), !1
}, config.macros.newTiddler.handler = function (a, b, c, d, e) {
    if (!readOnly) {
        c = e.parseParams("anon", null, !0, !1, !1);
        var f = c[1] && "anon" == c[1].name ? c[1].value : this.title;
        f = getParam(c, "title", f), this.createNewTiddlerButton(a, f, c, this.label, this.prompt, this.accessKey, "title", !1)
    }
}, config.macros.newJournal.handler = function (a, b, c, d, e) {
    if (!readOnly) {
        c = e.parseParams("anon", null, !0, !1, !1);
        var f = c[1] && "anon" == c[1].name ? c[1].value : config.macros.timeline.dateFormat;
        f = getParam(c, "title", f), config.macros.newTiddler.createNewTiddlerButton(a, f, c, this.label, this.prompt, this.accessKey, "text", !0)
    }
}, config.macros.search.handler = function (a, b, c, d, e, f) {
    c = e.parseParams("anon", null, !1, !1, !1), createTiddlyButton(a, this.label, this.prompt, this.onClick, "searchButton");
    var g = createTiddlyElement(null, "input", null, "txtOptionInput searchField");
    g.value = getParam(c, "anon", ""), config.browser.isSafari ? (g.setAttribute("type", "search"), g.setAttribute("results", "5")) : g.setAttribute("type", "text"), a.appendChild(g), g.onkeyup = this.onKeyPress, g.onfocus = this.onFocus, g.setAttribute("size", this.sizeTextbox), g.setAttribute("accessKey", getParam(c, "accesskey", this.accessKey)), g.setAttribute("autocomplete", "off"), g.setAttribute("lastSearchText", ""), g.setAttribute("placeholder", getParam(c, "placeholder", this.placeholder))
}, config.macros.search.timeout = null, config.macros.search.doSearch = function (a) {
    a.value.length > 0 && (story.search(a.value, config.options.chkCaseSensitiveSearch, config.options.chkRegExpSearch), a.setAttribute("lastSearchText", a.value))
}, config.macros.search.onClick = function (a) {
    return config.macros.search.doSearch(this.nextSibling), !1
}, config.macros.search.onKeyPress = function (a) {
    var b = config.macros.search, c = a || window.event;
    switch (c.keyCode) {
        case 9:
            return;
        case 13:
        case 10:
            b.doSearch(this);
            break;
        case 27:
            this.value = "", clearMessage()
    }
    if (config.options.chkIncrementalSearch)if (this.value.length > 2) {
        if (this.value != this.getAttribute("lastSearchText")) {
            b.timeout && clearTimeout(b.timeout);
            var d = this;
            b.timeout = setTimeout(function () {
                b.doSearch(d)
            }, 500)
        }
    } else b.timeout && clearTimeout(b.timeout)
}, config.macros.search.onFocus = function (a) {
    this.select()
}, config.macros.tabs.handler = function (a, b, c) {
    var d = c[0], e = (c.length - 1) / 3, f = createTiddlyElement(null, "div", null, "tabsetWrapper " + d), g = createTiddlyElement(f, "div", null, "tabset");
    g.setAttribute("cookie", d);
    var i, h = !1;
    for (i = 0; i < e; i++) {
        var j = c[3 * i + 1], k = c[3 * i + 2], l = c[3 * i + 3], m = createTiddlyButton(g, j, k, this.onClickTab, "tab tabUnselected");
        createTiddlyElement(m, "span", null, null, " ", {style: "font-size:0pt;line-height:0px"}), m.setAttribute("tab", j), m.setAttribute("content", l), m.title = k, config.options[d] == j && (h = !0)
    }
    h || (config.options[d] = c[1]), a.appendChild(f), this.switchTab(g, config.options[d])
}, config.macros.tabs.onClickTab = function (a) {
    return config.macros.tabs.switchTab(this.parentNode, this.getAttribute("tab")), !1
}, config.macros.tabs.switchTab = function (a, b) {
    var f, c = a.getAttribute("cookie"), d = null, e = a.childNodes;
    for (f = 0; f < e.length; f++)e[f].getAttribute && e[f].getAttribute("tab") == b ? (d = e[f], d.className = "tab tabSelected") : e[f].className = "tab tabUnselected";
    if (d) {
        a.nextSibling && "tabContents" == a.nextSibling.className && jQuery(a.nextSibling).remove();
        var g = createTiddlyElement(null, "div", null, "tabContents");
        a.parentNode.insertBefore(g, a.nextSibling);
        var h = d.getAttribute("content");
        wikify(store.getTiddlerText(h), g, null, store.getTiddler(h)), c && (config.options[c] = b, saveOption(c))
    }
}, config.macros.toolbar.createCommand = function (a, b, c, d) {
    if ("string" != typeof b) {
        var f, e = null;
        for (f in config.commands)config.commands[f] == b && (e = f);
        b = e
    }
    if (c instanceof Tiddler && "string" == typeof b) {
        var g = config.commands[b];
        if (g.isEnabled ? g.isEnabled(c) : this.isCommandEnabled(g, c)) {
            var h = g.getText ? g.getText(c) : this.getCommandText(g, c), i = g.getTooltip ? g.getTooltip(c) : this.getCommandTooltip(g, c), j = "popup" == g.type ? this.onClickPopup : this.onClickCommand, k = createTiddlyButton(null, h, i, j);
            k.setAttribute("commandName", b), k.setAttribute("tiddler", c.title), jQuery(k).addClass("command_" + b), d && jQuery(k).addClass(d), a.appendChild(k)
        }
    }
}, config.macros.toolbar.isCommandEnabled = function (a, b) {
    var c = b.title, d = b.isReadOnly(), e = store.isShadowTiddler(c) && !store.tiddlerExists(c);
    return (!d || d && !a.hideReadOnly) && !(e && a.hideShadow)
}, config.macros.toolbar.getCommandText = function (a, b) {
    return b.isReadOnly() && a.readOnlyText || a.text
}, config.macros.toolbar.getCommandTooltip = function (a, b) {
    return b.isReadOnly() && a.readOnlyTooltip || a.tooltip
}, config.macros.toolbar.onClickCommand = function (a) {
    var b = a || window.event;
    b.cancelBubble = !0, b.stopPropagation && b.stopPropagation();
    var c = config.commands[this.getAttribute("commandName")];
    return c.handler(b, this, this.getAttribute("tiddler"))
}, config.macros.toolbar.onClickPopup = function (a) {
    var b = a || window.event;
    b.cancelBubble = !0, b.stopPropagation && b.stopPropagation();
    var c = Popup.create(this), d = config.commands[this.getAttribute("commandName")], e = this.getAttribute("tiddler");
    return c.setAttribute("tiddler", e), d.handlePopup(c, e), Popup.show(), !1
}, config.macros.toolbar.invokeCommand = function (a, b, c) {
    var e, d = a.getElementsByTagName("a");
    for (e = 0; e < d.length; e++) {
        var f = d[e];
        if (jQuery(f).hasClass(b) && f.getAttribute && f.getAttribute("commandName")) {
            f.onclick instanceof Function && f.onclick.call(f, c);
            break
        }
    }
}, config.macros.toolbar.onClickMore = function (a) {
    var b = this.nextSibling;
    return b.style.display = "inline", this.style.display = "none", !1
}, config.macros.toolbar.onClickLess = function (a) {
    var b = this.parentNode, c = b.previousSibling;
    return b.style.display = "none", c.style.display = "inline", !1
}, config.macros.toolbar.handler = function (a, b, c, d, e, f) {
    var g;
    for (g = 0; g < c.length; g++) {
        var h, i = c[g];
        switch (i) {
            case"!":
                createTiddlyText(a, this.separator);
                break;
            case"*":
                createTiddlyElement(a, "br");
                break;
            case"<":
                h = createTiddlyButton(a, this.lessLabel, this.lessPrompt, config.macros.toolbar.onClickLess), jQuery(h).addClass("lessCommand");
                break;
            case">":
                h = createTiddlyButton(a, this.moreLabel, this.morePrompt, config.macros.toolbar.onClickMore), jQuery(h).addClass("moreCommand");
                var j = createTiddlyElement(a, "span", null, "moreCommand");
                j.style.display = "none", a = j;
                break;
            default:
                var k = "";
                switch (i.substr(0, 1)) {
                    case"+":
                        k = "defaultCommand", i = i.substr(1);
                        break;
                    case"-":
                        k = "cancelCommand", i = i.substr(1)
                }
                config.commands[i] ? this.createCommand(a, i, f, k) : this.customCommand(a, i, d, f)
        }
    }
}, config.macros.toolbar.customCommand = function (a, b, c, d) {
}, config.commands.closeTiddler.handler = function (a, b, c) {
    return !(story.isDirty(c) && !readOnly && !confirm(config.commands.cancelTiddler.warning.format([c]))) && (story.setDirty(c, !1), story.closeTiddler(c, !0), !1)
}, config.commands.closeOthers.handler = function (a, b, c) {
    return story.closeAllTiddlers(c), !1
}, config.commands.editTiddler.handler = function (a, b, c) {
    clearMessage();
    var d = story.getTiddler(c), e = d.getAttribute("tiddlyFields");
    story.displayTiddler(null, c, DEFAULT_EDIT_TEMPLATE, !1, null, e);
    var f = story.getTiddlerField(c, config.options.txtEditorFocus || "text");
    return f && setCaretPosition(f, 0), !1
}, config.commands.saveTiddler.handler = function (a, b, c) {
    var d = story.saveTiddler(c, a.shiftKey);
    return d && story.displayTiddler(null, d), !1
}, config.commands.cancelTiddler.handler = function (a, b, c) {
    return !(story.hasChanges(c) && !readOnly && !confirm(this.warning.format([c]))) && (story.setDirty(c, !1), story.displayTiddler(null, c), !1)
}, config.commands.deleteTiddler.handler = function (a, b, c) {
    var d = !0;
    return config.options.chkConfirmDelete && (d = confirm(this.warning.format([c]))), d && (store.removeTiddler(c), story.closeTiddler(c, !0), autoSaveChanges()), !1
}, config.commands.permalink.handler = function (a, b, c) {
    var d = encodeURIComponent(String.encodeTiddlyLink(c));
    return window.location.hash != d && (window.location.hash = d), !1
}, config.commands.references.handlePopup = function (a, b) {
    var e, c = store.getReferringTiddlers(b), d = !1;
    for (e = 0; e < c.length; e++)c[e].title == b || c[e].isTagged("excludeLists") || (createTiddlyLink(createTiddlyElement(a, "li"), c[e].title, !0), d = !0);
    d || createTiddlyElement(a, "li", null, "disabled", this.popupNone)
}, config.commands.jump.handlePopup = function (a, b) {
    story.forEachTiddler(function (b, c) {
        createTiddlyLink(createTiddlyElement(a, "li"), b, !0, null, !1, null, !0)
    })
}, config.commands.fields.handlePopup = function (a, b) {
    var c = store.fetchTiddler(b);
    if (c) {
        var d = [];
        store.forEachField(c, function (a, b, c) {
            d.push({field: b, value: c})
        }, !0), d.sort(function (a, b) {
            return a.field < b.field ? -1 : a.field == b.field ? 0 : 1
        }), d.length > 0 ? ListView.create(a, d, this.listViewTemplate) : createTiddlyElement(a, "div", null, null, this.emptyText)
    }
}, Tiddler.prototype.getLinks = function () {
    return 0 == this.linksUpdated && this.changed(), this.links
}, Tiddler.prototype.getInheritedFields = function () {
    var b, a = {};
    for (b in this.fields)"server.host" != b && "server.workspace" != b && "wikiformat" != b && "server.type" != b || (a[b] = this.fields[b]);
    return String.encodeHashMap(a)
}, Tiddler.prototype.incChangeCount = function () {
    var a = this.fields.changecount;
    a = a ? parseInt(a, 10) : 0, this.fields.changecount = String(a + 1)
}, Tiddler.prototype.clearChangeCount = function () {
    this.fields.changecount && delete this.fields.changecount
}, Tiddler.prototype.doNotSave = function () {
    return this.fields.doNotSave
}, Tiddler.prototype.isTouched = function () {
    var a = this.fields.changecount || 0;
    return a > 0
}, Tiddler.prototype.set = function (a, b, c, d, e, f, g, h) {
    return this.assign(a, b, c, d, e, f, g, h), this.changed(), this
}, Tiddler.prototype.assign = function (a, b, c, d, e, f, g, h) {
    return void 0 != a && (this.title = a), void 0 != b && (this.text = b), void 0 != c && (this.modifier = c), void 0 != d && (this.modified = d), void 0 != h && (this.creator = h), void 0 != f && (this.created = f), void 0 != g && (this.fields = g), void 0 != e ? this.tags = "string" == typeof e ? e.readBracketedList() : e : void 0 == this.tags && (this.tags = []), this
}, Tiddler.prototype.getTags = function () {
    return String.encodeTiddlyLinkList(this.tags)
}, Tiddler.prototype.isTagged = function (a) {
    return this.tags.indexOf(a) != -1
}, Tiddler.unescapeLineBreaks = function (a) {
    return a ? a.unescapeLineBreaks() : ""
}, Tiddler.prototype.escapeLineBreaks = function () {
    return this.text.escapeLineBreaks()
}, Tiddler.prototype.changed = function () {
    this.links = [];
    var a = this.text;
    a = a.replace(/\/%((?:.|\n)*?)%\//g, "").replace(/\{{3}((?:.|\n)*?)\}{3}/g, "").replace(/"""((?:.|\n)*?)"""/g, "").replace(/<nowiki\>((?:.|\n)*?)<\/nowiki\>/g, "").replace(/<html\>((?:.|\n)*?)<\/html\>/g, "").replace(/<script((?:.|\n)*?)<\/script\>/g, "");
    var b = this.autoLinkWikiWords() ? 0 : 1, c = 0 == b ? config.textPrimitives.tiddlerAnyLinkRegExp : config.textPrimitives.tiddlerForcedLinkRegExp;
    c.lastIndex = 0;
    for (var d = c.exec(a); d;) {
        var e = c.lastIndex;
        if (0 == b && d[1] && d[1] != this.title)if (d.index > 0) {
            var f = new RegExp(config.textPrimitives.unWikiLink + "|" + config.textPrimitives.anyLetter, "mg");
            f.lastIndex = d.index - 1;
            var g = f.exec(a);
            g.index != d.index - 1 && this.links.pushUnique(d[1])
        } else this.links.pushUnique(d[1]); else d[2 - b] && !config.formatterHelpers.isExternalLink(d[3 - b]) ? this.links.pushUnique(d[3 - b]) : d[4 - b] && d[4 - b] != this.title && this.links.pushUnique(d[4 - b]);
        c.lastIndex = e, d = c.exec(a)
    }
    this.linksUpdated = !0
}, Tiddler.prototype.getSubtitle = function () {
    var a = this.modifier;
    a || (a = config.messages.subtitleUnknown || "");
    var b = this.modified;
    b = b ? b.toLocaleString() : config.messages.subtitleUnknown || "";
    var c = config.messages.tiddlerLinkTooltip || "%0 - %1, %2";
    return c.format([this.title, a, b])
}, Tiddler.prototype.isReadOnly = function () {
    return readOnly
}, Tiddler.prototype.autoLinkWikiWords = function () {
    return !(this.isTagged("systemConfig") || this.isTagged("excludeMissing"))
}, Tiddler.prototype.getServerType = function () {
    var a = null;
    return this.fields["server.type"] && (a = this.fields["server.type"]), a || (a = this.fields.wikiformat), a && !config.adaptors[a] && (a = null), a
}, Tiddler.prototype.getAdaptor = function () {
    var a = this.getServerType();
    return a ? new config.adaptors[a] : null
}, TiddlyWiki.prototype.setDirty = function (a) {
    this.dirty = a
}, TiddlyWiki.prototype.isDirty = function () {
    return this.dirty
}, TiddlyWiki.prototype.tiddlerExists = function (a) {
    var b = this.fetchTiddler(a);
    return void 0 != b
}, TiddlyWiki.prototype.isShadowTiddler = function (a) {
    return void 0 !== config.shadowTiddlers[a]
}, TiddlyWiki.prototype.isAvailable = function (a) {
    if (!a)return !1;
    var b = a ? a.indexOf(config.textPrimitives.sectionSeparator) : -1;
    return b != -1 && (a = a.substr(0, b)), this.tiddlerExists(a) || this.isShadowTiddler(a)
}, TiddlyWiki.prototype.createTiddler = function (a) {
    var b = this.fetchTiddler(a);
    return b || (b = new Tiddler(a), this.addTiddler(b), this.setDirty(!0)), b
}, TiddlyWiki.prototype.getTiddler = function (a) {
    var b = this.fetchTiddler(a);
    return void 0 != b ? b : null
}, TiddlyWiki.prototype.getShadowTiddlerText = function (a) {
    return "string" == typeof config.shadowTiddlers[a] ? config.shadowTiddlers[a] : ""
}, TiddlyWiki.prototype.getTiddlerText = function (a, b) {
    if (!a)return b;
    var c = a.indexOf(config.textPrimitives.sectionSeparator), d = null;
    if (c != -1 && (d = a.substr(c + config.textPrimitives.sectionSeparator.length), a = a.substr(0, c)), c = a.indexOf(config.textPrimitives.sliceSeparator), c != -1) {
        var e = this.getTiddlerSlice(a.substr(0, c), a.substr(c + config.textPrimitives.sliceSeparator.length));
        if (e)return e
    }
    var f = this.fetchTiddler(a), g = f ? f.text : null;
    if (!f && this.isShadowTiddler(a) && (g = this.getShadowTiddlerText(a)), g) {
        if (!d)return g;
        var h = new RegExp("(^!{1,6}[ \t]*" + d.escapeRegExp() + "[ \t]*\n)", "mg");
        h.lastIndex = 0;
        var i = h.exec(g);
        if (i) {
            var j = g.substr(i.index + i[1].length), k = /^!/gm;
            return k.lastIndex = 0, i = k.exec(j), i && (j = j.substr(0, i.index - 1)), j
        }
        return b
    }
    return void 0 != b ? b : null
}, TiddlyWiki.prototype.getRecursiveTiddlerText = function (a, b, c) {
    var d = new RegExp("(?:\\[\\[([^\\]]+)\\]\\])", "mg"), e = this.getTiddlerText(a, null);
    if (null == e)return b;
    var g, f = [], h = 0;
    do g = d.exec(e), g ? (f.push(e.substr(h, g.index - h)), g[1] && (c <= 0 ? f.push(g[1]) : f.push(this.getRecursiveTiddlerText(g[1], "", c - 1))), h = g.index + g[0].length) : f.push(e.substr(h)); while (g);
    return f.join("")
}, TiddlyWiki.prototype.slicesRE = /(?:^([\'\/]{0,2})~?([\.\w]+)\:\1[\t\x20]*([^\n]*)[\t\x20]*$)|(?:^\|([\'\/]{0,2})~?([\.\w]+)\:?\4\|[\t\x20]*([^\|\n]*)[\t\x20]*\|$)/gm, TiddlyWiki.prototype.calcAllSlices = function (a) {
    var b = {}, c = this.getTiddlerText(a, "");
    this.slicesRE.lastIndex = 0;
    for (var d = this.slicesRE.exec(c); d;)d[2] ? b[d[2]] = d[3] : b[d[5]] = d[6], d = this.slicesRE.exec(c);
    return b
}, TiddlyWiki.prototype.getTiddlerSlice = function (a, b) {
    var c = this.slices[a];
    return c || (c = this.calcAllSlices(a), this.slices[a] = c), c[b]
}, TiddlyWiki.prototype.getTiddlerSlices = function (a, b) {
    var c, d = {};
    for (c = 0; c < b.length; c++) {
        var e = this.getTiddlerSlice(a, b[c]);
        e && (d[b[c]] = e)
    }
    return d
}, TiddlyWiki.prototype.suspendNotifications = function () {
    this.notificationLevel--
}, TiddlyWiki.prototype.resumeNotifications = function () {
    this.notificationLevel++
}, TiddlyWiki.prototype.notify = function (a, b) {
    if (!this.notificationLevel) {
        var c;
        for (c = 0; c < this.namedNotifications.length; c++) {
            var d = this.namedNotifications[c];
            (null == d.name && b || d.name == a) && d.notify(a)
        }
    }
}, TiddlyWiki.prototype.notifyAll = function () {
    if (!this.notificationLevel) {
        var a;
        for (a = 0; a < this.namedNotifications.length; a++) {
            var b = this.namedNotifications[a];
            b.name && b.notify(b.name)
        }
    }
}, TiddlyWiki.prototype.addNotification = function (a, b) {
    var c;
    for (c = 0; c < this.namedNotifications.length; c++)if (this.namedNotifications[c].name == a && this.namedNotifications[c].notify == b)return this;
    return this.namedNotifications.push({name: a, notify: b}), this
},TiddlyWiki.prototype.removeTiddler = function (a) {
    var b = this.fetchTiddler(a);
    b && (this.deleteTiddler(a), this.notify(a, !0), this.setDirty(!0))
},TiddlyWiki.prototype.resetTiddler = function (a) {
    var b = this.fetchTiddler(a);
    b && (b.clearChangeCount(), this.notify(a, !0), this.setDirty(!0))
},TiddlyWiki.prototype.setTiddlerTag = function (a, b, c) {
    var d = this.fetchTiddler(a);
    if (d) {
        var e = d.tags.indexOf(c);
        e != -1 && d.tags.splice(e, 1), b && d.tags.push(c), d.changed(), d.incChangeCount(), this.notify(a, !0), this.setDirty(!0)
    }
},TiddlyWiki.prototype.addTiddlerFields = function (a, b) {
    var c = this.fetchTiddler(a);
    c && (merge(c.fields, b), c.changed(), c.incChangeCount(), this.notify(a, !0), this.setDirty(!0))
},TiddlyWiki.prototype.saveTiddler = function (a, b, c, d, e, f, g, h, i, j) {
    var k;
    return a instanceof Tiddler ? (k = a, k.fields = merge(merge({}, k.fields), config.defaultCustomFields, !0), a = k.title, b = a) : (k = this.fetchTiddler(a), k ? (i = i || k.created, j = j || k.creator, this.deleteTiddler(a)) : (i = i || e, k = new Tiddler), g = merge(merge({}, g), config.defaultCustomFields, !0), k.set(b, c, d, e, f, i, g, j)), this.addTiddler(k), h ? k.clearChangeCount() : k.incChangeCount(), a != b && this.notify(a, !0), this.notify(b, !0), this.setDirty(!0), k
},TiddlyWiki.prototype.incChangeCount = function (a) {
    var b = this.fetchTiddler(a);
    b && b.incChangeCount()
},TiddlyWiki.prototype.getLoader = function () {
    return this.loader || (this.loader = new TW21Loader), this.loader
},TiddlyWiki.prototype.getSaver = function () {
    return this.saver || (this.saver = new TW21Saver), this.saver
},TiddlyWiki.prototype.allTiddlersAsHtml = function () {
    return this.getSaver().externalize(store)
},TiddlyWiki.prototype.loadFromDiv = function (a, b, c) {
    this.idPrefix = b;
    var d = "string" == typeof a ? document.getElementById(a) : a;
    if (d) {
        var e = this.getLoader().loadTiddlers(this, d.childNodes);
        if (this.setDirty(!1), !c) {
            var f;
            for (f = 0; f < e.length; f++)e[f].changed()
        }
        jQuery(document).trigger("loadTiddlers")
    }
},TiddlyWiki.prototype.importTiddlyWiki = function (a) {
    var b = locateStoreArea(a);
    if (!b)return null;
    var c = "<html><body>" + a.substring(b[0], b[1] + endSaveArea.length) + "</body></html>", d = document.createElement("iframe");
    d.style.display = "none", document.body.appendChild(d);
    var e = d.document;
    d.contentDocument ? e = d.contentDocument : d.contentWindow && (e = d.contentWindow.document), e.open(), e.writeln(c), e.close();
    var f = e.getElementById("storeArea");
    return this.loadFromDiv(f, "store"), d.parentNode.removeChild(d), this
},TiddlyWiki.prototype.updateTiddlers = function () {
    this.tiddlersUpdated = !0, this.forEachTiddler(function (a, b) {
        b.changed()
    })
},TiddlyWiki.prototype.search = function (a, b, c, d) {
    var f, e = this.reverseLookup("tags", c, !!d), g = [];
    for (f = 0; f < e.length; f++)e[f].title.search(a) == -1 && e[f].text.search(a) == -1 || g.push(e[f]);
    return b || (b = "title"), g.sort(function (a, c) {
        return a[b] < c[b] ? -1 : a[b] == c[b] ? 0 : 1
    }), g
},TiddlyWiki.prototype.getTags = function (a) {
    var b = [];
    return this.forEachTiddler(function (c, d) {
        var e, f;
        for (e = 0; e < d.tags.length; e++) {
            var g = d.tags[e], h = !0;
            for (f = 0; f < b.length; f++)b[f][0] == g && (h = !1, b[f][1]++);
            if (h && a) {
                var i = this.fetchTiddler(g);
                i && i.isTagged(a) && (h = !1)
            }
            h && b.push([g, 1])
        }
    }), b.sort(function (a, b) {
        return a[0].toLowerCase() < b[0].toLowerCase() ? -1 : a[0].toLowerCase() == b[0].toLowerCase() ? 0 : 1
    }), b
},TiddlyWiki.prototype.getTaggedTiddlers = function (a, b) {
    return this.reverseLookup("tags", a, !0, b)
},TiddlyWiki.prototype.getValueTiddlers = function (a, b, c) {
    return this.reverseLookup(a, b, !0, c)
},TiddlyWiki.prototype.getReferringTiddlers = function (a, b, c) {
    return this.tiddlersUpdated || this.updateTiddlers(), this.reverseLookup("links", a, !0, c)
},TiddlyWiki.prototype.reverseLookup = function (a, b, c, d) {
    var e = [];
    return this.forEachTiddler(function (d, f) {
        var h, g = !c;
        if (["links", "tags"].contains(a))h = f[a]; else {
            var i = TiddlyWiki.standardFieldAccess[a];
            h = i ? [i.get(f)] : f.fields[a] ? [f.fields[a]] : []
        }
        var j;
        for (j = 0; j < h.length; j++)h[j] == b && (g = c);
        g && e.push(f)
    }), d || (d = "title"), this.sortTiddlers(e, d)
},TiddlyWiki.prototype.getTiddlers = function (a, b) {
    var c = [];
    return this.forEachTiddler(function (a, d) {
        void 0 != b && d.isTagged(b) || c.push(d)
    }), a && c.sort(function (b, c) {
        return b[a] < c[a] ? -1 : b[a] == c[a] ? 0 : 1
    }), c
},TiddlyWiki.prototype.getMissingLinks = function () {
    this.tiddlersUpdated || this.updateTiddlers();
    var a = [];
    return this.forEachTiddler(function (b, c) {
        if (!c.isTagged("excludeMissing") && !c.isTagged("systemConfig")) {
            var d;
            for (d = 0; d < c.links.length; d++) {
                var e = c.links[d];
                null != this.getTiddlerText(e, null) || this.isShadowTiddler(e) || config.macros[e] || a.pushUnique(e)
            }
        }
    }), a.sort(), a
},TiddlyWiki.prototype.getOrphans = function () {
    var a = [];
    return this.forEachTiddler(function (b, c) {
        0 != this.getReferringTiddlers(b).length || c.isTagged("excludeLists") || a.push(b)
    }), a.sort(), a
},TiddlyWiki.prototype.getShadowed = function () {
    var a, b = [];
    for (a in config.shadowTiddlers)this.isShadowTiddler(a) && b.push(a);
    return b.sort(), b
},TiddlyWiki.prototype.getTouched = function () {
    var a = [];
    return this.forEachTiddler(function (b, c) {
        c.isTouched() && a.push(c)
    }), a.sort(), a
},TiddlyWiki.prototype.resolveTiddler = function (a) {
    var b = "string" == typeof a ? this.getTiddler(a) : a;
    return b instanceof Tiddler ? b : null
},TiddlyWiki.prototype.sortTiddlers = function (a, b) {
    var c = 1;
    switch (b.substr(0, 1)) {
        case"-":
            c = -1, b = b.substr(1);
            break;
        case"+":
            b = b.substr(1)
    }
    return TiddlyWiki.standardFieldAccess[b] ? "title" == b ? a.sort(function (a, d) {
        return a[b].toLowerCase() < d[b].toLowerCase() ? -c : a[b].toLowerCase() == d[b].toLowerCase() ? 0 : c
    }) : a.sort(function (a, d) {
        return a[b] < d[b] ? -c : a[b] == d[b] ? 0 : c
    }) : a.sort(function (a, d) {
        return a.fields[b] < d.fields[b] ? -c : a.fields[b] == d.fields[b] ? 0 : +c
    }), a
},config.filters = {
    tiddler: function (a, b) {
        var c = b[1] || b[4], d = this.fetchTiddler(c);
        return d ? a.pushUnique(d) : this.isShadowTiddler(c) ? (d = new Tiddler, d.set(c, this.getTiddlerText(c)), a.pushUnique(d)) : a.pushUnique(new Tiddler(c)), a
    }, tag: function (a, b) {
        var c, d = this.getTaggedTiddlers(b[3]);
        for (c = 0; c < d.length; c++)a.pushUnique(d[c]);
        return a
    }, sort: function (a, b) {
        return this.sortTiddlers(a, b[3])
    }, limit: function (a, b) {
        return a.slice(0, parseInt(b[3], 10))
    }, field: function (a, b) {
        var c, d = this.getValueTiddlers(b[2], b[3]);
        for (c = 0; c < d.length; c++)a.pushUnique(d[c]);
        return a
    }
},TiddlyWiki.prototype.filterTiddlers = function (a) {
    var b = /([^\s\[\]]+)|(?:\[([ \w\.\-]+)\[([^\]]+)\]\])|(?:\[\[([^\]]+)\]\])/gm, c = [];
    if (a)for (var d = b.exec(a); d;) {
        var e = d[1] || d[4] ? "tiddler" : config.filters[d[2]] ? d[2] : "field";
        c = config.filters[e].call(this, c, d), d = b.exec(a)
    }
    return c
},TiddlyWiki.isValidFieldName = function (a) {
    var b = /[a-zA-Z_]\w*(\.[a-zA-Z_]\w*)*/.exec(a);
    return b && b[0] == a
},TiddlyWiki.checkFieldName = function (a) {
    if (!TiddlyWiki.isValidFieldName(a))throw config.messages.invalidFieldName.format([a])
},TiddlyWiki.standardFieldAccess = {
    title: new StringFieldAccess("title", !0),
    tiddler: new StringFieldAccess("title", !0),
    text: new StringFieldAccess("text"),
    modifier: new StringFieldAccess("modifier"),
    modified: new DateFieldAccess("modified"),
    creator: new StringFieldAccess("creator"),
    created: new DateFieldAccess("created"),
    tags: new LinksFieldAccess("tags")
},TiddlyWiki.isStandardField = function (a) {
    return void 0 != TiddlyWiki.standardFieldAccess[a]
},TiddlyWiki.prototype.setValue = function (a, b, c) {
    TiddlyWiki.checkFieldName(b);
    var d = this.resolveTiddler(a);
    if (d) {
        b = b.toLowerCase();
        var e = void 0 === c || null === c, f = TiddlyWiki.standardFieldAccess[b];
        if (f) {
            if (e)return;
            var g = TiddlyWiki.standardFieldAccess[b];
            if (!g.set(d, c))return
        } else {
            var h = d.fields[b];
            if (e)if (void 0 !== h)delete d.fields[b]; else {
                var k, i = new RegExp("^" + b + "\\."), j = !1;
                for (k in d.fields)k.match(i) && (delete d.fields[k], j = !0);
                if (!j)return
            } else {
                if (c = c instanceof Date ? c.convertToYYYYMMDDHHMMSSMMM() : String(c), h == c)return;
                d.fields[b] = c
            }
        }
        this.notify(d.title, !0), b.match(/^temp\./) || this.setDirty(!0)
    }
},TiddlyWiki.prototype.getValue = function (a, b) {
    var c = this.resolveTiddler(a);
    if (c) {
        if (0 === b.indexOf(config.textPrimitives.sectionSeparator) || 0 === b.indexOf(config.textPrimitives.sliceSeparator)) {
            var d = b.substr(0, 2), e = b.substring(2);
            return store.getTiddlerText("%0%1%2".format(c.title, d, e))
        }
        b = b.toLowerCase();
        var f = TiddlyWiki.standardFieldAccess[b];
        return f ? f.get(c) : c.fields[b]
    }
},TiddlyWiki.prototype.forEachField = function (a, b, c) {
    var d = this.resolveTiddler(a);
    if (d) {
        var e, f;
        for (e in d.fields)if (f = b(d, e, d.fields[e]))return f;
        if (!c)for (e in TiddlyWiki.standardFieldAccess)if ("tiddler" != e && (f = b(d, e, TiddlyWiki.standardFieldAccess[e].get(d))))return f
    }
},Story.prototype.getTiddler = function (a) {
    return document.getElementById(this.tiddlerId(a))
},Story.prototype.getContainer = function () {
    return document.getElementById(this.containerId())
},Story.prototype.forEachTiddler = function (a) {
    var b = this.getContainer();
    if (b)for (var c = b.firstChild; c;) {
        var d = c.nextSibling, e = c.getAttribute("tiddler");
        e && a.call(this, e, c), c = d
    }
},Story.prototype.displayDefaultTiddlers = function () {
    this.displayTiddlers(null, store.filterTiddlers(store.getTiddlerText("DefaultTiddlers")))
},Story.prototype.displayTiddlers = function (a, b, c, d, e, f, g) {
    var h;
    for (h = b.length - 1; h >= 0; h--)this.displayTiddler(a, b[h], c, d, e, f)
},Story.prototype.displayTiddler = function (a, b, c, d, e, f, g, h) {
    var i = b instanceof Tiddler ? b.title : b, j = this.getTiddler(i);
    if (j)g ? "true" != j.getAttribute("dirty") && this.closeTiddler(i, !0) : this.refreshTiddler(i, c, !1, f); else {
        var k = this.getContainer(), l = this.positionTiddler(a);
        j = this.createTiddler(k, l, i, c, f)
    }
    return h && "string" != typeof h && (a = h), a && "string" != typeof a && (config.options.chkAnimate && (void 0 == d || 1 == d) && anim && "function" == typeof Zoomer && "function" == typeof Scroller ? anim.startAnimating(new Zoomer(i, a, j), new Scroller(j)) : window.scrollTo(0, ensureVisible(j))), j
},Story.prototype.positionTiddler = function (a) {
    var b = this.getContainer(), c = null;
    if ("string" == typeof a)switch (a) {
        case"top":
            c = b.firstChild;
            break;
        case"bottom":
            c = null
    } else {
        var d = this.findContainingTiddler(a);
        null == d ? c = b.firstChild : d.nextSibling && (c = d.nextSibling, 1 != c.nodeType && (c = null))
    }
    return c
},Story.prototype.createTiddler = function (a, b, c, d, e) {
    var f = createTiddlyElement(null, "div", this.tiddlerId(c), "tiddler");
    f.setAttribute("refresh", "tiddler"), e && f.setAttribute("tiddlyFields", e), a.insertBefore(f, b);
    var g = null;
    return store.tiddlerExists(c) || store.isShadowTiddler(c) || (g = this.loadMissingTiddler(c, e)), this.refreshTiddler(c, d, !1, e, g), f
},Story.prototype.loadMissingTiddler = function (a, b, c) {
    var d = function (a) {
        if (a.status) {
            var b = a.tiddler;
            b.created || (b.created = new Date), b.modified || (b.modified = b.created);
            var d = store.isDirty();
            a.tiddler = store.saveTiddler(b.title, b.title, b.text, b.modifier, b.modified, b.tags, b.fields, !0, b.created, b.creator), window.allowSave() || store.setDirty(d), autoSaveChanges()
        } else story.refreshTiddler(a.title, null, !0);
        a.adaptor.close(), c && c(a)
    }, e = new Tiddler(a);
    e.fields = "string" == typeof b ? b.decodeHashMap() : b || {};
    var f = {serverType: e.getServerType()};
    if (!f.serverType)return "";
    f.host = e.fields["server.host"], f.workspace = e.fields["server.workspace"];
    var g = new config.adaptors[f.serverType];
    return g.getTiddler(a, f, null, d), config.messages.loadingMissingTiddler.format([a, f.serverType, f.host, f.workspace])
},Story.prototype.chooseTemplateForTiddler = function (a, b) {
    return b || (b = DEFAULT_VIEW_TEMPLATE), b != DEFAULT_VIEW_TEMPLATE && b != DEFAULT_EDIT_TEMPLATE || (b = config.tiddlerTemplates[b]), b
},Story.prototype.getTemplateForTiddler = function (a, b, c) {
    return store.getRecursiveTiddlerText(b, null, 10)
},Story.prototype.refreshTiddler = function (a, b, c, d, e) {
    var f = this.getTiddler(a);
    if (f) {
        if ("true" == f.getAttribute("dirty") && !c)return f;
        b = this.chooseTemplateForTiddler(a, b);
        var g = f.getAttribute("template");
        if (b != g || c) {
            var h = store.getTiddler(a);
            if (!h)if (h = new Tiddler, store.isShadowTiddler(a)) {
                var i = [];
                h.set(a, store.getTiddlerText(a), config.views.wikified.shadowModifier, version.date, i, version.date)
            } else {
                var j = "EditTemplate" == b ? config.views.editor.defaultText.format([a]) : config.views.wikified.defaultText.format([a]);
                j = e || j;
                var k = d ? d.decodeHashMap() : null;
                h.set(a, j, config.views.wikified.defaultModifier, version.date, [], version.date, k)
            }
            f.setAttribute("tags", h.tags.join(" ")), f.setAttribute("tiddler", a), f.setAttribute("template", b), f.onmouseover = this.onTiddlerMouseOver, f.onmouseout = this.onTiddlerMouseOut, f.ondblclick = this.onTiddlerDblClick, f[window.event ? "onkeydown" : "onkeypress"] = this.onTiddlerKeyPress, f.innerHTML = this.getTemplateForTiddler(a, b, h), applyHtmlMacros(f, h), store.getTaggedTiddlers(a).length > 0 ? jQuery(f).addClass("isTag") : jQuery(f).removeClass("isTag"), store.tiddlerExists(a) ? (jQuery(f).removeClass("shadow"), jQuery(f).removeClass("missing")) : jQuery(f).addClass(store.isShadowTiddler(a) ? "shadow" : "missing"), d && this.addCustomFields(f, d)
        }
    }
    return f
},Story.prototype.addCustomFields = function (a, b) {
    var c = b.decodeHashMap(), d = createTiddlyElement(a, "div", null, "customFields");
    d.style.display = "none";
    var e;
    for (e in c) {
        var f = document.createElement("input");
        f.setAttribute("type", "text"), f.setAttribute("value", c[e]), d.appendChild(f), f.setAttribute("edit", e)
    }
},Story.prototype.refreshAllTiddlers = function (a) {
    for (var b = this.getContainer().firstChild; b;) {
        var c = b.getAttribute("template");
        c && "true" != b.getAttribute("dirty") && this.refreshTiddler(b.getAttribute("tiddler"), a ? null : c, !0), b = b.nextSibling
    }
},Story.prototype.onTiddlerMouseOver = function (a) {
    jQuery(this).addClass("selected")
},Story.prototype.onTiddlerMouseOut = function (a) {
    jQuery(this).removeClass("selected")
},Story.prototype.onTiddlerDblClick = function (a) {
    var b = a || window.event, c = resolveTarget(b);
    return !(!c || "input" == c.nodeName.toLowerCase() || "textarea" == c.nodeName.toLowerCase()) && (!window.readOnly && (document.selection && document.selection.empty && document.selection.empty(), config.macros.toolbar.invokeCommand(this, "defaultCommand", b), b.cancelBubble = !0, b.stopPropagation && b.stopPropagation(), !0))
},Story.prototype.onTiddlerKeyPress = function (a) {
    var b = a || window.event;
    clearMessage();
    var c = !1, d = this.getAttribute("tiddler"), e = resolveTarget(b);
    switch (b.keyCode) {
        case 9:
            var f = story.getTiddlerField(d, "text");
            "input" == e.tagName.toLowerCase() && f.value == config.views.editor.defaultText.format([d]) && (f.focus(), f.select(), c = !0), config.options.chkInsertTabs && "textarea" == e.tagName.toLowerCase() && (replaceSelection(e, String.fromCharCode(9)), c = !0), config.isOpera && (e.onblur = function () {
                this.focus(), this.onblur = null
            });
            break;
        case 13:
        case 10:
        case 77:
            b.ctrlKey && (blurElement(this), config.macros.toolbar.invokeCommand(this, "defaultCommand", b), c = !0);
            break;
        case 27:
            blurElement(this), config.macros.toolbar.invokeCommand(this, "cancelCommand", b), c = !0
    }
    return b.cancelBubble = c, c && (b.stopPropagation && b.stopPropagation(), b.returnValue = !0, b.preventDefault && b.preventDefault()), !c
},Story.prototype.getTiddlerField = function (a, b) {
    var c = this.getTiddler(a), d = null;
    if (c) {
        var e, f = c.getElementsByTagName("*");
        for (e = 0; e < f.length; e++) {
            var g = f[e];
            "input" != g.tagName.toLowerCase() && "textarea" != g.tagName.toLowerCase() || (d || (d = g), g.getAttribute("edit") == b && (d = g))
        }
    }
    return d
},Story.prototype.focusTiddler = function (a, b) {
    var c = this.getTiddlerField(a, b);
    c && (c.focus(), c.select())
},Story.prototype.blurTiddler = function (a) {
    var b = this.getTiddler(a);
    b && b.focus && b.blur && (b.focus(), b.blur())
},Story.prototype.setTiddlerField = function (a, b, c, d) {
    var e = this.getTiddlerField(a, d), f = e.value.readBracketedList();
    f.setItem(b, c), e.value = String.encodeTiddlyLinkList(f)
},Story.prototype.setTiddlerTag = function (a, b, c) {
    this.setTiddlerField(a, b, c, "tags")
},Story.prototype.closeTiddler = function (a, b, c) {
    var d = this.getTiddler(a);
    d && (clearMessage(), this.scrubTiddler(d), config.options.chkAnimate && b && anim && "function" == typeof Slider ? anim.startAnimating(new Slider(d, !1, null, "all")) : jQuery(d).remove())
},Story.prototype.scrubTiddler = function (a) {
    a.id = null
},Story.prototype.setDirty = function (a, b) {
    var c = this.getTiddler(a);
    c && c.setAttribute("dirty", b ? "true" : "false")
},Story.prototype.isDirty = function (a) {
    var b = this.getTiddler(a);
    return b ? "true" == b.getAttribute("dirty") : null
},Story.prototype.areAnyDirty = function () {
    var a = !1;
    return this.forEachTiddler(function (b, c) {
        this.isDirty(b) && (a = !0)
    }), a
},Story.prototype.closeAllTiddlers = function (a) {
    clearMessage(), this.forEachTiddler(function (b, c) {
        b != a && "true" != c.getAttribute("dirty") && this.closeTiddler(b)
    }), window.scrollTo(0, ensureVisible(this.container))
},Story.prototype.isEmpty = function () {
    var a = this.getContainer();
    return a && null == a.firstChild
},Story.prototype.search = function (a, b, c) {
    this.closeAllTiddlers(), highlightHack = new RegExp(c ? a : a.escapeRegExp(), b ? "mg" : "img");
    var d = store.search(highlightHack, "title", "excludeSearch");
    this.displayTiddlers(null, d), highlightHack = null;
    var e = c ? "/" : "'";
    displayMessage(d.length > 0 ? config.macros.search.successMsg.format([d.length.toString(), e + a + e]) : config.macros.search.failureMsg.format([e + a + e]))
},Story.prototype.findContainingTiddler = function (a) {
    for (; a && !jQuery(a).hasClass("tiddler");)a = jQuery(a).hasClass("popup") && Popup.stack[0] ? Popup.stack[0].root : a.parentNode;
    return a
},Story.prototype.gatherSaveFields = function (a, b) {
    if (a && a.getAttribute) {
        var c = a.getAttribute("edit");
        if (c && (b[c] = a.value.replace(/\r/gm, "")), a.hasChildNodes()) {
            var d, e = a.childNodes;
            for (d = 0; d < e.length; d++)this.gatherSaveFields(e[d], b)
        }
    }
},Story.prototype.hasChanges = function (a) {
    var b = this.getTiddler(a);
    if (b) {
        var c = {};
        if (this.gatherSaveFields(b, c), !store.fetchTiddler(a))return !store.isShadowTiddler(a) || store.getShadowTiddlerText(a) != c.text;
        var d;
        for (d in c)if (store.getValue(a, d) != c[d])return !0
    }
    return !1
},Story.prototype.saveTiddler = function (a, b) {
    var c = this.getTiddler(a);
    if (c) {
        var d = {};
        this.gatherSaveFields(c, d);
        var e = d.title || a;
        if (!store.tiddlerExists(e)) {
            e = e.trim();
            var f = config.options.txtUserName
        }
        if (store.tiddlerExists(e) && e != a) {
            if (!confirm(config.messages.overwriteWarning.format([e.toString()])))return null;
            a = e
        }
        e != a && this.closeTiddler(e, !1), c.id = this.tiddlerId(e), c.setAttribute("tiddler", e), c.setAttribute("template", DEFAULT_VIEW_TEMPLATE), c.setAttribute("dirty", "false"), config.options.chkForceMinorUpdate && (b = !b), store.tiddlerExists(e) || (b = !1);
        var g = new Date;
        if (store.tiddlerExists(a)) {
            var h = store.fetchTiddler(a), i = h.fields;
            f = h.creator
        } else i = merge({}, config.defaultCustomFields);
        var j;
        for (j in d)TiddlyWiki.isStandardField(j) || (i[j] = d[j]);
        var k = store.saveTiddler(a, e, d.text, b ? void 0 : config.options.txtUserName, b ? void 0 : g, d.tags, i, null, null, f);
        return autoSaveChanges(null, [k]), e
    }
    return null
},Story.prototype.permaView = function () {
    var a = [];
    this.forEachTiddler(function (b, c) {
        a.push(String.encodeTiddlyLink(b))
    });
    var b = encodeURIComponent(a.join(" "));
    "" == b && (b = "#"), window.location.hash != b && (window.location.hash = b)
},Story.prototype.switchTheme = function (a) {
    if (!safeMode) {
        var i, b = function (a, b) {
            var c;
            return readOnly && (c = store.getTiddlerSlice(a, b + "ReadOnly") || store.getTiddlerSlice(a, "Web" + b)), c = c || store.getTiddlerSlice(a, b), c && 0 == c.indexOf(config.textPrimitives.sectionSeparator) && (c = a + c), store.isAvailable(c) ? c : b
        }, c = function (a, c, d, e) {
            var f = b(d, e);
            return c != f && store.namedNotifications[a].name == c ? (store.namedNotifications[a].name = f, f) : c
        }, d = config.refresherData.pageTemplate, e = DEFAULT_VIEW_TEMPLATE, f = config.tiddlerTemplates[e], g = DEFAULT_EDIT_TEMPLATE, h = config.tiddlerTemplates[g];
        for (i = 0; i < config.notifyTiddlers.length; i++) {
            var j = config.notifyTiddlers[i].name;
            switch (j) {
                case"PageTemplate":
                    config.refresherData.pageTemplate = c(i, config.refresherData.pageTemplate, a, j);
                    break;
                case"StyleSheet":
                    removeStyleSheet(config.refresherData.styleSheet), config.refresherData.styleSheet = c(i, config.refresherData.styleSheet, a, j);
                    break;
                case"ColorPalette":
                    config.refresherData.colorPalette = c(i, config.refresherData.colorPalette, a, j)
            }
        }
        config.tiddlerTemplates[e] = b(a, "ViewTemplate"), config.tiddlerTemplates[g] = b(a, "EditTemplate"), startingUp || (config.refresherData.pageTemplate != d || config.tiddlerTemplates[e] != f || config.tiddlerTemplates[g] != h ? (refreshAll(), this.refreshAllTiddlers(!0)) : setStylesheet(store.getRecursiveTiddlerText(config.refresherData.styleSheet, "", 10), config.refreshers.styleSheet), config.options.txtTheme = a, saveOption("txtTheme"))
    }
},config.tasks.save.action = saveChanges;
var backstage = {
    area: null,
    toolbar: null,
    button: null,
    showButton: null,
    hideButton: null,
    cloak: null,
    panel: null,
    panelBody: null,
    panelFooter: null,
    currTabName: null,
    currTabElem: null,
    content: null,
    init: function () {
        var a = config.messages.backstage;
        this.area = document.getElementById("backstageArea"), this.toolbar = jQuery("#backstageToolbar").empty()[0], this.button = jQuery("#backstageButton").empty()[0], this.button.style.display = "block";
        var b = a.open.text + " " + glyph("bentArrowLeft");
        for (this.showButton = createTiddlyButton(this.button, b, a.open.tooltip, function (a) {
            return backstage.show(), !1
        }, null, "backstageShow"), b = glyph("bentArrowRight") + " " + a.close.text, this.hideButton = createTiddlyButton(this.button, b, a.close.tooltip, function (a) {
            return backstage.hide(), !1
        }, null, "backstageHide"), this.cloak = document.getElementById("backstageCloak"), this.panel = document.getElementById("backstagePanel"), this.panelFooter = createTiddlyElement(this.panel, "div", null, "backstagePanelFooter"), this.panelBody = createTiddlyElement(this.panel, "div", null, "backstagePanelBody"), this.cloak.onmousedown = function (a) {
            backstage.switchTab(null)
        }, createTiddlyText(this.toolbar, a.prompt), b = 0; b < config.backstageTasks.length; b++) {
            var c = config.backstageTasks[b], d = config.tasks[c], e = d.action ? this.onClickCommand : this.onClickTab, f = d.text + (d.action ? "" : glyph("downTriangle")), g = createTiddlyButton(this.toolbar, f, d.tooltip, e, "backstageTab");
            jQuery(g).addClass(d.action ? "backstageAction" : "backstageTask"), g.setAttribute("task", c)
        }
        this.content = document.getElementById("contentWrapper"), config.options.chkBackstage ? this.show() : this.hide()
    },
    isVisible: function () {
        return !!this.area && "block" == this.area.style.display
    },
    show: function () {
        if (this.area.style.display = "block", anim && config.options.chkAnimate) {
            backstage.toolbar.style.left = findWindowWidth() + "px";
            var a = [{style: "left", start: findWindowWidth(), end: 0, template: "%0px"}];
            anim.startAnimating(new Morpher(backstage.toolbar, config.animDuration, a))
        } else backstage.area.style.left = "0px";
        jQuery(this.showButton).hide(), jQuery(this.hideButton).show(), config.options.chkBackstage = !0, saveOption("chkBackstage"), jQuery(this.content).addClass("backstageVisible")
    },
    hide: function () {
        if (this.currTabElem)this.switchTab(null); else {
            if (backstage.toolbar.style.left = "0px", anim && config.options.chkAnimate) {
                var a = [{style: "left", start: 0, end: findWindowWidth(), template: "%0px"}], b = function (a, b) {
                    backstage.area.style.display = "none"
                };
                anim.startAnimating(new Morpher(backstage.toolbar, config.animDuration, a, b))
            } else this.area.style.display = "none";
            this.showButton.style.display = "block", this.hideButton.style.display = "none", config.options.chkBackstage = !1, saveOption("chkBackstage"), jQuery(this.content).removeClass("backstageVisible")
        }
    },
    onClickCommand: function (a) {
        var b = config.tasks[this.getAttribute("task")];
        return b.action && (backstage.switchTab(null), b.action()), !1
    },
    onClickTab: function (a) {
        return backstage.switchTab(this.getAttribute("task")), !1
    },
    switchTab: function (a) {
        for (var b = null, c = this.toolbar.firstChild; c;)c.getAttribute && c.getAttribute("task") == a && (b = c), c = c.nextSibling;
        if (a == backstage.currTabName)return void backstage.hidePanel();
        if (backstage.currTabElem && jQuery(this.currTabElem).removeClass("backstageSelTab"), b && a) {
            backstage.preparePanel(), jQuery(b).addClass("backstageSelTab");
            var d = config.tasks[a];
            wikify(d.content, backstage.panelBody, null, null), backstage.showPanel()
        } else backstage.currTabElem && backstage.hidePanel();
        backstage.currTabName = a, backstage.currTabElem = b
    },
    isPanelVisible: function () {
        return !!backstage.panel && "block" == backstage.panel.style.display
    },
    preparePanel: function () {
        return backstage.cloak.style.height = findDocHeight() + "px", backstage.cloak.style.display = "block", jQuery(backstage.panelBody).empty(), backstage.panelBody
    },
    showPanel: function () {
        if (backstage.panel.style.display = "block", anim && config.options.chkAnimate) {
            backstage.panel.style.top = -backstage.panel.offsetHeight + "px";
            var a = [{style: "top", start: -backstage.panel.offsetHeight, end: 0, template: "%0px"}];
            anim.startAnimating(new Morpher(backstage.panel, config.animDuration, a), new Scroller(backstage.panel, !1))
        } else backstage.panel.style.top = "0px";
        return backstage.panelBody
    },
    hidePanel: function () {
        if (backstage.currTabElem && jQuery(backstage.currTabElem).removeClass("backstageSelTab"), backstage.currTabElem = null, backstage.currTabName = null, anim && config.options.chkAnimate) {
            var a = [{style: "top", start: 0, end: -backstage.panel.offsetHeight, template: "%0px"}, {
                style: "display",
                atEnd: "none"
            }], b = function (a, b) {
                backstage.cloak.style.display = "none"
            };
            anim.startAnimating(new Morpher(backstage.panel, config.animDuration, a, b))
        } else jQuery([backstage.panel, backstage.cloak]).hide()
    }
};
config.macros.backstage = {}, config.macros.backstage.handler = function (a, b, c) {
    var d = config.tasks[c[0]];
    d && createTiddlyButton(a, d.text, d.tooltip, function (a) {
        return backstage.switchTab(c[0]), !1
    })
}, config.macros.importTiddlers.handler = function (a, b, c, d, e, f) {
    if (readOnly)return void createTiddlyElement(a, "div", null, "marked", this.readOnlyWarning);
    var g = new Wizard;
    g.createWizard(a, this.wizardTitle), this.restart(g)
}, config.macros.importTiddlers.onCancel = function (a) {
    var b = new Wizard(this);
    return b.clear(), config.macros.importTiddlers.restart(b), !1
}, config.macros.importTiddlers.onClose = function (a) {
    return backstage.hidePanel(), !1
}, config.macros.importTiddlers.restart = function (a) {
    var b = config.macros.importTiddlers;
    a.addStep(this.step1Title, this.step1Html);
    var c, d = a.getElement("selTypes");
    for (c in config.adaptors) {
        var e = createTiddlyElement(d, "option", null, null, config.adaptors[c].serverLabel || c);
        e.value = c
    }
    config.defaultAdaptor && (d.value = config.defaultAdaptor), d = a.getElement("selFeeds");
    var f = this.getFeeds();
    for (c in f)e = createTiddlyElement(d, "option", null, null, c), e.value = c;
    a.setValue("feeds", f), d.onchange = b.onFeedChange;
    var g = a.getElement("txtBrowse");
    g.onchange = b.onBrowseChange, g.onkeyup = b.onBrowseChange, a.setButtons([{
        caption: this.openLabel,
        tooltip: this.openPrompt,
        onClick: b.onOpen
    }]), a.formElem.action = "javascript:;", a.formElem.onsubmit = function () {
        this.txtPath && !this.txtPath.value.length || this.lastChild.firstChild.onclick()
    }
}, config.macros.importTiddlers.getFeeds = function () {
    var b, a = {}, c = store.getTaggedTiddlers("systemServer", "title");
    for (b = 0; b < c.length; b++) {
        var d = c[b].title, e = store.getTiddlerSlice(d, "Type");
        e || (e = "file"), a[d] = {
            title: d,
            url: store.getTiddlerSlice(d, "URL"),
            workspace: store.getTiddlerSlice(d, "Workspace"),
            workspaceList: store.getTiddlerSlice(d, "WorkspaceList"),
            tiddlerFilter: store.getTiddlerSlice(d, "TiddlerFilter"),
            serverType: e,
            description: store.getTiddlerSlice(d, "Description")
        }
    }
    return a
}, config.macros.importTiddlers.onFeedChange = function (a) {
    var b = new Wizard(this), c = b.getElement("selTypes"), d = b.getElement("txtPath"), e = b.getValue("feeds"), f = e[this.value];
    return f && (c.value = f.serverType, d.value = f.url, b.setValue("feedName", f.serverType), b.setValue("feedHost", f.url), b.setValue("feedWorkspace", f.workspace), b.setValue("feedWorkspaceList", f.workspaceList), b.setValue("feedTiddlerFilter", f.tiddlerFilter)), !1
}, config.macros.importTiddlers.onBrowseChange = function (a) {
    var b = new Wizard(this), c = this.value;
    if (c = c.replace(/^C:\\fakepath\\/i, ""), this.files && this.files[0])try {
        netscape.security.PrivilegeManager.enablePrivilege("UniversalFileRead"), c = this.files[0].fileName
    } catch (a) {
        var d = getLocalPath(document.location.href), e = d.lastIndexOf("/");
        e == -1 && (e = d.lastIndexOf("\\")), e != -1 && (d = d.substr(0, e + 1)), c = d + c
    }
    var f = b.getElement("txtPath");
    f.value = config.macros.importTiddlers.getURLFromLocalPath(c);
    var g = b.getElement("selTypes");
    return g.value = "file", !0
}, config.macros.importTiddlers.getURLFromLocalPath = function (a) {
    if (!a || !a.length)return a;
    a = a.replace(/\\/g, "/");
    var b, c = a.split(":"), d = c[1] || c[0];
    if (!c[1] || "http" != c[0] && "https" != c[0] && "file" != c[0])if ("/" == d.substr(0, 1))b = document.location.protocol + "//" + document.location.hostname + (c[1] ? "/" : "") + a; else {
        var e = document.location.href.replace(/\\/g, "/"), f = e.lastIndexOf("/");
        f != -1 && (e = e.substr(0, f)), b = e + "/" + d
    } else b = a;
    return b
}, config.macros.importTiddlers.onOpen = function (a) {
    var b = config.macros.importTiddlers, c = new Wizard(this), d = c.getElement("txtPath"), e = d.value, f = c.getElement("selTypes").value || config.defaultAdaptor, g = new config.adaptors[f];
    return c.setValue("adaptor", g), c.setValue("serverType", f), c.setValue("host", e), g.openHost(e, null, c, b.onOpenHost), c.setButtons([{
        caption: b.cancelLabel,
        tooltip: b.cancelPrompt,
        onClick: b.onCancel
    }], b.statusOpenHost), !1
}, config.macros.importTiddlers.onOpenHost = function (a, b) {
    var c = config.macros.importTiddlers, d = b.getValue("adaptor");
    a.status !== !0 && displayMessage("Error in importTiddlers.onOpenHost: " + a.statusText), d.getWorkspaceList(a, b, c.onGetWorkspaceList), b.setButtons([{
        caption: c.cancelLabel,
        tooltip: c.cancelPrompt,
        onClick: c.onCancel
    }], c.statusGetWorkspaceList)
}, config.macros.importTiddlers.onGetWorkspaceList = function (a, b) {
    var c = config.macros.importTiddlers;
    a.status !== !0 && displayMessage("Error in importTiddlers.onGetWorkspaceList: " + a.statusText), b.setValue("context", a);
    var d = b.getValue("feedWorkspace");
    if (d || 1 != a.workspaces.length || (d = a.workspaces[0].title), d)return a.adaptor.openWorkspace(d, a, b, c.onOpenWorkspace), b.setValue("workspace", d), void b.setButtons([{
        caption: c.cancelLabel,
        tooltip: c.cancelPrompt,
        onClick: c.onCancel
    }], c.statusOpenWorkspace);
    b.addStep(c.step2Title, c.step2Html);
    var e, f = b.getElement("selWorkspace");
    for (f.onchange = c.onWorkspaceChange, e = 0; e < a.workspaces.length; e++) {
        var g = createTiddlyElement(f, "option", null, null, a.workspaces[e].title);
        g.value = a.workspaces[e].title
    }
    var h = b.getValue("feedWorkspaceList");
    if (h) {
        var i, j = h.parseParams("workspace", null, !1, !0);
        for (i = 1; i < j.length; i++)null == a.workspaces.findByField("title", j[i].value) && (g = createTiddlyElement(f, "option", null, null, j[i].value), g.value = j[i].value)
    }
    d && (e = b.getElement("txtWorkspace"), e.value = d), b.setButtons([{
        caption: c.openLabel,
        tooltip: c.openPrompt,
        onClick: c.onChooseWorkspace
    }])
}, config.macros.importTiddlers.onWorkspaceChange = function (a) {
    var b = new Wizard(this), c = b.getElement("txtWorkspace");
    return c.value = this.value, this.selectedIndex = 0, !1
}, config.macros.importTiddlers.onChooseWorkspace = function (a) {
    var b = config.macros.importTiddlers, c = new Wizard(this), d = c.getValue("adaptor"), e = c.getElement("txtWorkspace").value;
    c.setValue("workspace", e);
    var f = c.getValue("context");
    return d.openWorkspace(e, f, c, b.onOpenWorkspace), c.setButtons([{
        caption: b.cancelLabel,
        tooltip: b.cancelPrompt,
        onClick: b.onCancel
    }], b.statusOpenWorkspace), !1
}, config.macros.importTiddlers.onOpenWorkspace = function (a, b) {
    var c = config.macros.importTiddlers;
    a.status !== !0 && displayMessage("Error in importTiddlers.onOpenWorkspace: " + a.statusText);
    var d = b.getValue("adaptor"), e = b.getElement("txtBrowse");
    e.files && (a.file = e.files[0]), d.getTiddlerList(a, b, c.onGetTiddlerList, b.getValue("feedTiddlerFilter")), b.setButtons([{
        caption: c.cancelLabel,
        tooltip: c.cancelPrompt,
        onClick: c.onCancel
    }], c.statusGetTiddlerList)
}, config.macros.importTiddlers.onGetTiddlerList = function (a, b) {
    var c = config.macros.importTiddlers;
    if (a.status !== !0) {
        var d = a.statusText || c.errorGettingTiddlerList;
        return d = 0 === a.host.indexOf("file://") ? c.errorGettingTiddlerListFile : a.xhr && 404 == a.xhr.status ? c.errorGettingTiddlerListHttp404 : c.errorGettingTiddlerListHttp, b.setButtons([{
            caption: c.cancelLabel,
            tooltip: c.cancelPrompt,
            onClick: c.onCancel
        }], ""), void jQuery("span.status", b.footerEl).html(d)
    }
    var e = [];
    if (a.tiddlers) {
        var f;
        for (f = 0; f < a.tiddlers.length; f++) {
            var g = a.tiddlers[f];
            e.push({
                title: g.title,
                modified: g.modified,
                modifier: g.modifier,
                text: g.text ? wikifyPlainText(g.text, 100) : "",
                tags: g.tags,
                size: g.text ? g.text.length : 0,
                tiddler: g
            })
        }
    }
    e.sort(function (a, b) {
        return a.title < b.title ? -1 : a.title == b.title ? 0 : 1
    }), b.addStep(c.step3Title, c.step3Html);
    var h = b.getElement("markList"), i = document.createElement("div");
    h.parentNode.insertBefore(i, h);
    var j = ListView.create(i, e, c.listViewTemplate);
    b.setValue("listView", j), b.setValue("context", a);
    var k = b.getElement("txtSaveTiddler");
    k.value = c.generateSystemServerName(b), b.setButtons([{
        caption: c.cancelLabel,
        tooltip: c.cancelPrompt,
        onClick: c.onCancel
    }, {caption: c.importLabel, tooltip: c.importPrompt, onClick: c.doImport}])
}, config.macros.importTiddlers.generateSystemServerName = function (a) {
    var b = a.getValue("serverType"), c = a.getValue("host"), d = a.getValue("workspace"), e = config.macros.importTiddlers[d ? "systemServerNamePattern" : "systemServerNamePatternNoWorkspace"];
    return e.format([b, c, d])
}, config.macros.importTiddlers.saveServerTiddler = function (a) {
    var b = config.macros.importTiddlers, c = a.getElement("txtSaveTiddler").value;
    if (store.tiddlerExists(c)) {
        if (!confirm(b.confirmOverwriteSaveTiddler.format([c])))return;
        store.suspendNotifications(), store.removeTiddler(c), store.resumeNotifications()
    }
    var d = a.getValue("serverType"), e = a.getValue("host"), f = a.getValue("workspace"), g = b.serverSaveTemplate.format([d, e, f]);
    store.saveTiddler(c, c, g, b.serverSaveModifier, new Date, ["systemServer"])
}, config.macros.importTiddlers.doImport = function (a) {
    var b = config.macros.importTiddlers, c = new Wizard(this);
    c.getElement("chkSave").checked && b.saveServerTiddler(c);
    var d = c.getElement("chkSync").checked;
    c.setValue("sync", d);
    var i, e = c.getValue("listView"), f = ListView.getSelectedRows(e), g = c.getValue("adaptor"), h = [];
    for (i = 0; i < f.length; i++)store.tiddlerExists(f[i]) && h.push(f[i]);
    if (h.length > 0 && !confirm(b.confirmOverwriteText.format([h.join(", ")])))return !1;
    for (c.addStep(b.step4Title.format([f.length]), b.step4Html), i = 0; i < f.length; i++) {
        var j = document.createElement("div");
        createTiddlyLink(j, f[i], !0);
        var k = c.getElement("markReport");
        k.parentNode.insertBefore(j, k)
    }
    c.setValue("remainingImports", f.length), c.setButtons([{
        caption: b.cancelLabel,
        tooltip: b.cancelPrompt,
        onClick: b.onCancel
    }], b.statusDoingImport);
    var l = c.getValue("context"), m = l ? l.tiddlers : [];
    for (i = 0; i < f.length; i++) {
        var n = {allowSynchronous: !0, tiddler: m[m.findByField("title", f[i])]};
        g.getTiddler(f[i], n, c, b.onGetTiddler)
    }
    return !1
}, config.macros.importTiddlers.onGetTiddler = function (a, b) {
    var c = config.macros.importTiddlers;
    a.status || displayMessage("Error in importTiddlers.onGetTiddler: " + a.statusText);
    var d = a.tiddler;
    store.suspendNotifications(), store.saveTiddler(d.title, d.title, d.text, d.modifier, d.modified, d.tags, d.fields, !0, d.created), b.getValue("sync") || store.setValue(d.title, "server", null), store.resumeNotifications(), a.isSynchronous || store.notify(d.title, !0);
    var e = b.getValue("remainingImports") - 1;
    b.setValue("remainingImports", e), 0 == e && (a.isSynchronous && (store.notifyAll(), refreshDisplay()), b.setButtons([{
        caption: c.doneLabel,
        tooltip: c.donePrompt,
        onClick: c.onClose
    }], c.statusDoneImport), autoSaveChanges())
}, config.macros.upgrade.handler = function (a) {
    var b = new Wizard;
    b.createWizard(a, this.wizardTitle), b.addStep(this.step1Title, this.step1Html.format([this.source, this.source])), b.setButtons([{
        caption: this.upgradeLabel,
        tooltip: this.upgradePrompt,
        onClick: this.onClickUpgrade
    }])
}, config.macros.upgrade.onClickUpgrade = function (a) {
    var b = config.macros.upgrade, c = new Wizard(this);
    if (!window.allowSave())return alert(b.errorCantUpgrade), !1;
    if (story.areAnyDirty() || store.isDirty())return alert(b.errorNotSaved), !1;
    var d = getLocalPath(document.location.toString()), e = getBackupPath(d, b.backupExtension);
    c.setValue("backupPath", e), c.setButtons([], b.statusPreparingBackup);
    var f = loadOriginal(d);
    c.setButtons([], b.statusSavingBackup);
    var g = copyFile(e, d);
    if (g || (g = saveFile(e, f)), !g)return c.setButtons([], b.errorSavingBackup), alert(b.errorSavingBackup), !1;
    c.setButtons([], b.statusLoadingCore);
    var h = {
        type: "GET", url: b.source, processData: !1, success: function (a, d, e) {
            b.onLoadCore(!0, c, e.responseText, b.source, e)
        }, error: function (a, d, e) {
            b.onLoadCore(!1, c, null, b.source, a)
        }
    };
    return ajaxReq(h), !1
}, config.macros.upgrade.onLoadCore = function (a, b, c, d, e) {
    var h, f = config.macros.upgrade, g = b;
    a || (h = f.errorLoadingCore);
    var i = f.extractVersion(c);
    if (i || (h = f.errorCoreFormat), h)return g.setButtons([], h), void alert(h);
    var j = function (a) {
        g.setButtons([], f.statusSavingCore);
        var b = getLocalPath(document.location.toString());
        saveFile(b, c), g.setButtons([], f.statusReloadingCore);
        var d = g.getValue("backupPath"), e = document.location.toString() + "?time=" + (new Date).convertToYYYYMMDDHHMM() + "#upgrade:[[" + encodeURI(d) + "]]";
        window.setTimeout(function () {
            window.location = e
        }, 10)
    }, k = [f.step2Html_downgrade, f.step2Html_restore, f.step2Html_upgrade][compareVersions(version, i) + 1];
    g.addStep(f.step2Title, k.format([formatVersion(i), formatVersion(version)])), g.setButtons([{
        caption: f.startLabel,
        tooltip: f.startPrompt,
        onClick: j
    }, {caption: f.cancelLabel, tooltip: f.cancelPrompt, onClick: f.onCancel}])
}, config.macros.upgrade.onCancel = function (a) {
    var b = config.macros.upgrade, c = new Wizard(this);
    return c.addStep(b.step3Title, b.step3Html), c.setButtons([]), !1
}, config.macros.upgrade.extractVersion = function (a) {
    var b = /^var version = \{title: "([^"]+)", major: (\d+), minor: (\d+), revision: (\d+)(, beta: (\d+)){0,1}, date: new Date\("([^"]+)"\)/gm, c = b.exec(a);
    return c ? {title: c[1], major: c[2], minor: c[3], revision: c[4], beta: c[6], date: new Date(c[7])} : null
}, config.macros.plugins.handler = function (a, b, c, d, e) {
    var f = new Wizard;
    f.createWizard(a, this.wizardTitle), f.addStep(this.step1Title, this.step1Html);
    var g = f.getElement("markList"), h = document.createElement("div");
    g.parentNode.insertBefore(h, g), h.setAttribute("refresh", "macro"), h.setAttribute("macroName", "plugins"), h.setAttribute("params", e), this.refresh(h, e)
}, config.macros.plugins.refresh = function (a, b) {
    var c = config.macros.plugins, d = new Wizard(a), e = [];
    ListView.forEachSelector(a, function (a, b) {
        a.checked && e.push(a.getAttribute("rowName"))
    }), jQuery(a).empty(), b = b.parseParams("anon");
    var g, h, i, f = installedPlugins.slice(0), j = store.getTaggedTiddlers("systemConfig");
    for (g = 0; g < j.length; g++)h = j[g], null == f.findByField("title", h.title) && (i = getPluginInfo(h), i.executed = !1, i.log.splice(0, 0, this.skippedText), f.push(i));
    for (g = 0; g < f.length; g++)i = f[g], i.size = i.tiddler.text ? i.tiddler.text.length : 0, i.forced = i.tiddler.isTagged("systemConfigForce"), i.disabled = i.tiddler.isTagged("systemConfigDisable"), i.Selected = e.indexOf(f[g].title) != -1;
    if (0 == f.length)createTiddlyElement(a, "em", null, null, this.noPluginText), d.setButtons([]); else {
        var k = readOnly ? this.listViewTemplateReadOnly : this.listViewTemplate, l = ListView.create(a, f, k, this.onSelectCommand);
        d.setValue("listView", l), readOnly || d.setButtons([{
            caption: c.removeLabel,
            tooltip: c.removePrompt,
            onClick: c.doRemoveTag
        }, {caption: c.deleteLabel, tooltip: c.deletePrompt, onClick: c.doDelete}])
    }
}, config.macros.plugins.doRemoveTag = function (a) {
    var b = new Wizard(this), c = b.getValue("listView"), d = ListView.getSelectedRows(c);
    if (0 == d.length)alert(config.messages.nothingSelected); else {
        var e;
        for (e = 0; e < d.length; e++)store.setTiddlerTag(d[e], !1, "systemConfig");
        autoSaveChanges()
    }
}, config.macros.plugins.doDelete = function (a) {
    var b = new Wizard(this), c = b.getValue("listView"), d = ListView.getSelectedRows(c);
    if (0 == d.length)alert(config.messages.nothingSelected); else {
        if (confirm(config.macros.plugins.confirmDeleteText.format([d.join(", ")]))) {
            var e;
            for (e = 0; e < d.length; e++)store.removeTiddler(d[e]), story.closeTiddler(d[e], !0)
        }
        autoSaveChanges()
    }
}, config.notifyTiddlers = [{name: "SystemSettings", notify: onSystemSettingsChange}, {
    name: "StyleSheetLayout",
    notify: refreshStyles
}, {name: "StyleSheetColors", notify: refreshStyles}, {
    name: "StyleSheet",
    notify: refreshStyles
}, {name: "StyleSheetPrint", notify: refreshStyles}, {
    name: "PageTemplate",
    notify: refreshPageTemplate
}, {name: "SiteTitle", notify: refreshPageTitle}, {
    name: "SiteSubtitle",
    notify: refreshPageTitle
}, {name: "WindowTitle", notify: refreshPageTitle}, {name: "ColorPalette", notify: refreshColorPalette}, {
    name: null,
    notify: refreshDisplay
}], config.refreshers = {
    link: function (a, b) {
        var c = a.getAttribute("tiddlyLink");
        return refreshTiddlyLink(a, c), !0
    }, tiddler: function (a, b) {
        var c = a.getAttribute("tiddler"), d = a.getAttribute("template");
        return b && b.indexOf && b.indexOf(c) != -1 && !story.isDirty(c) ? story.refreshTiddler(c, d, !0) : refreshElements(a, b), !0
    }, content: function (a, b) {
        var c = a.getAttribute("tiddler"), d = a.getAttribute("force"), e = a.getAttribute("args");
        return !!(null != d || null == b || b.indexOf && b.indexOf(c) != -1) && (jQuery(a).empty(), config.macros.tiddler.transclude(a, c, e), !0)
    }, macro: function (a, b) {
        var c = a.getAttribute("macroName"), d = a.getAttribute("params");
        return c && (c = config.macros[c]), c && c.refresh && c.refresh(a, d), !0
    }
}, config.refresherData = {
    styleSheet: "StyleSheet",
    defaultStyleSheet: "StyleSheet",
    pageTemplate: "PageTemplate",
    defaultPageTemplate: "PageTemplate",
    colorPalette: "ColorPalette",
    defaultColorPalette: "ColorPalette"
}, config.optionHandlers = {
    txt: {
        get: function (a) {
            return encodeCookie(config.options[a].toString())
        }, set: function (a, b) {
            config.options[a] = decodeCookie(b)
        }
    }, chk: {
        get: function (a) {
            return config.options[a] ? "true" : "false"
        }, set: function (a, b) {
            config.options[a] = "true" == b
        }
    }
};
var loadOptionsCookie = loadOptions, saveOptionCookie = saveOption, systemSettingSave;
config.macros.option.genericCreate = function (a, b, c, d, e) {
    var f = config.macros.option.types[b], g = document.createElement(f.elementType);
    return f.typeValue && g.setAttribute("type", f.typeValue), g[f.eventName] = f.onChange, g.setAttribute("option", c), g.className = d || f.className, config.optionsDesc[c] && g.setAttribute("title", config.optionsDesc[c]), a.appendChild(g), "no" != e && createTiddlyText(a, config.optionsDesc[c] || c), g[f.valueField] = config.options[c], g
}, config.macros.option.genericOnChange = function (a) {
    var b = this.getAttribute("option");
    if (b) {
        var c = b.substr(0, 3), d = config.macros.option.types[c];
        d.elementType && d.valueField && config.macros.option.propagateOption(b, d.valueField, this[d.valueField], d.elementType, this)
    }
    return !0
}, config.macros.option.types = {
    txt: {
        elementType: "input",
        valueField: "value",
        eventName: "onchange",
        className: "txtOptionInput",
        create: config.macros.option.genericCreate,
        onChange: config.macros.option.genericOnChange
    },
    chk: {
        elementType: "input",
        valueField: "checked",
        eventName: "onclick",
        className: "chkOptionInput",
        typeValue: "checkbox",
        create: config.macros.option.genericCreate,
        onChange: config.macros.option.genericOnChange
    }
}, config.macros.option.propagateOption = function (a, b, c, d, e) {
    config.options[a] = c, saveOption(a);
    var f, g = document.getElementsByTagName(d);
    for (f = 0; f < g.length; f++) {
        var h = g[f].getAttribute("option");
        a == h && g[f] != e && (g[f][b] = c)
    }
}, config.macros.option.handler = function (a, b, c, d, e) {
    c = e.parseParams("anon", null, !0, !1, !1);
    var f = c[1] && "anon" == c[1].name ? c[1].value : getParam(c, "name", null), g = c[2] && "anon" == c[2].name ? c[2].value : getParam(c, "class", null), h = getParam(c, "desc", "no"), i = f.substr(0, 3), j = config.macros.option.types[i];
    j && j.create && j.create(a, i, f, g, h)
}, config.macros.options.handler = function (a, b, c, d, e) {
    c = e.parseParams("anon", null, !0, !1, !1);
    var f = getParam(c, "showUnknown", "no"), g = new Wizard;
    g.createWizard(a, this.wizardTitle), g.addStep(this.step1Title, this.step1Html);
    var h = g.getElement("markList"), i = g.getElement("chkUnknown");
    i.checked = "yes" == f, i.onchange = this.onChangeUnknown;
    var j = document.createElement("div");
    h.parentNode.insertBefore(j, h), g.setValue("listWrapper", j), this.refreshOptions(j, "yes" == f)
}, config.macros.options.refreshOptions = function (a, b) {
    var c, d = [];
    for (c in config.options) {
        var e = {};
        e.option = "", e.name = c, e.lowlight = !config.optionsDesc[c], e.description = e.lowlight ? this.unknownDescription : config.optionsDesc[c], e.lowlight && !b || d.push(e)
    }
    for (d.sort(function (a, b) {
        return a.name.substr(3) < b.name.substr(3) ? -1 : a.name.substr(3) == b.name.substr(3) ? 0 : 1
    }), ListView.create(a, d, this.listViewTemplate), c = 0; c < d.length; c++) {
        var f = d[c].name.substr(0, 3), g = config.macros.option.types[f];
        g && g.create && g.create(d[c].colElements.option, f, d[c].name, null, "no")
    }
}, config.macros.options.onChangeUnknown = function (a) {
    var b = new Wizard(this), c = b.getValue("listWrapper");
    return jQuery(c).empty(), config.macros.options.refreshOptions(c, this.checked), !1
};
var saveUsingSafari = !1, startSaveArea = '<div id="storeArea">', startSaveAreaRE = /<((div)|(DIV)) ((id)|(ID))=["']?storeArea['"]?>/, endSaveArea = "</div>", endSaveAreaCaps = "</DIV>";
window.getLocalPath = window.getLocalPath || function (a) {
        var b = convertUriToUTF8(a, config.options.txtFileSystemCharSet), c = b.indexOf("?");
        c != -1 && (b = b.substr(0, c));
        var d = b.indexOf("#");
        d != -1 && (b = b.substr(0, d)), 0 == b.indexOf("file://localhost/") && (b = "file://" + b.substr(16));
        var e;
        return e = ":" == b.charAt(9) ? unescape(b.substr(8)).replace(new RegExp("/", "g"), "\\") : 0 == b.indexOf("file://///") ? "\\\\" + unescape(b.substr(10)).replace(new RegExp("/", "g"), "\\") : 0 == b.indexOf("file:///") ? unescape(b.substr(7)) : 0 == b.indexOf("file:/") ? unescape(b.substr(5)) : "\\\\" + unescape(b.substr(7)).replace(new RegExp("/", "g"), "\\")
    }, tiddlerToRssItem = function (a, b) {
    var c = "<title>" + a.title.htmlEncode() + "</title>\n";
    c += "<description>" + wikifyStatic(a.text, null, a).htmlEncode() + "</description>\n";
    var d;
    for (d = 0; d < a.tags.length; d++)c += "<category>" + a.tags[d] + "</category>\n";
    return c += "<link>" + b + "#" + encodeURIComponent(String.encodeTiddlyLink(a.title)) + "</link>\n", c += "<pubDate>" + a.modified.toGMTString() + "</pubDate>\n"
}, window.copyFile = window.copyFile || function (a, b) {
        return !!config.browser.isIE && ieCopyFile(a, b)
    }, window.saveFile = window.saveFile || function (a, b) {
        var c = mozillaSaveFile(a, b);
        return c || (c = ieSaveFile(a, b)), c || (c = javaSaveFile(a, b)), c || (c = HTML5DownloadSaveFile(a, b)), c || (c = manualSaveFile(a, b)), c
    }, window.loadFile = window.loadFile || function (a) {
        var b = mozillaLoadFile(a);
        return null != b && 0 != b || (b = ieLoadFile(a)), null != b && 0 != b || (b = javaLoadFile(a)), b
    };
var LOG_TIDDLYSAVER = !0;
AdaptorBase.prototype.close = function () {
    return !0
}, AdaptorBase.prototype.fullHostName = function (a) {
    return a ? (a = a.trim(), a.match(/:\/\//) || (a = "http://" + a), "/" == a.substr(a.length - 1) && (a = a.substr(0, a.length - 1)), a) : ""
}, AdaptorBase.minHostName = function (a) {
    return a
}, AdaptorBase.prototype.setContext = function (a, b, c) {
    return a || (a = {}), a.userParams = b, c && (a.callback = c), a.adaptor = this, a.host || (a.host = this.host), a.host = this.fullHostName(a.host), a.workspace || (a.workspace = this.workspace), a
}, AdaptorBase.prototype.openHost = function (a, b, c, d) {
    return this.host = a, b = this.setContext(b, c, d), b.status = !0, d && window.setTimeout(function () {
        b.callback(b, c)
    }, 10), !0
}, AdaptorBase.prototype.openWorkspace = function (a, b, c, d) {
    return this.workspace = a, b = this.setContext(b, c, d), b.status = !0, d && window.setTimeout(function () {
        d(b, c)
    }, 10), !0
}, FileAdaptor.prototype = new AdaptorBase, FileAdaptor.serverType = "file", FileAdaptor.serverLabel = "TiddlyWiki", FileAdaptor.loadTiddlyWikiSuccess = function (a, b) {
    a.status = !0, a.adaptor.store = new TiddlyWiki, a.adaptor.store.importTiddlyWiki(b.responseText) || (a.statusText = config.messages.invalidFileError.format([a.host]), a.status = !1), a.complete(a, a.userParams)
}, FileAdaptor.loadTiddlyWikiError = function (a, b) {
    a.status = !1, a.statusText = b.message, a.complete(a, a.userParams)
}, FileAdaptor.prototype.getWorkspaceList = function (a, b, c) {
    return a = this.setContext(a, b, c), a.workspaces = [{title: "(default)"}], a.status = !0, c && window.setTimeout(function () {
        c(a, b)
    }, 10), !0
}, FileAdaptor.prototype.getTiddlerList = function (a, b, c, d) {
    if (a = this.setContext(a, b, c), a.filter || (a.filter = d), a.complete = FileAdaptor.getTiddlerListComplete, this.store)return a.complete(a, a.userParams);
    var e = {
        type: "GET", url: a.host, file: a.file, processData: !1, success: function (b, c, d) {
            FileAdaptor.loadTiddlyWikiSuccess(a, d)
        }, error: function (b, c, d) {
            a.xhr = b, FileAdaptor.loadTiddlyWikiError(a, b)
        }
    };
    return ajaxReq(e)
}, FileAdaptor.getTiddlerListComplete = function (a, b) {
    if (a.status) {
        a.filter ? a.tiddlers = a.adaptor.store.filterTiddlers(a.filter) : (a.tiddlers = [], a.adaptor.store.forEachTiddler(function (b, c) {
            a.tiddlers.push(c)
        }));
        var c;
        for (c = 0; c < a.tiddlers.length; c++)a.tiddlers[c].fields["server.type"] = FileAdaptor.serverType, a.tiddlers[c].fields["server.host"] = AdaptorBase.minHostName(a.host), a.tiddlers[c].fields["server.page.revision"] = a.tiddlers[c].modified.convertToYYYYMMDDHHMM();
        a.status = !0
    }
    return a.callback && window.setTimeout(function () {
        a.callback(a, b)
    }, 10), !0
}, FileAdaptor.prototype.generateTiddlerInfo = function (a) {
    var b = {};
    return b.uri = a.fields["server.host"] + "#" + a.title, b
}, FileAdaptor.prototype.getTiddler = function (a, b, c, d) {
    if (b = this.setContext(b, c, d), b.title = a, b.complete = FileAdaptor.getTiddlerComplete, b.adaptor.store)return b.complete(b, b.userParams);
    var e = {
        type: "GET", url: b.host, processData: !1, success: function (a, c, d) {
            FileAdaptor.loadTiddlyWikiSuccess(b, d)
        }, error: function (a, c, d) {
            FileAdaptor.loadTiddlyWikiError(b, a)
        }
    };
    return ajaxReq(e)
}, FileAdaptor.getTiddlerComplete = function (a, b) {
    var c = a.adaptor.store.fetchTiddler(a.title);
    return c ? (c.fields["server.type"] = FileAdaptor.serverType, c.fields["server.host"] = AdaptorBase.minHostName(a.host), c.fields["server.page.revision"] = c.modified.convertToYYYYMMDDHHMM(), a.tiddler = c, a.status = !0) : a.status = !1, a.allowSynchronous ? (a.isSynchronous = !0, a.callback(a, b)) : window.setTimeout(function () {
        a.callback(a, b)
    }, 10), !0
}, FileAdaptor.prototype.close = function () {
    this.store = null
}, config.adaptors[FileAdaptor.serverType] = FileAdaptor, config.defaultAdaptor = FileAdaptor.serverType, Animator.prototype.startAnimating = function () {
    var a;
    for (a = 0; a < arguments.length; a++)this.animations.push(arguments[a]);
    if (0 == this.running) {
        var b = this;
        this.timerID = window.setInterval(function () {
            b.doAnimate(b)
        }, 10)
    }
    this.running += arguments.length
}, Animator.prototype.doAnimate = function (a) {
    for (var b = 0; b < a.animations.length;) {
        var c = a.animations[b];
        c.tick() ? b++ : (a.animations.splice(b, 1), 0 == --a.running && window.clearInterval(a.timerID))
    }
}, Animator.slowInSlowOut = function (a) {
    return 1 - (Math.cos(a * Math.PI) + 1) / 2
}, Morpher.prototype.assignStyle = function (a, b, c) {
    switch (b) {
        case"-tw-vertScroll":
            window.scrollTo(findScrollX(), c);
            break;
        case"-tw-horizScroll":
            window.scrollTo(c, findScrollY());
            break;
        default:
            a.style[b] = c
    }
}, Morpher.prototype.stop = function () {
    var a;
    for (a = 0; a < this.properties.length; a++) {
        var b = this.properties[a];
        void 0 !== b.atEnd && this.assignStyle(this.element, b.style, b.atEnd)
    }
    this.callback && this.callback(this.element, this.properties)
}, Morpher.prototype.tick = function () {
    var b, a = Number(new Date), c = Animator.slowInSlowOut(Math.min(1, (a - this.startTime) / this.duration));
    for (b = 0; b < this.properties.length; b++) {
        var d = this.properties[b];
        if (void 0 !== d.start && void 0 !== d.end) {
            var e = d.template || "%0";
            switch (d.format) {
                case void 0:
                case"style":
                    var f = d.start + (d.end - d.start) * c;
                    this.assignStyle(this.element, d.style, e.format([f]));
                    break;
                case"color":
            }
        }
    }
    return !(a >= this.endTime) || (this.stop(), !1)
};
var Popup = {stack: []};
Popup.create = function (a, b, c) {
    var d = this.find(a, "popup");
    Popup.remove(d + 1);
    var e = createTiddlyElement(document.body, b || "ol", "popup", c || "popup");
    return e.stackPosition = d, Popup.stack.push({root: a, popup: e}), e
}, Popup.onDocumentClick = function (a) {
    var b = a || window.event;
    return void 0 == b.eventPhase ? Popup.remove() : b.eventPhase != Event.BUBBLING_PHASE && b.eventPhase != Event.AT_TARGET || Popup.remove(), !0
}, Popup.show = function (a, b, c) {
    var d = Popup.stack[Popup.stack.length - 1];
    this.place(d.root, d.popup, a, b, c), jQuery(d.root).addClass("highlight"), config.options.chkAnimate && anim && "function" == typeof Scroller ? anim.startAnimating(new Scroller(d.popup)) : window.scrollTo(0, ensureVisible(d.popup))
}, Popup.place = function (a, b, c, d, e) {
    e || (e = {
        x: 0,
        y: 0
    }), b.stackPosition >= 0 && !c && !d ? e.x = e.x + a.offsetWidth : (e.x = "right" == d ? e.x + a.offsetWidth : e.x, e.y = "top" == c ? e.y : e.y + a.offsetHeight);
    var f = findPosX(a), g = findPosY(a), h = f + e.x, i = g + e.y, j = findWindowWidth();
    b.offsetWidth > .75 * j && (b.style.width = .75 * j + "px");
    var k = b.offsetWidth, l = j - document.body.offsetWidth;
    h + k > j - l - 1 && (h = "right" == d ? h - a.offsetWidth - k : j - k - l - 1), b.style.left = h + "px", b.style.top = i + "px", b.style.display = "block"
}, Popup.find = function (a) {
    var b, c = -1;
    for (b = this.stack.length - 1; b >= 0; b--)isDescendant(a, this.stack[b].popup) && (c = b);
    return c
}, Popup.remove = function (a) {
    a || (a = 0), Popup.stack.length > a && Popup.removeFrom(a)
}, Popup.removeFrom = function (a) {
    var b;
    for (b = Popup.stack.length - 1; b >= a; b--) {
        var c = Popup.stack[b];
        jQuery(c.root).removeClass("highlight"), jQuery(c.popup).remove()
    }
    Popup.stack = Popup.stack.slice(0, a)
}, Wizard.prototype.setValue = function (a, b) {
    jQuery(this.formElem).data(a, b)
}, Wizard.prototype.getValue = function (a) {
    return this.formElem ? jQuery(this.formElem).data(a) : null
}, Wizard.prototype.createWizard = function (a, b) {
    return this.formElem = createTiddlyElement(a, "form", null, "wizard"), createTiddlyElement(this.formElem, "h1", null, null, b), this.bodyElem = createTiddlyElement(this.formElem, "div", null, "wizardBody"), this.footElem = createTiddlyElement(this.formElem, "div", null, "wizardFooter"), this.formElem
}, Wizard.prototype.clear = function () {
    jQuery(this.bodyElem).empty()
}, Wizard.prototype.setButtons = function (a, b) {
    jQuery(this.footElem).empty();
    var c;
    for (c = 0; c < a.length; c++)createTiddlyButton(this.footElem, a[c].caption, a[c].tooltip, a[c].onClick), insertSpacer(this.footElem);
    "string" == typeof b && createTiddlyElement(this.footElem, "span", null, "status", b)
}, Wizard.prototype.addStep = function (a, b) {
    jQuery(this.bodyElem).empty();
    var c = createTiddlyElement(this.bodyElem, "div");
    createTiddlyElement(c, "h2", null, null, a);
    var d = createTiddlyElement(c, "div", null, "wizardStep");
    d.innerHTML = b, applyHtmlMacros(d, tiddler)
}, Wizard.prototype.getElement = function (a) {
    return this.formElem.elements[a]
};
var ListView = {};
ListView.create = function (a, b, c, d, e) {
    var h, f = createTiddlyElement(a, "table", null, e || "listView twtable"), g = createTiddlyElement(f, "thead"), i = createTiddlyElement(g, "tr");
    for (h = 0; h < c.columns.length; h++) {
        var j = c.columns[h], k = createTiddlyElement(i, "th"), l = ListView.columnTypes[j.type];
        l && l.createHeader && (l.createHeader(k, j, h), j.className && jQuery(k).addClass(j.className))
    }
    var m, n = createTiddlyElement(f, "tbody");
    for (m = 0; m < b.length; m++) {
        var o = b[m];
        for (i = createTiddlyElement(n, "tr"), k = 0; k < c.rowClasses.length; k++)o[c.rowClasses[k].field] && jQuery(i).addClass(c.rowClasses[k].className);
        o.rowElement = i, o.colElements = {};
        var p;
        for (p = 0; p < c.columns.length; p++) {
            k = createTiddlyElement(i, "td"), j = c.columns[p];
            var q = j.field;
            l = ListView.columnTypes[j.type], l && l.createItem && (l.createItem(k, o, q, j, p, m), j.className && jQuery(k).addClass(j.className)), o.colElements[q] = k
        }
    }
    if (d && c.actions && createTiddlyDropDown(a, ListView.getCommandHandler(d), c.actions), d && c.buttons)for (h = 0; h < c.buttons.length; h++) {
        var r = c.buttons[h];
        r && "" != r.name && createTiddlyButton(a, r.caption, null, ListView.getCommandHandler(d, r.name, r.allowEmptySelection))
    }
    return f
}, ListView.getCommandHandler = function (a, b, c) {
    return function (d) {
        var e = findRelated(this, "TABLE", null, "previousSibling"), f = [];
        ListView.forEachSelector(e, function (a, b) {
            a.checked && f.push(b)
        }), 0 != f.length || c ? "select" == this.nodeName.toLowerCase() ? (a(e, this.value, f), this.selectedIndex = 0) : a(e, b, f) : alert(config.messages.nothingSelected)
    }
}, ListView.forEachSelector = function (a, b) {
    var d, c = a.getElementsByTagName("input"), e = !1;
    for (d = 0; d < c.length; d++) {
        var f = c[d];
        if ("checkbox" == f.getAttribute("type")) {
            var g = f.getAttribute("rowName");
            g && (b(f, g), e = !0)
        }
    }
    return e
}, ListView.getSelectedRows = function (a) {
    var b = [];
    return ListView.forEachSelector(a, function (a, c) {
        a.checked && b.push(c)
    }), b
}, ListView.columnTypes = {}, ListView.columnTypes.String = {
    createHeader: function (a, b, c) {
        createTiddlyText(a, b.title)
    }, createItem: function (a, b, c, d, e, f) {
        var g = b[c];
        void 0 != g && createTiddlyText(a, g)
    }
}, ListView.columnTypes.WikiText = {
    createHeader: ListView.columnTypes.String.createHeader,
    createItem: function (a, b, c, d, e, f) {
        var g = b[c];
        void 0 != g && wikify(g, a, null, null)
    }
}, ListView.columnTypes.Tiddler = {
    createHeader: ListView.columnTypes.String.createHeader,
    createItem: function (a, b, c, d, e, f) {
        var g = b[c];
        void 0 != g && g.title && createTiddlyPopup(a, g.title, config.messages.listView.tiddlerTooltip, g)
    }
}, ListView.columnTypes.Size = {
    createHeader: ListView.columnTypes.String.createHeader,
    createItem: function (a, b, c, d, e, f) {
        var g = config.messages.sizeTemplates, h = b[c];
        if (void 0 != h) {
            for (var i = 0; i < g.length - 1 && h < g[i].unit;)i++;
            createTiddlyText(a, g[i].template.format([Math.round(h / g[i].unit)]))
        }
    }
}, ListView.columnTypes.Link = {
    createHeader: ListView.columnTypes.String.createHeader,
    createItem: function (a, b, c, d, e, f) {
        var g = b[c], h = d.text;
        void 0 != g && createExternalLink(a, g, h || g)
    }
}, ListView.columnTypes.Date = {
    createHeader: ListView.columnTypes.String.createHeader,
    createItem: function (a, b, c, d, e, f) {
        var g = b[c];
        void 0 != g && createTiddlyText(a, g.formatString(d.dateFormat))
    }
}, ListView.columnTypes.StringList = {
    createHeader: ListView.columnTypes.String.createHeader,
    createItem: function (a, b, c, d, e, f) {
        var g = b[c];
        if (void 0 != g) {
            var h;
            for (h = 0; h < g.length; h++)createTiddlyText(a, g[h]), createTiddlyElement(a, "br")
        }
    }
}, ListView.columnTypes.Selector = {
    createHeader: function (a, b, c) {
        createTiddlyCheckbox(a, null, !1, this.onHeaderChange)
    }, createItem: function (a, b, c, d, e, f) {
        var g = createTiddlyCheckbox(a, null, b[c], null);
        g.setAttribute("rowName", b[d.rowName])
    }, onHeaderChange: function (a) {
        var b = this.checked, c = findRelated(this, "TABLE");
        c && ListView.forEachSelector(c, function (a, c) {
            a.checked = b
        })
    }
}, ListView.columnTypes.Tags = {
    createHeader: ListView.columnTypes.String.createHeader,
    createItem: function (a, b, c, d, e, f) {
        var g = b[c];
        createTiddlyText(a, String.encodeTiddlyLinkList(g))
    }
}, ListView.columnTypes.Boolean = {
    createHeader: ListView.columnTypes.String.createHeader,
    createItem: function (a, b, c, d, e, f) {
        1 == b[c] && createTiddlyText(a, d.trueText), 0 == b[c] && createTiddlyText(a, d.falseText)
    }
}, ListView.columnTypes.TagCheckbox = {
    createHeader: ListView.columnTypes.String.createHeader,
    createItem: function (a, b, c, d, e, f) {
        var g = createTiddlyCheckbox(a, null, b[c], this.onChange);
        g.setAttribute("tiddler", b.title), g.setAttribute("tag", d.tag)
    },
    onChange: function (a) {
        var b = this.getAttribute("tag"), c = this.getAttribute("tiddler");
        store.setTiddlerTag(c, this.checked, b)
    }
}, ListView.columnTypes.TiddlerLink = {
    createHeader: ListView.columnTypes.String.createHeader,
    createItem: function (a, b, c, d, e, f) {
        var g = b[c];
        if (void 0 != g) {
            var h = createTiddlyLink(a, b[d.tiddlerLink], !1, null);
            createTiddlyText(h, b[c])
        }
    }
}, Array.indexOf || (Array.prototype.indexOf = function (a, b) {
    b || (b = 0);
    var c;
    for (c = b; c < this.length; c++)if (this[c] === a)return c;
    return -1
}), Array.prototype.findByField = function (a, b) {
    var c;
    for (c = 0; c < this.length; c++)if (this[c][a] === b)return c;
    return null
}, Array.prototype.contains = function (a) {
    return this.indexOf(a) != -1
}, Array.prototype.setItem = function (a, b) {
    var c = this.indexOf(a);
    0 == b && (b = c == -1 ? 1 : -1), 1 == b ? c == -1 && this.push(a) : b == -1 && c != -1 && this.splice(c, 1)
}, Array.prototype.containsAny = function (a) {
    var b;
    for (b = 0; b < a.length; b++)if (this.indexOf(a[b]) != -1)return !0;
    return !1
}, Array.prototype.containsAll = function (a) {
    var b;
    for (b = 0; b < a.length; b++)if (this.indexOf(a[b]) == -1)return !1;
    return !0
}, Array.prototype.pushUnique = function (a, b) {
    b === !1 ? this.push(a) : this.indexOf(a) == -1 && this.push(a)
}, Array.prototype.remove = function (a) {
    var b = this.indexOf(a);
    b != -1 && this.splice(b, 1)
}, Array.prototype.map || (Array.prototype.map = function (a, b) {
    var d, e, c = b || window, f = [];
    for (d = 0, e = this.length; d < e; ++d)f.push(a.call(c, this[d], d, this));
    return f
}), String.prototype.right = function (a) {
    return a < this.length ? this.slice(this.length - a) : this
}, String.prototype.trim = function () {
    return this.replace(/^\s*|\s*$/g, "")
}, String.prototype.unDash = function () {
    var a, b = this.split("-");
    if (b.length > 1)for (a = 1; a < b.length; a++)b[a] = b[a].substr(0, 1).toUpperCase() + b[a].substr(1);
    return b.join("")
}, String.prototype.format = function (a) {
    var e, b = a && a.constructor == Array ? a : arguments, c = /(?:%(\d+))/gm, d = 0, f = [];
    do e = c.exec(this), e && e[1] && (e.index > d && f.push(this.substring(d, e.index)), f.push(b[parseInt(e[1], 10)]), d = c.lastIndex); while (e);
    return d < this.length && f.push(this.substring(d, this.length)), f.join("")
}, String.prototype.escapeRegExp = function () {
    var b, a = "\\^$*+?()=!|,{}[].", c = this;
    for (b = 0; b < a.length; b++)c = c.replace(new RegExp("\\" + a.substr(b, 1), "g"), "\\" + a.substr(b, 1));
    return c
}, String.prototype.escapeLineBreaks = function () {
    return this.replace(/\\/gm, "\\s").replace(/\n/gm, "\\n").replace(/\r/gm, "")
}, String.prototype.unescapeLineBreaks = function () {
    return this.replace(/\\n/gm, "\n").replace(/\\b/gm, " ").replace(/\\s/gm, "\\").replace(/\r/gm, "")
}, String.prototype.htmlEncode = function () {
    return this.replace(/&/gm, "&amp;").replace(/</gm, "&lt;").replace(/>/gm, "&gt;").replace(/\"/gm, "&quot;")
}, String.prototype.htmlDecode = function () {
    return this.replace(/&lt;/gm, "<").replace(/&gt;/gm, ">").replace(/&quot;/gm, '"').replace(/&amp;/gm, "&")
}, String.prototype.parseParams = function (a, b, c, d, e) {
    var q, f = function (a, b) {
        var d;
        if (a[b])d = a[b]; else if (a[b + 1])d = a[b + 1]; else if (a[b + 2])d = a[b + 2]; else if (a[b + 3])try {
            d = a[b + 3], c && "none" != config.evaluateMacroParameters && ("restricted" == config.evaluateMacroParameters ? window.restrictedEval && (d = window.restrictedEval(d)) : d = window.eval(d))
        } catch (c) {
            throw"Unable to evaluate {{" + a[b + 3] + "}}: " + exceptionText(c)
        } else a[b + 4] ? d = a[b + 4] : a[b + 5] && (d = "");
        return d
    }, g = [{}], h = '(?:"((?:(?:\\\\")|[^"])+)")', i = "(?:'((?:(?:\\\\')|[^'])+)')", j = "(?:\\[\\[((?:\\s|\\S)*?)\\]\\])", k = "(?:\\{\\{((?:\\s|\\S)*?)\\}\\})", l = d ? "([^\"'\\s]\\S*)" : "([^\"':\\s][^\\s:]*)", m = "((?:\"\")|(?:''))", n = "(?:\\s*)", o = "(?:" + h + "|" + i + "|" + j + "|" + k + "|" + l + "|" + m + ")", p = d ? new RegExp(o, "mg") : new RegExp(n + o + n + "(?:(\\:)" + n + o + ")?", "mg");
    do if (q = p.exec(this)) {
        var r = f(q, 1);
        if (d)g.push({name: "", value: r}); else {
            var s = f(q, 8);
            null == s && a ? (s = r, r = a) : null == s && b && (s = b), g.push({
                name: r,
                value: s
            }), e && (a = r, b = s)
        }
    } while (q);
    var t;
    for (t = 1; t < g.length; t++)g[0][g[t].name] ? g[0][g[t].name].push(g[t].value) : g[0][g[t].name] = [g[t].value];
    return g
}, String.prototype.readMacroParams = function (a) {
    var c, b = this.parseParams("list", null, !a, !0), d = [];
    for (c = 1; c < b.length; c++)d.push(b[c].value);
    return d
}, String.prototype.readBracketedList = function (a) {
    var c, b = this.parseParams("list", null, !1, !0), d = [];
    for (c = 1; c < b.length; c++)b[c].value && d.pushUnique(b[c].value, a);
    return d
}, String.prototype.getChunkRange = function (a, b) {
    var c = this.indexOf(a);
    if (c != -1) {
        c += a.length;
        var d = this.indexOf(b, c);
        if (d != -1)return [c, d]
    }
}, String.prototype.replaceChunk = function (a, b, c) {
    var d = this.getChunkRange(a, b);
    return d ? this.substring(0, d[0]) + c + this.substring(d[1]) : this
}, String.prototype.getChunk = function (a, b) {
    var c = this.getChunkRange(a, b);
    if (c)return this.substring(c[0], c[1])
}, String.encodeTiddlyLink = function (a) {
    return a.indexOf(" ") == -1 ? a : "[[" + a + "]]"
}, String.encodeTiddlyLinkList = function (a) {
    if (a) {
        var b, c = [];
        for (b = 0; b < a.length; b++)c.push(String.encodeTiddlyLink(a[b]));
        return c.join(" ")
    }
    return ""
}, String.prototype.decodeHashMap = function () {
    var b, a = this.parseParams("anon", "", !1), c = {};
    for (b = 1; b < a.length; b++)c[a[b].name] = a[b].value;
    return c
}, String.encodeHashMap = function (a) {
    var b, c = [];
    for (b in a)c.push(b + ':"' + a[b] + '"');
    return c.join(" ")
}, String.zeroPad = function (a, b) {
    var c = a.toString();
    return c.length < b && (c = "000000000000000000000000000".substr(0, b - c.length) + c), c
}, String.prototype.startsWith = function (a) {
    return !a || this.substring(0, a.length) == a
}, Date.prototype.formatString = function (a) {
    var b = a.replace(/0hh12/g, String.zeroPad(this.getHours12(), 2));
    b = b.replace(/hh12/g, this.getHours12()), b = b.replace(/0hh/g, String.zeroPad(this.getHours(), 2)), b = b.replace(/hh/g, this.getHours()), b = b.replace(/mmm/g, config.messages.dates.shortMonths[this.getMonth()]), b = b.replace(/0mm/g, String.zeroPad(this.getMinutes(), 2)), b = b.replace(/mm/g, this.getMinutes()), b = b.replace(/0ss/g, String.zeroPad(this.getSeconds(), 2)), b = b.replace(/ss/g, this.getSeconds()), b = b.replace(/[ap]m/g, this.getAmPm().toLowerCase()), b = b.replace(/[AP]M/g, this.getAmPm().toUpperCase()), b = b.replace(/wYYYY/g, this.getYearForWeekNo()), b = b.replace(/wYY/g, String.zeroPad(this.getYearForWeekNo() - 2e3, 2)), b = b.replace(/YYYY/g, this.getFullYear()), b = b.replace(/YY/g, String.zeroPad(this.getFullYear() - 2e3, 2)), b = b.replace(/MMM/g, config.messages.dates.months[this.getMonth()]), b = b.replace(/0MM/g, String.zeroPad(this.getMonth() + 1, 2)), b = b.replace(/MM/g, this.getMonth() + 1), b = b.replace(/0WW/g, String.zeroPad(this.getWeek(), 2)), b = b.replace(/WW/g, this.getWeek()), b = b.replace(/DDD/g, config.messages.dates.days[this.getDay()]), b = b.replace(/ddd/g, config.messages.dates.shortDays[this.getDay()]), b = b.replace(/0DD/g, String.zeroPad(this.getDate(), 2)), b = b.replace(/DDth/g, this.getDate() + this.daySuffix()), b = b.replace(/DD/g, this.getDate());
    var c = this.getTimezoneOffset(), d = Math.abs(c);
    return b = b.replace(/TZD/g, (c < 0 ? "+" : "-") + String.zeroPad(Math.floor(d / 60), 2) + ":" + String.zeroPad(d % 60, 2)), b = b.replace(/\\/g, "")
}, Date.prototype.getWeek = function () {
    var a = new Date(this.getTime()), b = a.getDay();
    0 == b && (b = 7), a.setTime(a.getTime() + 864e5 * (4 - b));
    var c = Math.floor((a.getTime() - new Date(a.getFullYear(), 0, 1) + 36e5) / 864e5);
    return Math.floor(c / 7) + 1
}, Date.prototype.getYearForWeekNo = function () {
    var a = new Date(this.getTime()), b = a.getDay();
    return 0 == b && (b = 7), a.setTime(a.getTime() + 864e5 * (4 - b)), a.getFullYear()
}, Date.prototype.getHours12 = function () {
    var a = this.getHours();
    return a > 12 ? a - 12 : a > 0 ? a : 12
}, Date.prototype.getAmPm = function () {
    return this.getHours() >= 12 ? config.messages.dates.pm : config.messages.dates.am
}, Date.prototype.daySuffix = function () {
    return config.messages.dates.daySuffixes[this.getDate() - 1]
}, Date.prototype.convertToLocalYYYYMMDDHHMM = function () {
    return this.getFullYear() + String.zeroPad(this.getMonth() + 1, 2) + String.zeroPad(this.getDate(), 2) + String.zeroPad(this.getHours(), 2) + String.zeroPad(this.getMinutes(), 2)
}, Date.prototype.convertToYYYYMMDDHHMM = function () {
    return this.getUTCFullYear() + String.zeroPad(this.getUTCMonth() + 1, 2) + String.zeroPad(this.getUTCDate(), 2) + String.zeroPad(this.getUTCHours(), 2) + String.zeroPad(this.getUTCMinutes(), 2)
}, Date.prototype.convertToYYYYMMDDHHMMSSMMM = function () {
    return this.getUTCFullYear() + String.zeroPad(this.getUTCMonth() + 1, 2) + String.zeroPad(this.getUTCDate(), 2) + "." + String.zeroPad(this.getUTCHours(), 2) + String.zeroPad(this.getUTCMinutes(), 2) + String.zeroPad(this.getUTCSeconds(), 2) + String.zeroPad(this.getUTCMilliseconds(), 3) + "0"
}, Date.convertFromYYYYMMDDHHMM = function (a) {
    return a = a ? a.replace(/[^0-9]/g, "") : "", Date.convertFromYYYYMMDDHHMMSSMMM(a.substr(0, 12))
}, Date.convertFromYYYYMMDDHHMMSS = function (a) {
    return a = a ? a.replace(/[^0-9]/g, "") : "", Date.convertFromYYYYMMDDHHMMSSMMM(a.substr(0, 14))
}, Date.convertFromYYYYMMDDHHMMSSMMM = function (a) {
    return a = a ? a.replace(/[^0-9]/g, "") : "", new Date(Date.UTC(parseInt(a.substr(0, 4), 10), parseInt(a.substr(4, 2), 10) - 1, parseInt(a.substr(6, 2), 10), parseInt(a.substr(8, 2) || "00", 10), parseInt(a.substr(10, 2) || "00", 10), parseInt(a.substr(12, 2) || "00", 10), parseInt(a.substr(14, 3) || "000", 10)))
}, RGB.prototype.mix = function (a, b) {
    return new RGB(this.r + (a.r - this.r) * b, this.g + (a.g - this.g) * b, this.b + (a.b - this.b) * b)
}, RGB.prototype.toString = function () {
    var a = function (a, b, c) {
        return a < b ? b : a > c ? c : a
    };
    return "#" + ("0" + Math.floor(255 * a(this.r, 0, 1)).toString(16)).right(2) + ("0" + Math.floor(255 * a(this.g, 0, 1)).toString(16)).right(2) + ("0" + Math.floor(255 * a(this.b, 0, 1)).toString(16)).right(2)
}, LoaderBase.prototype.loadTiddler = function (a, b, c) {
    var d = this.getTitle(a, b);
    if ((!safeMode || !a.isShadowTiddler(d)) && d) {
        var e = a.createTiddler(d);
        this.internalizeTiddler(a, e, d, b), c.push(e)
    }
}, LoaderBase.prototype.loadTiddlers = function (a, b) {
    var c, d = [];
    for (c = 0; c < b.length; c++)try {
        this.loadTiddler(a, b[c], d)
    } catch (d) {
        showException(d, config.messages.tiddlerLoadError.format([this.getTitle(a, b[c])]))
    }
    return d
}, SaverBase.prototype.externalize = function (a) {
    var c, b = [], d = a.getTiddlers("title");
    for (c = 0; c < d.length; c++)d[c].doNotSave() || b.push(this.externalizeTiddler(a, d[c]));
    return b.join("\n")
}, TW21Loader.prototype = new LoaderBase, TW21Loader.prototype.getTitle = function (a, b) {
    var c = null;
    if (b.getAttribute && (c = b.getAttribute("title"), c || (c = b.getAttribute("tiddler"))), !c && b.id) {
        var d = a.idPrefix.length;
        b.id.substr(0, d) == a.idPrefix && (c = b.id.substr(d))
    }
    return c
}, TW21Loader.prototype.internalizeTiddler = function (a, b, c, d) {
    var e = d.firstChild, f = null;
    if (d.getAttribute("tiddler"))f = getNodeText(e).unescapeLineBreaks(); else {
        for (; "PRE" != e.nodeName && "pre" != e.nodeName;)e = e.nextSibling;
        f = e.innerHTML.replace(/\r/gm, "").htmlDecode()
    }
    var o, g = d.getAttribute("creator"), h = d.getAttribute("modifier"), i = d.getAttribute("created"), j = d.getAttribute("modified"), k = i ? Date.convertFromYYYYMMDDHHMMSS(i) : version.date, l = j ? Date.convertFromYYYYMMDDHHMMSS(j) : k, m = d.getAttribute("tags"), n = {}, p = d.attributes;
    for (o = p.length - 1; o >= 0; o--) {
        var q = p[o].name;
        p[o].specified && !TiddlyWiki.isStandardField(q) && (n[q] = p[o].value.unescapeLineBreaks())
    }
    return b.assign(c, f, h, l, m, k, n, g), b
}, TW21Saver.prototype = new SaverBase, TW21Saver.prototype.externalizeTiddler = function (a, b) {
    try {
        var c = "", d = config.options.chkUsePreForStorage;
        a.forEachField(b, function (a, b, d) {
            "string" != typeof d && (d = ""), b.match(/^temp\./) || (c += ' %0="%1"'.format([b, d.escapeLineBreaks().htmlEncode()]))
        }, !0);
        var e = b.created, f = b.modified, g = b.creator ? ' creator="' + b.creator.htmlEncode() + '"' : "";
        g += b.modifier ? ' modifier="' + b.modifier.htmlEncode() + '"' : "", g += d && e == version.date ? "" : ' created="' + e.convertToYYYYMMDDHHMM() + '"', g += d && f == e ? "" : ' modified="' + f.convertToYYYYMMDDHHMM() + '"';
        var h = b.getTags();
        return d && !h || (g += ' tags="' + h.htmlEncode() + '"'), '<div %0="%1"%2%3>%4</div>'.format([d ? "title" : "tiddler", b.title.htmlEncode(), g, c, d ? "\n<pre>" + b.text.htmlEncode() + "</pre>\n" : b.text.escapeLineBreaks().htmlEncode()])
    } catch (a) {
        throw exceptionText(a, config.messages.tiddlerSaveError.format([b.title]))
    }
}, Crypto.strToBe32s = function (a) {
    return jQuery.encoding.strToBe32s(a)
}, Crypto.be32sToStr = function (a) {
    return jQuery.encoding.be32sToStr(a)
}, Crypto.be32sToHex = function (a) {
    return jQuery.encoding.be32sToHex(a)
}, Crypto.hexSha1Str = function (a) {
    return jQuery.encoding.digests.hexSha1Str(a)
}, Crypto.sha1Str = function (a) {
    return jQuery.encoding.digests.sha1Str(a)
}, Crypto.sha1 = function (a, b) {
    return jQuery.encoding.digests.sha1(a, b)
}, config.formatterHelpers.charFormatHelper = function (a) {
    a.subWikify(createTiddlyElement(a.output, this.element), this.terminator)
}, config.formatterHelpers.monospacedByLineHelper = function (a) {
    var b = new RegExp(this.lookahead, "mg");
    b.lastIndex = a.matchStart;
    var c = b.exec(a.source);
    if (c && c.index == a.matchStart) {
        var d = c[1];
        config.browser.isIE && (d = d.replace(/\n/g, "\r")), createTiddlyElement(a.output, "pre", null, null, d), a.nextMatch = b.lastIndex
    }
}, config.macros.br = {}, config.macros.br.handler = function (a) {
    createTiddlyElement(a, "br")
}, Array.prototype.find = function (a) {
    var b = this.indexOf(a);
    return b == -1 ? null : b
}, Tiddler.prototype.loadFromDiv = function (a, b) {
    return store.getLoader().internalizeTiddler(store, this, b, a)
}, Tiddler.prototype.saveToDiv = function () {
    return store.getSaver().externalizeTiddler(store, this)
};
var createTiddlerPopup = Popup.create, scrollToTiddlerPopup = Popup.show, hideTiddlerPopup = Popup.remove, regexpBackSlashEn = new RegExp("\\\\n", "mg"), regexpBackSlash = new RegExp("\\\\", "mg"), regexpBackSlashEss = new RegExp("\\\\s", "mg"), regexpNewLine = new RegExp("\n", "mg"), regexpCarriageReturn = new RegExp("\r", "mg");
FileAdaptor.loadTiddlyWikiCallback = function (a, b, c, d, e) {
    b.status = a, a ? (b.adaptor.store = new TiddlyWiki, b.adaptor.store.importTiddlyWiki(c) || (b.statusText = config.messages.invalidFileError.format([d]), b.status = !1)) : b.statusText = "Error reading file", b.complete(b, b.userParams)
}, String.prototype.toJSONString = function () {
    var a = {
        "\b": "\\b",
        "\f": "\\f",
        "\n": "\\n",
        "\r": "\\r",
        "\t": "\\t",
        '"': '\\"',
        "\\": "\\\\"
    }, b = function (b, c) {
        var d = a[c];
        return d ? d : (d = c.charCodeAt(), "\\u00" + Math.floor(d / 16).toString(16) + (d % 16).toString(16))
    };
    return /["\\\x00-\x1f]/.test(this) ? '"' + this.replace(/([\x00-\x1f\\"])/g, b) + '"' : '"' + this + '"'
}, Tiddler.prototype.toRssItem = function (a) {
    return tiddlerToRssItem(this, a)
}, Tiddler.prototype.saveToRss = function (a) {
    return "<item>\n" + tiddlerToRssItem(this, a) + "\n</item>"
}, Tiddler.prototype.generateFingerprint = function () {
    return "0x" + Crypto.hexSha1Str(this.text)
}, Number.prototype.clamp = function (a, b) {
    var c = this;
    return c < a && (c = a), c > b && (c = b), Number(c)
}, function (a, b) {
    function c(a) {
        var b = oa[a] = {};
        return $.each(a.split(ba), function (a, c) {
            b[c] = !0
        }), b
    }

    function d(a, c, d) {
        if (d === b && 1 === a.nodeType) {
            var e = "data-" + c.replace(qa, "-$1").toLowerCase();
            if (d = a.getAttribute(e), "string" == typeof d) {
                try {
                    d = "true" === d || "false" !== d && ("null" === d ? null : +d + "" === d ? +d : pa.test(d) ? $.parseJSON(d) : d)
                } catch (a) {
                }
                $.data(a, c, d)
            } else d = b
        }
        return d
    }

    function e(a) {
        var b;
        for (b in a)if (("data" !== b || !$.isEmptyObject(a[b])) && "toJSON" !== b)return !1;
        return !0
    }

    function f() {
        return !1
    }

    function g() {
        return !0
    }

    function h(a) {
        return !a || !a.parentNode || 11 === a.parentNode.nodeType
    }

    function i(a, b) {
        do a = a[b]; while (a && 1 !== a.nodeType);
        return a
    }

    function j(a, b, c) {
        if (b = b || 0, $.isFunction(b))return $.grep(a, function (a, d) {
            var e = !!b.call(a, d, a);
            return e === c
        });
        if (b.nodeType)return $.grep(a, function (a, d) {
            return a === b === c
        });
        if ("string" == typeof b) {
            var d = $.grep(a, function (a) {
                return 1 === a.nodeType
            });
            if (Ka.test(b))return $.filter(b, d, !c);
            b = $.filter(b, d)
        }
        return $.grep(a, function (a, d) {
            return $.inArray(a, b) >= 0 === c
        })
    }

    function k(a) {
        var b = Na.split("|"), c = a.createDocumentFragment();
        if (c.createElement)for (; b.length;)c.createElement(b.pop());
        return c
    }

    function l(a, b) {
        return a.getElementsByTagName(b)[0] || a.appendChild(a.ownerDocument.createElement(b))
    }

    function m(a, b) {
        if (1 === b.nodeType && $.hasData(a)) {
            var c, d, e, f = $._data(a), g = $._data(b, f), h = f.events;
            if (h) {
                delete g.handle, g.events = {};
                for (c in h)for (d = 0, e = h[c].length; d < e; d++)$.event.add(b, c, h[c][d])
            }
            g.data && (g.data = $.extend({}, g.data))
        }
    }

    function n(a, b) {
        var c;
        1 === b.nodeType && (b.clearAttributes && b.clearAttributes(), b.mergeAttributes && b.mergeAttributes(a), c = b.nodeName.toLowerCase(), "object" === c ? (b.parentNode && (b.outerHTML = a.outerHTML), $.support.html5Clone && a.innerHTML && !$.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : "input" === c && Xa.test(a.type) ? (b.defaultChecked = b.checked = a.checked, b.value !== a.value && (b.value = a.value)) : "option" === c ? b.selected = a.defaultSelected : "input" === c || "textarea" === c ? b.defaultValue = a.defaultValue : "script" === c && b.text !== a.text && (b.text = a.text), b.removeAttribute($.expando))
    }

    function o(a) {
        return "undefined" != typeof a.getElementsByTagName ? a.getElementsByTagName("*") : "undefined" != typeof a.querySelectorAll ? a.querySelectorAll("*") : []
    }

    function p(a) {
        Xa.test(a.type) && (a.defaultChecked = a.checked)
    }

    function q(a, b) {
        if (b in a)return b;
        for (var c = b.charAt(0).toUpperCase() + b.slice(1), d = b, e = rb.length; e--;)if (b = rb[e] + c, b in a)return b;
        return d
    }

    function r(a, b) {
        return a = b || a, "none" === $.css(a, "display") || !$.contains(a.ownerDocument, a)
    }

    function s(a, b) {
        for (var c, d, e = [], f = 0, g = a.length; f < g; f++)c = a[f], c.style && (e[f] = $._data(c, "olddisplay"), b ? (!e[f] && "none" === c.style.display && (c.style.display = ""), "" === c.style.display && r(c) && (e[f] = $._data(c, "olddisplay", w(c.nodeName)))) : (d = cb(c, "display"), !e[f] && "none" !== d && $._data(c, "olddisplay", d)));
        for (f = 0; f < g; f++)c = a[f], c.style && (b && "none" !== c.style.display && "" !== c.style.display || (c.style.display = b ? e[f] || "" : "none"));
        return a
    }

    function t(a, b, c) {
        var d = kb.exec(b);
        return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b
    }

    function u(a, b, c, d) {
        for (var e = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, f = 0; e < 4; e += 2)"margin" === c && (f += $.css(a, c + qb[e], !0)), d ? ("content" === c && (f -= parseFloat(cb(a, "padding" + qb[e])) || 0), "margin" !== c && (f -= parseFloat(cb(a, "border" + qb[e] + "Width")) || 0)) : (f += parseFloat(cb(a, "padding" + qb[e])) || 0, "padding" !== c && (f += parseFloat(cb(a, "border" + qb[e] + "Width")) || 0));
        return f
    }

    function v(a, b, c) {
        var d = "width" === b ? a.offsetWidth : a.offsetHeight, e = !0, f = $.support.boxSizing && "border-box" === $.css(a, "boxSizing");
        if (d <= 0 || null == d) {
            if (d = cb(a, b), (d < 0 || null == d) && (d = a.style[b]), lb.test(d))return d;
            e = f && ($.support.boxSizingReliable || d === a.style[b]), d = parseFloat(d) || 0
        }
        return d + u(a, b, c || (f ? "border" : "content"), e) + "px"
    }

    function w(a) {
        if (nb[a])return nb[a];
        var b = $("<" + a + ">").appendTo(P.body), c = b.css("display");
        return b.remove(), "none" !== c && "" !== c || (db = P.body.appendChild(db || $.extend(P.createElement("iframe"), {
                frameBorder: 0,
                width: 0,
                height: 0
            })), eb && db.createElement || (eb = (db.contentWindow || db.contentDocument).document, eb.write("<!doctype html><html><body>"), eb.close()), b = eb.body.appendChild(eb.createElement(a)), c = cb(b, "display"), P.body.removeChild(db)), nb[a] = c, c
    }

    function x(a, b, c, d) {
        var e;
        if ($.isArray(b))$.each(b, function (b, e) {
            c || ub.test(a) ? d(a, e) : x(a + "[" + ("object" == typeof e ? b : "") + "]", e, c, d)
        }); else if (c || "object" !== $.type(b))d(a, b); else for (e in b)x(a + "[" + e + "]", b[e], c, d)
    }

    function y(a) {
        return function (b, c) {
            "string" != typeof b && (c = b, b = "*");
            var d, e, f, g = b.toLowerCase().split(ba), h = 0, i = g.length;
            if ($.isFunction(c))for (; h < i; h++)d = g[h], f = /^\+/.test(d), f && (d = d.substr(1) || "*"), e = a[d] = a[d] || [], e[f ? "unshift" : "push"](c)
        }
    }

    function z(a, c, d, e, f, g) {
        f = f || c.dataTypes[0], g = g || {}, g[f] = !0;
        for (var h, i = a[f], j = 0, k = i ? i.length : 0, l = a === Kb; j < k && (l || !h); j++)h = i[j](c, d, e), "string" == typeof h && (!l || g[h] ? h = b : (c.dataTypes.unshift(h), h = z(a, c, d, e, h, g)));
        return (l || !h) && !g["*"] && (h = z(a, c, d, e, "*", g)), h
    }

    function A(a, c) {
        var d, e, f = $.ajaxSettings.flatOptions || {};
        for (d in c)c[d] !== b && ((f[d] ? a : e || (e = {}))[d] = c[d]);
        e && $.extend(!0, a, e)
    }

    function B(a, c, d) {
        var e, f, g, h, i = a.contents, j = a.dataTypes, k = a.responseFields;
        for (f in k)f in d && (c[k[f]] = d[f]);
        for (; "*" === j[0];)j.shift(), e === b && (e = a.mimeType || c.getResponseHeader("content-type"));
        if (e)for (f in i)if (i[f] && i[f].test(e)) {
            j.unshift(f);
            break
        }
        if (j[0]in d)g = j[0]; else {
            for (f in d) {
                if (!j[0] || a.converters[f + " " + j[0]]) {
                    g = f;
                    break
                }
                h || (h = f)
            }
            g = g || h
        }
        if (g)return g !== j[0] && j.unshift(g), d[g]
    }

    function C(a, b) {
        var c, d, e, f, g = a.dataTypes.slice(), h = g[0], i = {}, j = 0;
        if (a.dataFilter && (b = a.dataFilter(b, a.dataType)), g[1])for (c in a.converters)i[c.toLowerCase()] = a.converters[c];
        for (; e = g[++j];)if ("*" !== e) {
            if ("*" !== h && h !== e) {
                if (c = i[h + " " + e] || i["* " + e], !c)for (d in i)if (f = d.split(" "), f[1] === e && (c = i[h + " " + f[0]] || i["* " + f[0]])) {
                    c === !0 ? c = i[d] : i[d] !== !0 && (e = f[0], g.splice(j--, 0, e));
                    break
                }
                if (c !== !0)if (c && a.throws)b = c(b); else try {
                    b = c(b)
                } catch (a) {
                    return {state: "parsererror", error: c ? a : "No conversion from " + h + " to " + e}
                }
            }
            h = e
        }
        return {state: "success", data: b}
    }

    function D() {
        try {
            return new a.XMLHttpRequest
        } catch (a) {
        }
    }

    function E() {
        try {
            return new a.ActiveXObject("Microsoft.XMLHTTP")
        } catch (a) {
        }
    }

    function F() {
        return setTimeout(function () {
            Ub = b
        }, 0), Ub = $.now()
    }

    function G(a, b) {
        $.each(b, function (b, c) {
            for (var d = ($b[b] || []).concat($b["*"]), e = 0, f = d.length; e < f; e++)if (d[e].call(a, b, c))return
        })
    }

    function H(a, b, c) {
        var d, e = 0, g = Zb.length, h = $.Deferred().always(function () {
            delete i.elem
        }), i = function () {
            for (var b = Ub || F(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, e = 1 - d, f = 0, g = j.tweens.length; f < g; f++)j.tweens[f].run(e);
            return h.notifyWith(a, [j, e, c]), e < 1 && g ? c : (h.resolveWith(a, [j]), !1)
        }, j = h.promise({
            elem: a,
            props: $.extend({}, b),
            opts: $.extend(!0, {specialEasing: {}}, c),
            originalProperties: b,
            originalOptions: c,
            startTime: Ub || F(),
            duration: c.duration,
            tweens: [],
            createTween: function (b, c, d) {
                var e = $.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                return j.tweens.push(e), e
            },
            stop: function (b) {
                for (var c = 0, d = b ? j.tweens.length : 0; c < d; c++)j.tweens[c].run(1);
                return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]), this
            }
        }), k = j.props;
        for (I(k, j.opts.specialEasing); e < g; e++)if (d = Zb[e].call(j, a, k, j.opts))return d;
        return G(j, k), $.isFunction(j.opts.start) && j.opts.start.call(a, j), $.fx.timer($.extend(i, {
            anim: j,
            queue: j.opts.queue,
            elem: a
        })), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
    }

    function I(a, b) {
        var c, d, e, f, g;
        for (c in a)if (d = $.camelCase(c), e = b[d], f = a[c], $.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = $.cssHooks[d], g && "expand"in g) {
            f = g.expand(f), delete a[d];
            for (c in f)c in a || (a[c] = f[c], b[c] = e)
        } else b[d] = e
    }

    function J(a, b, c) {
        var d, e, f, g, h, i, j, k, l, m = this, n = a.style, o = {}, p = [], q = a.nodeType && r(a);
        c.queue || (k = $._queueHooks(a, "fx"), null == k.unqueued && (k.unqueued = 0, l = k.empty.fire, k.empty.fire = function () {
            k.unqueued || l()
        }), k.unqueued++, m.always(function () {
            m.always(function () {
                k.unqueued--, $.queue(a, "fx").length || k.empty.fire()
            })
        })), 1 === a.nodeType && ("height"in b || "width"in b) && (c.overflow = [n.overflow, n.overflowX, n.overflowY], "inline" === $.css(a, "display") && "none" === $.css(a, "float") && ($.support.inlineBlockNeedsLayout && "inline" !== w(a.nodeName) ? n.zoom = 1 : n.display = "inline-block")), c.overflow && (n.overflow = "hidden", $.support.shrinkWrapBlocks || m.done(function () {
            n.overflow = c.overflow[0], n.overflowX = c.overflow[1], n.overflowY = c.overflow[2]
        }));
        for (d in b)if (f = b[d], Wb.exec(f)) {
            if (delete b[d], i = i || "toggle" === f, f === (q ? "hide" : "show"))continue;
            p.push(d)
        }
        if (g = p.length) {
            h = $._data(a, "fxshow") || $._data(a, "fxshow", {}), "hidden"in h && (q = h.hidden), i && (h.hidden = !q), q ? $(a).show() : m.done(function () {
                $(a).hide()
            }), m.done(function () {
                var b;
                $.removeData(a, "fxshow", !0);
                for (b in o)$.style(a, b, o[b])
            });
            for (d = 0; d < g; d++)e = p[d], j = m.createTween(e, q ? h[e] : 0), o[e] = h[e] || $.style(a, e), e in h || (h[e] = j.start, q && (j.end = j.start, j.start = "width" === e || "height" === e ? 1 : 0))
        }
    }

    function K(a, b, c, d, e) {
        return new K.prototype.init(a, b, c, d, e)
    }

    function L(a, b) {
        var c, d = {height: a}, e = 0;
        for (b = b ? 1 : 0; e < 4; e += 2 - b)c = qb[e], d["margin" + c] = d["padding" + c] = a;
        return b && (d.opacity = d.width = a), d
    }

    function M(a) {
        return $.isWindow(a) ? a : 9 === a.nodeType && (a.defaultView || a.parentWindow)
    }

    var N, O, P = a.document, Q = a.location, R = a.navigator, S = a.jQuery, T = a.$, U = Array.prototype.push, V = Array.prototype.slice, W = Array.prototype.indexOf, X = Object.prototype.toString, Y = Object.prototype.hasOwnProperty, Z = String.prototype.trim, $ = function (a, b) {
        return new $.fn.init(a, b, N)
    }, _ = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source, aa = /\S/, ba = /\s+/, ca = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, da = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/, ea = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, fa = /^[\],:{}\s]*$/, ga = /(?:^|:|,)(?:\s*\[)+/g, ha = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, ia = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g, ja = /^-ms-/, ka = /-([\da-z])/gi, la = function (a, b) {
        return (b + "").toUpperCase()
    }, ma = function () {
        P.addEventListener ? (P.removeEventListener("DOMContentLoaded", ma, !1), $.ready()) : "complete" === P.readyState && (P.detachEvent("onreadystatechange", ma), $.ready())
    }, na = {};
    $.fn = $.prototype = {
        constructor: $, init: function (a, c, d) {
            var e, f, h;
            if (!a)return this;
            if (a.nodeType)return this.context = this[0] = a, this.length = 1, this;
            if ("string" == typeof a) {
                if (e = "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && a.length >= 3 ? [null, a, null] : da.exec(a), e && (e[1] || !c)) {
                    if (e[1])return c = c instanceof $ ? c[0] : c, h = c && c.nodeType ? c.ownerDocument || c : P, a = $.parseHTML(e[1], h, !0), ea.test(e[1]) && $.isPlainObject(c) && this.attr.call(a, c, !0), $.merge(this, a);
                    if (f = P.getElementById(e[2]), f && f.parentNode) {
                        if (f.id !== e[2])return d.find(a);
                        this.length = 1, this[0] = f
                    }
                    return this.context = P, this.selector = a, this
                }
                return !c || c.jquery ? (c || d).find(a) : this.constructor(c).find(a)
            }
            return $.isFunction(a) ? d.ready(a) : (a.selector !== b && (this.selector = a.selector, this.context = a.context), $.makeArray(a, this))
        }, selector: "", jquery: "1.8.3", length: 0, size: function () {
            return this.length
        }, toArray: function () {
            return V.call(this)
        }, get: function (a) {
            return null == a ? this.toArray() : a < 0 ? this[this.length + a] : this[a]
        }, pushStack: function (a, b, c) {
            var d = $.merge(this.constructor(), a);
            return d.prevObject = this, d.context = this.context, "find" === b ? d.selector = this.selector + (this.selector ? " " : "") + c : b && (d.selector = this.selector + "." + b + "(" + c + ")"), d
        }, each: function (a, b) {
            return $.each(this, a, b)
        }, ready: function (a) {
            return $.ready.promise().done(a), this
        }, eq: function (a) {
            return a = +a, a === -1 ? this.slice(a) : this.slice(a, a + 1)
        }, first: function () {
            return this.eq(0)
        }, last: function () {
            return this.eq(-1)
        }, slice: function () {
            return this.pushStack(V.apply(this, arguments), "slice", V.call(arguments).join(","))
        }, map: function (a) {
            return this.pushStack($.map(this, function (b, c) {
                return a.call(b, c, b)
            }))
        }, end: function () {
            return this.prevObject || this.constructor(null)
        }, push: U, sort: [].sort, splice: [].splice
    }, $.fn.init.prototype = $.fn, $.extend = $.fn.extend = function () {
        var a, c, d, e, f, g, h = arguments[0] || {}, i = 1, j = arguments.length, k = !1;
        for ("boolean" == typeof h && (k = h, h = arguments[1] || {}, i = 2), "object" != typeof h && !$.isFunction(h) && (h = {}), j === i && (h = this, --i); i < j; i++)if (null != (a = arguments[i]))for (c in a)d = h[c], e = a[c], h !== e && (k && e && ($.isPlainObject(e) || (f = $.isArray(e))) ? (f ? (f = !1, g = d && $.isArray(d) ? d : []) : g = d && $.isPlainObject(d) ? d : {}, h[c] = $.extend(k, g, e)) : e !== b && (h[c] = e));
        return h
    }, $.extend({
        noConflict: function (b) {
            return a.$ === $ && (a.$ = T), b && a.jQuery === $ && (a.jQuery = S), $
        }, isReady: !1, readyWait: 1, holdReady: function (a) {
            a ? $.readyWait++ : $.ready(!0)
        }, ready: function (a) {
            if (a === !0 ? !--$.readyWait : !$.isReady) {
                if (!P.body)return setTimeout($.ready, 1);
                $.isReady = !0, a !== !0 && --$.readyWait > 0 || (O.resolveWith(P, [$]), $.fn.trigger && $(P).trigger("ready").off("ready"))
            }
        }, isFunction: function (a) {
            return "function" === $.type(a)
        }, isArray: Array.isArray || function (a) {
            return "array" === $.type(a)
        }, isWindow: function (a) {
            return null != a && a == a.window
        }, isNumeric: function (a) {
            return !isNaN(parseFloat(a)) && isFinite(a)
        }, type: function (a) {
            return null == a ? String(a) : na[X.call(a)] || "object"
        }, isPlainObject: function (a) {
            if (!a || "object" !== $.type(a) || a.nodeType || $.isWindow(a))return !1;
            try {
                if (a.constructor && !Y.call(a, "constructor") && !Y.call(a.constructor.prototype, "isPrototypeOf"))return !1
            } catch (a) {
                return !1
            }
            var c;
            for (c in a);
            return c === b || Y.call(a, c)
        }, isEmptyObject: function (a) {
            var b;
            for (b in a)return !1;
            return !0
        }, error: function (a) {
            throw new Error(a)
        }, parseHTML: function (a, b, c) {
            var d;
            return a && "string" == typeof a ? ("boolean" == typeof b && (c = b, b = 0), b = b || P, (d = ea.exec(a)) ? [b.createElement(d[1])] : (d = $.buildFragment([a], b, c ? null : []), $.merge([], (d.cacheable ? $.clone(d.fragment) : d.fragment).childNodes))) : null
        }, parseJSON: function (b) {
            return b && "string" == typeof b ? (b = $.trim(b), a.JSON && a.JSON.parse ? a.JSON.parse(b) : fa.test(b.replace(ha, "@").replace(ia, "]").replace(ga, "")) ? new Function("return " + b)() : void $.error("Invalid JSON: " + b)) : null
        }, parseXML: function (c) {
            var d, e;
            if (!c || "string" != typeof c)return null;
            try {
                a.DOMParser ? (e = new DOMParser, d = e.parseFromString(c, "text/xml")) : (d = new ActiveXObject("Microsoft.XMLDOM"), d.async = "false", d.loadXML(c))
            } catch (a) {
                d = b
            }
            return (!d || !d.documentElement || d.getElementsByTagName("parsererror").length) && $.error("Invalid XML: " + c), d
        }, noop: function () {
        }, globalEval: function (b) {
            b && aa.test(b) && (a.execScript || function (b) {
                a.eval.call(a, b)
            })(b)
        }, camelCase: function (a) {
            return a.replace(ja, "ms-").replace(ka, la)
        }, nodeName: function (a, b) {
            return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
        }, each: function (a, c, d) {
            var e, f = 0, g = a.length, h = g === b || $.isFunction(a);
            if (d)if (h) {
                for (e in a)if (c.apply(a[e], d) === !1)break
            } else for (; f < g && c.apply(a[f++], d) !== !1;); else if (h) {
                for (e in a)if (c.call(a[e], e, a[e]) === !1)break
            } else for (; f < g && c.call(a[f], f, a[f++]) !== !1;);
            return a
        }, trim: Z && !Z.call("\ufeff ") ? function (a) {
            return null == a ? "" : Z.call(a)
        } : function (a) {
            return null == a ? "" : (a + "").replace(ca, "")
        }, makeArray: function (a, b) {
            var c, d = b || [];
            return null != a && (c = $.type(a), null == a.length || "string" === c || "function" === c || "regexp" === c || $.isWindow(a) ? U.call(d, a) : $.merge(d, a)), d
        }, inArray: function (a, b, c) {
            var d;
            if (b) {
                if (W)return W.call(b, a, c);
                for (d = b.length, c = c ? c < 0 ? Math.max(0, d + c) : c : 0; c < d; c++)if (c in b && b[c] === a)return c
            }
            return -1
        }, merge: function (a, c) {
            var d = c.length, e = a.length, f = 0;
            if ("number" == typeof d)for (; f < d; f++)a[e++] = c[f]; else for (; c[f] !== b;)a[e++] = c[f++];
            return a.length = e, a
        }, grep: function (a, b, c) {
            var d, e = [], f = 0, g = a.length;
            for (c = !!c; f < g; f++)d = !!b(a[f], f), c !== d && e.push(a[f]);
            return e
        }, map: function (a, c, d) {
            var e, f, g = [], h = 0, i = a.length, j = a instanceof $ || i !== b && "number" == typeof i && (i > 0 && a[0] && a[i - 1] || 0 === i || $.isArray(a));
            if (j)for (; h < i; h++)e = c(a[h], h, d), null != e && (g[g.length] = e); else for (f in a)e = c(a[f], f, d), null != e && (g[g.length] = e);
            return g.concat.apply([], g)
        }, guid: 1, proxy: function (a, c) {
            var d, e, f;
            return "string" == typeof c && (d = a[c], c = a, a = d), $.isFunction(a) ? (e = V.call(arguments, 2), f = function () {
                return a.apply(c, e.concat(V.call(arguments)))
            }, f.guid = a.guid = a.guid || $.guid++, f) : b
        }, access: function (a, c, d, e, f, g, h) {
            var i, j = null == d, k = 0, l = a.length;
            if (d && "object" == typeof d) {
                for (k in d)$.access(a, c, k, d[k], 1, g, e);
                f = 1
            } else if (e !== b) {
                if (i = h === b && $.isFunction(e), j && (i ? (i = c, c = function (a, b, c) {
                        return i.call($(a), c)
                    }) : (c.call(a, e), c = null)), c)for (; k < l; k++)c(a[k], d, i ? e.call(a[k], k, c(a[k], d)) : e, h);
                f = 1
            }
            return f ? a : j ? c.call(a) : l ? c(a[0], d) : g
        }, now: function () {
            return (new Date).getTime()
        }
    }), $.ready.promise = function (b) {
        if (!O)if (O = $.Deferred(), "complete" === P.readyState)setTimeout($.ready, 1); else if (P.addEventListener)P.addEventListener("DOMContentLoaded", ma, !1), a.addEventListener("load", $.ready, !1); else {
            P.attachEvent("onreadystatechange", ma), a.attachEvent("onload", $.ready);
            var c = !1;
            try {
                c = null == a.frameElement && P.documentElement
            } catch (a) {
            }
            c && c.doScroll && function a() {
                if (!$.isReady) {
                    try {
                        c.doScroll("left")
                    } catch (b) {
                        return setTimeout(a, 50)
                    }
                    $.ready()
                }
            }()
        }
        return O.promise(b)
    }, $.each("Boolean Number String Function Array Date RegExp Object".split(" "), function (a, b) {
        na["[object " + b + "]"] = b.toLowerCase()
    }), N = $(P);
    var oa = {};
    $.Callbacks = function (a) {
        a = "string" == typeof a ? oa[a] || c(a) : $.extend({}, a);
        var d, e, f, g, h, i, j = [], k = !a.once && [], l = function (b) {
            for (d = a.memory && b, e = !0, i = g || 0, g = 0, h = j.length, f = !0; j && i < h; i++)if (j[i].apply(b[0], b[1]) === !1 && a.stopOnFalse) {
                d = !1;
                break
            }
            f = !1, j && (k ? k.length && l(k.shift()) : d ? j = [] : m.disable())
        }, m = {
            add: function () {
                if (j) {
                    var b = j.length;
                    !function b(c) {
                        $.each(c, function (c, d) {
                            var e = $.type(d);
                            "function" === e ? (!a.unique || !m.has(d)) && j.push(d) : d && d.length && "string" !== e && b(d)
                        })
                    }(arguments), f ? h = j.length : d && (g = b, l(d))
                }
                return this
            }, remove: function () {
                return j && $.each(arguments, function (a, b) {
                    for (var c; (c = $.inArray(b, j, c)) > -1;)j.splice(c, 1), f && (c <= h && h--, c <= i && i--)
                }), this
            }, has: function (a) {
                return $.inArray(a, j) > -1
            }, empty: function () {
                return j = [], this
            }, disable: function () {
                return j = k = d = b, this
            }, disabled: function () {
                return !j
            }, lock: function () {
                return k = b, d || m.disable(), this
            }, locked: function () {
                return !k
            }, fireWith: function (a, b) {
                return b = b || [], b = [a, b.slice ? b.slice() : b], j && (!e || k) && (f ? k.push(b) : l(b)), this
            }, fire: function () {
                return m.fireWith(this, arguments), this
            }, fired: function () {
                return !!e
            }
        };
        return m
    }, $.extend({
        Deferred: function (a) {
            var b = [["resolve", "done", $.Callbacks("once memory"), "resolved"], ["reject", "fail", $.Callbacks("once memory"), "rejected"], ["notify", "progress", $.Callbacks("memory")]], c = "pending", d = {
                state: function () {
                    return c
                }, always: function () {
                    return e.done(arguments).fail(arguments), this
                }, then: function () {
                    var a = arguments;
                    return $.Deferred(function (c) {
                        $.each(b, function (b, d) {
                            var f = d[0], g = a[b];
                            e[d[1]]($.isFunction(g) ? function () {
                                var a = g.apply(this, arguments);
                                a && $.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f + "With"](this === e ? c : this, [a])
                            } : c[f])
                        }), a = null
                    }).promise()
                }, promise: function (a) {
                    return null != a ? $.extend(a, d) : d
                }
            }, e = {};
            return d.pipe = d.then, $.each(b, function (a, f) {
                var g = f[2], h = f[3];
                d[f[1]] = g.add, h && g.add(function () {
                    c = h
                }, b[1 ^ a][2].disable, b[2][2].lock), e[f[0]] = g.fire, e[f[0] + "With"] = g.fireWith
            }), d.promise(e), a && a.call(e, e), e
        }, when: function (a) {
            var h, i, j, b = 0, c = V.call(arguments), d = c.length, e = 1 !== d || a && $.isFunction(a.promise) ? d : 0, f = 1 === e ? a : $.Deferred(), g = function (a, b, c) {
                return function (d) {
                    b[a] = this, c[a] = arguments.length > 1 ? V.call(arguments) : d, c === h ? f.notifyWith(b, c) : --e || f.resolveWith(b, c)
                }
            };
            if (d > 1)for (h = new Array(d), i = new Array(d), j = new Array(d); b < d; b++)c[b] && $.isFunction(c[b].promise) ? c[b].promise().done(g(b, j, c)).fail(f.reject).progress(g(b, i, h)) : --e;
            return e || f.resolveWith(j, c), f.promise()
        }
    }), $.support = function () {
        var b, c, d, e, f, g, h, i, j, k, l, m = P.createElement("div");
        if (m.setAttribute("className", "t"), m.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", c = m.getElementsByTagName("*"), d = m.getElementsByTagName("a")[0], !c || !d || !c.length)return {};
        e = P.createElement("select"), f = e.appendChild(P.createElement("option")), g = m.getElementsByTagName("input")[0], d.style.cssText = "top:1px;float:left;opacity:.5", b = {
            leadingWhitespace: 3 === m.firstChild.nodeType,
            tbody: !m.getElementsByTagName("tbody").length,
            htmlSerialize: !!m.getElementsByTagName("link").length,
            style: /top/.test(d.getAttribute("style")),
            hrefNormalized: "/a" === d.getAttribute("href"),
            opacity: /^0.5/.test(d.style.opacity),
            cssFloat: !!d.style.cssFloat,
            checkOn: "on" === g.value,
            optSelected: f.selected,
            getSetAttribute: "t" !== m.className,
            enctype: !!P.createElement("form").enctype,
            html5Clone: "<:nav></:nav>" !== P.createElement("nav").cloneNode(!0).outerHTML,
            boxModel: "CSS1Compat" === P.compatMode,
            submitBubbles: !0,
            changeBubbles: !0,
            focusinBubbles: !1,
            deleteExpando: !0,
            noCloneEvent: !0,
            inlineBlockNeedsLayout: !1,
            shrinkWrapBlocks: !1,
            reliableMarginRight: !0,
            boxSizingReliable: !0,
            pixelPosition: !1
        }, g.checked = !0, b.noCloneChecked = g.cloneNode(!0).checked, e.disabled = !0, b.optDisabled = !f.disabled;
        try {
            delete m.test
        } catch (a) {
            b.deleteExpando = !1
        }
        if (!m.addEventListener && m.attachEvent && m.fireEvent && (m.attachEvent("onclick", l = function () {
                b.noCloneEvent = !1
            }), m.cloneNode(!0).fireEvent("onclick"), m.detachEvent("onclick", l)), g = P.createElement("input"), g.value = "t", g.setAttribute("type", "radio"), b.radioValue = "t" === g.value, g.setAttribute("checked", "checked"), g.setAttribute("name", "t"), m.appendChild(g), h = P.createDocumentFragment(), h.appendChild(m.lastChild), b.checkClone = h.cloneNode(!0).cloneNode(!0).lastChild.checked, b.appendChecked = g.checked, h.removeChild(g), h.appendChild(m), m.attachEvent)for (j in{
            submit: !0,
            change: !0,
            focusin: !0
        })i = "on" + j, k = i in m, k || (m.setAttribute(i, "return;"), k = "function" == typeof m[i]), b[j + "Bubbles"] = k;
        return $(function () {
            var c, d, e, f, g = "padding:0;margin:0;border:0;display:block;overflow:hidden;", h = P.getElementsByTagName("body")[0];
            h && (c = P.createElement("div"), c.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px", h.insertBefore(c, h.firstChild), d = P.createElement("div"), c.appendChild(d), d.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", e = d.getElementsByTagName("td"), e[0].style.cssText = "padding:0;margin:0;border:0;display:none", k = 0 === e[0].offsetHeight, e[0].style.display = "", e[1].style.display = "none", b.reliableHiddenOffsets = k && 0 === e[0].offsetHeight, d.innerHTML = "", d.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", b.boxSizing = 4 === d.offsetWidth, b.doesNotIncludeMarginInBodyOffset = 1 !== h.offsetTop, a.getComputedStyle && (b.pixelPosition = "1%" !== (a.getComputedStyle(d, null) || {}).top, b.boxSizingReliable = "4px" === (a.getComputedStyle(d, null) || {width: "4px"}).width, f = P.createElement("div"), f.style.cssText = d.style.cssText = g, f.style.marginRight = f.style.width = "0", d.style.width = "1px", d.appendChild(f), b.reliableMarginRight = !parseFloat((a.getComputedStyle(f, null) || {}).marginRight)), "undefined" != typeof d.style.zoom && (d.innerHTML = "", d.style.cssText = g + "width:1px;padding:1px;display:inline;zoom:1", b.inlineBlockNeedsLayout = 3 === d.offsetWidth, d.style.display = "block", d.style.overflow = "visible", d.innerHTML = "<div></div>", d.firstChild.style.width = "5px", b.shrinkWrapBlocks = 3 !== d.offsetWidth, c.style.zoom = 1), h.removeChild(c), c = d = e = f = null)
        }), h.removeChild(m), c = d = e = f = g = h = m = null, b
    }();
    var pa = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, qa = /([A-Z])/g;
    $.extend({
        cache: {},
        deletedIds: [],
        uuid: 0,
        expando: "jQuery" + ($.fn.jquery + Math.random()).replace(/\D/g, ""),
        noData: {embed: !0, object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000", applet: !0},
        hasData: function (a) {
            return a = a.nodeType ? $.cache[a[$.expando]] : a[$.expando], !!a && !e(a)
        },
        data: function (a, c, d, e) {
            if ($.acceptData(a)) {
                var f, g, h = $.expando, i = "string" == typeof c, j = a.nodeType, k = j ? $.cache : a, l = j ? a[h] : a[h] && h;
                if (l && k[l] && (e || k[l].data) || !i || d !== b)return l || (j ? a[h] = l = $.deletedIds.pop() || $.guid++ : l = h), k[l] || (k[l] = {}, j || (k[l].toJSON = $.noop)), "object" != typeof c && "function" != typeof c || (e ? k[l] = $.extend(k[l], c) : k[l].data = $.extend(k[l].data, c)), f = k[l], e || (f.data || (f.data = {}), f = f.data), d !== b && (f[$.camelCase(c)] = d), i ? (g = f[c], null == g && (g = f[$.camelCase(c)])) : g = f, g
            }
        },
        removeData: function (a, b, c) {
            if ($.acceptData(a)) {
                var d, f, g, h = a.nodeType, i = h ? $.cache : a, j = h ? a[$.expando] : $.expando;
                if (i[j]) {
                    if (b && (d = c ? i[j] : i[j].data)) {
                        $.isArray(b) || (b in d ? b = [b] : (b = $.camelCase(b), b = b in d ? [b] : b.split(" ")));
                        for (f = 0, g = b.length; f < g; f++)delete d[b[f]];
                        if (!(c ? e : $.isEmptyObject)(d))return
                    }
                    (c || (delete i[j].data, e(i[j]))) && (h ? $.cleanData([a], !0) : $.support.deleteExpando || i != i.window ? delete i[j] : i[j] = null)
                }
            }
        },
        _data: function (a, b, c) {
            return $.data(a, b, c, !0)
        },
        acceptData: function (a) {
            var b = a.nodeName && $.noData[a.nodeName.toLowerCase()];
            return !b || b !== !0 && a.getAttribute("classid") === b
        }
    }), $.fn.extend({
        data: function (a, c) {
            var e, f, g, h, i, j = this[0], k = 0, l = null;
            if (a === b) {
                if (this.length && (l = $.data(j), 1 === j.nodeType && !$._data(j, "parsedAttrs"))) {
                    for (g = j.attributes, i = g.length; k < i; k++)h = g[k].name, h.indexOf("data-") || (h = $.camelCase(h.substring(5)), d(j, h, l[h]));
                    $._data(j, "parsedAttrs", !0)
                }
                return l
            }
            return "object" == typeof a ? this.each(function () {
                $.data(this, a)
            }) : (e = a.split(".", 2), e[1] = e[1] ? "." + e[1] : "", f = e[1] + "!", $.access(this, function (c) {
                return c === b ? (l = this.triggerHandler("getData" + f, [e[0]]), l === b && j && (l = $.data(j, a), l = d(j, a, l)), l === b && e[1] ? this.data(e[0]) : l) : (e[1] = c, void this.each(function () {
                    var b = $(this);
                    b.triggerHandler("setData" + f, e), $.data(this, a, c), b.triggerHandler("changeData" + f, e)
                }))
            }, null, c, arguments.length > 1, null, !1))
        }, removeData: function (a) {
            return this.each(function () {
                $.removeData(this, a)
            })
        }
    }), $.extend({
        queue: function (a, b, c) {
            var d;
            if (a)return b = (b || "fx") + "queue", d = $._data(a, b), c && (!d || $.isArray(c) ? d = $._data(a, b, $.makeArray(c)) : d.push(c)), d || []
        }, dequeue: function (a, b) {
            b = b || "fx";
            var c = $.queue(a, b), d = c.length, e = c.shift(), f = $._queueHooks(a, b), g = function () {
                $.dequeue(a, b)
            };
            "inprogress" === e && (e = c.shift(), d--), e && ("fx" === b && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire()
        }, _queueHooks: function (a, b) {
            var c = b + "queueHooks";
            return $._data(a, c) || $._data(a, c, {
                    empty: $.Callbacks("once memory").add(function () {
                        $.removeData(a, b + "queue", !0), $.removeData(a, c, !0)
                    })
                })
        }
    }), $.fn.extend({
        queue: function (a, c) {
            var d = 2;
            return "string" != typeof a && (c = a, a = "fx", d--), arguments.length < d ? $.queue(this[0], a) : c === b ? this : this.each(function () {
                var b = $.queue(this, a, c);
                $._queueHooks(this, a), "fx" === a && "inprogress" !== b[0] && $.dequeue(this, a)
            })
        }, dequeue: function (a) {
            return this.each(function () {
                $.dequeue(this, a)
            })
        }, delay: function (a, b) {
            return a = $.fx ? $.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function (b, c) {
                var d = setTimeout(b, a);
                c.stop = function () {
                    clearTimeout(d)
                }
            })
        }, clearQueue: function (a) {
            return this.queue(a || "fx", [])
        }, promise: function (a, c) {
            var d, e = 1, f = $.Deferred(), g = this, h = this.length, i = function () {
                --e || f.resolveWith(g, [g])
            };
            for ("string" != typeof a && (c = a, a = b), a = a || "fx"; h--;)d = $._data(g[h], a + "queueHooks"), d && d.empty && (e++, d.empty.add(i));
            return i(), f.promise(c)
        }
    });
    var ra, sa, ta, ua = /[\t\r\n]/g, va = /\r/g, wa = /^(?:button|input)$/i, xa = /^(?:button|input|object|select|textarea)$/i, ya = /^a(?:rea|)$/i, za = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i, Aa = $.support.getSetAttribute;
    $.fn.extend({
        attr: function (a, b) {
            return $.access(this, $.attr, a, b, arguments.length > 1)
        }, removeAttr: function (a) {
            return this.each(function () {
                $.removeAttr(this, a)
            })
        }, prop: function (a, b) {
            return $.access(this, $.prop, a, b, arguments.length > 1)
        }, removeProp: function (a) {
            return a = $.propFix[a] || a, this.each(function () {
                try {
                    this[a] = b, delete this[a]
                } catch (a) {
                }
            })
        }, addClass: function (a) {
            var b, c, d, e, f, g, h;
            if ($.isFunction(a))return this.each(function (b) {
                $(this).addClass(a.call(this, b, this.className))
            });
            if (a && "string" == typeof a)for (b = a.split(ba), c = 0, d = this.length; c < d; c++)if (e = this[c], 1 === e.nodeType)if (e.className || 1 !== b.length) {
                for (f = " " + e.className + " ", g = 0, h = b.length; g < h; g++)f.indexOf(" " + b[g] + " ") < 0 && (f += b[g] + " ");
                e.className = $.trim(f)
            } else e.className = a;
            return this
        }, removeClass: function (a) {
            var c, d, e, f, g, h, i;
            if ($.isFunction(a))return this.each(function (b) {
                $(this).removeClass(a.call(this, b, this.className))
            });
            if (a && "string" == typeof a || a === b)for (c = (a || "").split(ba), h = 0, i = this.length; h < i; h++)if (e = this[h], 1 === e.nodeType && e.className) {
                for (d = (" " + e.className + " ").replace(ua, " "), f = 0, g = c.length; f < g; f++)for (; d.indexOf(" " + c[f] + " ") >= 0;)d = d.replace(" " + c[f] + " ", " ");
                e.className = a ? $.trim(d) : ""
            }
            return this
        }, toggleClass: function (a, b) {
            var c = typeof a, d = "boolean" == typeof b;
            return $.isFunction(a) ? this.each(function (c) {
                $(this).toggleClass(a.call(this, c, this.className, b), b)
            }) : this.each(function () {
                if ("string" === c)for (var e, f = 0, g = $(this), h = b, i = a.split(ba); e = i[f++];)h = d ? h : !g.hasClass(e), g[h ? "addClass" : "removeClass"](e); else"undefined" !== c && "boolean" !== c || (this.className && $._data(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : $._data(this, "__className__") || "")
            })
        }, hasClass: function (a) {
            for (var b = " " + a + " ", c = 0, d = this.length; c < d; c++)if (1 === this[c].nodeType && (" " + this[c].className + " ").replace(ua, " ").indexOf(b) >= 0)return !0;
            return !1
        }, val: function (a) {
            var c, d, e, f = this[0];
            {
                if (arguments.length)return e = $.isFunction(a), this.each(function (d) {
                    var f, g = $(this);
                    1 === this.nodeType && (f = e ? a.call(this, d, g.val()) : a, null == f ? f = "" : "number" == typeof f ? f += "" : $.isArray(f) && (f = $.map(f, function (a) {
                        return null == a ? "" : a + ""
                    })), c = $.valHooks[this.type] || $.valHooks[this.nodeName.toLowerCase()], c && "set"in c && c.set(this, f, "value") !== b || (this.value = f))
                });
                if (f)return c = $.valHooks[f.type] || $.valHooks[f.nodeName.toLowerCase()], c && "get"in c && (d = c.get(f, "value")) !== b ? d : (d = f.value, "string" == typeof d ? d.replace(va, "") : null == d ? "" : d)
            }
        }
    }), $.extend({
        valHooks: {
            option: {
                get: function (a) {
                    var b = a.attributes.value;
                    return !b || b.specified ? a.value : a.text
                }
            }, select: {
                get: function (a) {
                    for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || e < 0, g = f ? null : [], h = f ? e + 1 : d.length, i = e < 0 ? h : f ? e : 0; i < h; i++)if (c = d[i], (c.selected || i === e) && ($.support.optDisabled ? !c.disabled : null === c.getAttribute("disabled")) && (!c.parentNode.disabled || !$.nodeName(c.parentNode, "optgroup"))) {
                        if (b = $(c).val(), f)return b;
                        g.push(b)
                    }
                    return g
                }, set: function (a, b) {
                    var c = $.makeArray(b);
                    return $(a).find("option").each(function () {
                        this.selected = $.inArray($(this).val(), c) >= 0
                    }), c.length || (a.selectedIndex = -1), c
                }
            }
        },
        attrFn: {},
        attr: function (a, c, d, e) {
            var f, g, h, i = a.nodeType;
            if (a && 3 !== i && 8 !== i && 2 !== i)return e && $.isFunction($.fn[c]) ? $(a)[c](d) : "undefined" == typeof a.getAttribute ? $.prop(a, c, d) : (h = 1 !== i || !$.isXMLDoc(a), h && (c = c.toLowerCase(), g = $.attrHooks[c] || (za.test(c) ? sa : ra)), d !== b ? null === d ? void $.removeAttr(a, c) : g && "set"in g && h && (f = g.set(a, d, c)) !== b ? f : (a.setAttribute(c, d + ""), d) : g && "get"in g && h && null !== (f = g.get(a, c)) ? f : (f = a.getAttribute(c), null === f ? b : f))
        },
        removeAttr: function (a, b) {
            var c, d, e, f, g = 0;
            if (b && 1 === a.nodeType)for (d = b.split(ba); g < d.length; g++)e = d[g], e && (c = $.propFix[e] || e, f = za.test(e), f || $.attr(a, e, ""), a.removeAttribute(Aa ? e : c), f && c in a && (a[c] = !1))
        },
        attrHooks: {
            type: {
                set: function (a, b) {
                    if (wa.test(a.nodeName) && a.parentNode)$.error("type property can't be changed"); else if (!$.support.radioValue && "radio" === b && $.nodeName(a, "input")) {
                        var c = a.value;
                        return a.setAttribute("type", b), c && (a.value = c), b
                    }
                }
            }, value: {
                get: function (a, b) {
                    return ra && $.nodeName(a, "button") ? ra.get(a, b) : b in a ? a.value : null
                }, set: function (a, b, c) {
                    return ra && $.nodeName(a, "button") ? ra.set(a, b, c) : void(a.value = b)
                }
            }
        },
        propFix: {
            tabindex: "tabIndex",
            readonly: "readOnly",
            for: "htmlFor",
            class: "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder",
            contenteditable: "contentEditable"
        },
        prop: function (a, c, d) {
            var e, f, g, h = a.nodeType;
            if (a && 3 !== h && 8 !== h && 2 !== h)return g = 1 !== h || !$.isXMLDoc(a), g && (c = $.propFix[c] || c, f = $.propHooks[c]), d !== b ? f && "set"in f && (e = f.set(a, d, c)) !== b ? e : a[c] = d : f && "get"in f && null !== (e = f.get(a, c)) ? e : a[c]
        },
        propHooks: {
            tabIndex: {
                get: function (a) {
                    var c = a.getAttributeNode("tabindex");
                    return c && c.specified ? parseInt(c.value, 10) : xa.test(a.nodeName) || ya.test(a.nodeName) && a.href ? 0 : b
                }
            }
        }
    }), sa = {
        get: function (a, c) {
            var d, e = $.prop(a, c);
            return e === !0 || "boolean" != typeof e && (d = a.getAttributeNode(c)) && d.nodeValue !== !1 ? c.toLowerCase() : b
        }, set: function (a, b, c) {
            var d;
            return b === !1 ? $.removeAttr(a, c) : (d = $.propFix[c] || c, d in a && (a[d] = !0), a.setAttribute(c, c.toLowerCase())), c
        }
    }, Aa || (ta = {name: !0, id: !0, coords: !0}, ra = $.valHooks.button = {
        get: function (a, c) {
            var d;
            return d = a.getAttributeNode(c), d && (ta[c] ? "" !== d.value : d.specified) ? d.value : b
        }, set: function (a, b, c) {
            var d = a.getAttributeNode(c);
            return d || (d = P.createAttribute(c), a.setAttributeNode(d)), d.value = b + ""
        }
    }, $.each(["width", "height"], function (a, b) {
        $.attrHooks[b] = $.extend($.attrHooks[b], {
            set: function (a, c) {
                if ("" === c)return a.setAttribute(b, "auto"), c
            }
        })
    }), $.attrHooks.contenteditable = {
        get: ra.get, set: function (a, b, c) {
            "" === b && (b = "false"), ra.set(a, b, c)
        }
    }), $.support.hrefNormalized || $.each(["href", "src", "width", "height"], function (a, c) {
        $.attrHooks[c] = $.extend($.attrHooks[c], {
            get: function (a) {
                var d = a.getAttribute(c, 2);
                return null === d ? b : d
            }
        })
    }), $.support.style || ($.attrHooks.style = {
        get: function (a) {
            return a.style.cssText.toLowerCase() || b
        }, set: function (a, b) {
            return a.style.cssText = b + ""
        }
    }), $.support.optSelected || ($.propHooks.selected = $.extend($.propHooks.selected, {
        get: function (a) {
            var b = a.parentNode;
            return b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex), null
        }
    })), $.support.enctype || ($.propFix.enctype = "encoding"), $.support.checkOn || $.each(["radio", "checkbox"], function () {
        $.valHooks[this] = {
            get: function (a) {
                return null === a.getAttribute("value") ? "on" : a.value
            }
        }
    }), $.each(["radio", "checkbox"], function () {
        $.valHooks[this] = $.extend($.valHooks[this], {
            set: function (a, b) {
                if ($.isArray(b))return a.checked = $.inArray($(a).val(), b) >= 0
            }
        })
    });
    var Ba = /^(?:textarea|input|select)$/i, Ca = /^([^\.]*|)(?:\.(.+)|)$/, Da = /(?:^|\s)hover(\.\S+|)\b/, Ea = /^key/, Fa = /^(?:mouse|contextmenu)|click/, Ga = /^(?:focusinfocus|focusoutblur)$/, Ha = function (a) {
        return $.event.special.hover ? a : a.replace(Da, "mouseenter$1 mouseleave$1")
    };
    $.event = {
        add: function (a, c, d, e, f) {
            var g, h, i, j, k, l, m, n, o, p, q;
            if (3 !== a.nodeType && 8 !== a.nodeType && c && d && (g = $._data(a))) {
                for (d.handler && (o = d, d = o.handler, f = o.selector), d.guid || (d.guid = $.guid++), i = g.events, i || (g.events = i = {}), h = g.handle, h || (g.handle = h = function (a) {
                    return "undefined" == typeof $ || a && $.event.triggered === a.type ? b : $.event.dispatch.apply(h.elem, arguments)
                }, h.elem = a), c = $.trim(Ha(c)).split(" "), j = 0; j < c.length; j++)k = Ca.exec(c[j]) || [], l = k[1], m = (k[2] || "").split(".").sort(), q = $.event.special[l] || {}, l = (f ? q.delegateType : q.bindType) || l, q = $.event.special[l] || {}, n = $.extend({
                    type: l,
                    origType: k[1],
                    data: e,
                    handler: d,
                    guid: d.guid,
                    selector: f,
                    needsContext: f && $.expr.match.needsContext.test(f),
                    namespace: m.join(".")
                }, o), p = i[l], p || (p = i[l] = [], p.delegateCount = 0, q.setup && q.setup.call(a, e, m, h) !== !1 || (a.addEventListener ? a.addEventListener(l, h, !1) : a.attachEvent && a.attachEvent("on" + l, h))), q.add && (q.add.call(a, n), n.handler.guid || (n.handler.guid = d.guid)), f ? p.splice(p.delegateCount++, 0, n) : p.push(n), $.event.global[l] = !0;
                a = null
            }
        },
        global: {},
        remove: function (a, b, c, d, e) {
            var f, g, h, i, j, k, l, m, n, o, p, q = $.hasData(a) && $._data(a);
            if (q && (m = q.events)) {
                for (b = $.trim(Ha(b || "")).split(" "), f = 0; f < b.length; f++)if (g = Ca.exec(b[f]) || [], h = i = g[1], j = g[2], h) {
                    for (n = $.event.special[h] || {}, h = (d ? n.delegateType : n.bindType) || h, o = m[h] || [], k = o.length, j = j ? new RegExp("(^|\\.)" + j.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null, l = 0; l < o.length; l++)p = o[l], (e || i === p.origType) && (!c || c.guid === p.guid) && (!j || j.test(p.namespace)) && (!d || d === p.selector || "**" === d && p.selector) && (o.splice(l--, 1), p.selector && o.delegateCount--, n.remove && n.remove.call(a, p));
                    0 === o.length && k !== o.length && ((!n.teardown || n.teardown.call(a, j, q.handle) === !1) && $.removeEvent(a, h, q.handle), delete m[h])
                } else for (h in m)$.event.remove(a, h + b[f], c, d, !0);
                $.isEmptyObject(m) && (delete q.handle, $.removeData(a, "events", !0))
            }
        },
        customEvent: {getData: !0, setData: !0, changeData: !0},
        trigger: function (c, d, e, f) {
            if (!e || 3 !== e.nodeType && 8 !== e.nodeType) {
                var g, h, i, j, k, l, m, n, o, p, q = c.type || c, r = [];
                if (Ga.test(q + $.event.triggered))return;
                if (q.indexOf("!") >= 0 && (q = q.slice(0, -1), h = !0), q.indexOf(".") >= 0 && (r = q.split("."), q = r.shift(), r.sort()), (!e || $.event.customEvent[q]) && !$.event.global[q])return;
                if (c = "object" == typeof c ? c[$.expando] ? c : new $.Event(q, c) : new $.Event(q), c.type = q, c.isTrigger = !0, c.exclusive = h, c.namespace = r.join("."), c.namespace_re = c.namespace ? new RegExp("(^|\\.)" + r.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, l = q.indexOf(":") < 0 ? "on" + q : "", !e) {
                    g = $.cache;
                    for (i in g)g[i].events && g[i].events[q] && $.event.trigger(c, d, g[i].handle.elem, !0);
                    return
                }
                if (c.result = b, c.target || (c.target = e), d = null != d ? $.makeArray(d) : [], d.unshift(c), m = $.event.special[q] || {}, m.trigger && m.trigger.apply(e, d) === !1)return;
                if (o = [[e, m.bindType || q]], !f && !m.noBubble && !$.isWindow(e)) {
                    for (p = m.delegateType || q, j = Ga.test(p + q) ? e : e.parentNode, k = e; j; j = j.parentNode)o.push([j, p]), k = j;
                    k === (e.ownerDocument || P) && o.push([k.defaultView || k.parentWindow || a, p])
                }
                for (i = 0; i < o.length && !c.isPropagationStopped(); i++)j = o[i][0], c.type = o[i][1], n = ($._data(j, "events") || {})[c.type] && $._data(j, "handle"), n && n.apply(j, d), n = l && j[l], n && $.acceptData(j) && n.apply && n.apply(j, d) === !1 && c.preventDefault();
                return c.type = q, !f && !c.isDefaultPrevented() && (!m._default || m._default.apply(e.ownerDocument, d) === !1) && ("click" !== q || !$.nodeName(e, "a")) && $.acceptData(e) && l && e[q] && ("focus" !== q && "blur" !== q || 0 !== c.target.offsetWidth) && !$.isWindow(e) && (k = e[l], k && (e[l] = null), $.event.triggered = q, e[q](), $.event.triggered = b, k && (e[l] = k)), c.result
            }
        },
        dispatch: function (c) {
            c = $.event.fix(c || a.event);
            var d, e, f, g, h, i, j, k, l, n = ($._data(this, "events") || {})[c.type] || [], o = n.delegateCount, p = V.call(arguments), q = !c.exclusive && !c.namespace, r = $.event.special[c.type] || {}, s = [];
            if (p[0] = c, c.delegateTarget = this, !r.preDispatch || r.preDispatch.call(this, c) !== !1) {
                if (o && (!c.button || "click" !== c.type))for (f = c.target; f != this; f = f.parentNode || this)if (f.disabled !== !0 || "click" !== c.type) {
                    for (h = {}, j = [], d = 0; d < o; d++)k = n[d], l = k.selector, h[l] === b && (h[l] = k.needsContext ? $(l, this).index(f) >= 0 : $.find(l, this, null, [f]).length), h[l] && j.push(k);
                    j.length && s.push({elem: f, matches: j})
                }
                for (n.length > o && s.push({
                    elem: this,
                    matches: n.slice(o)
                }), d = 0; d < s.length && !c.isPropagationStopped(); d++)for (i = s[d], c.currentTarget = i.elem, e = 0; e < i.matches.length && !c.isImmediatePropagationStopped(); e++)k = i.matches[e], (q || !c.namespace && !k.namespace || c.namespace_re && c.namespace_re.test(k.namespace)) && (c.data = k.data, c.handleObj = k, g = (($.event.special[k.origType] || {}).handle || k.handler).apply(i.elem, p), g !== b && (c.result = g, g === !1 && (c.preventDefault(), c.stopPropagation())));
                return r.postDispatch && r.postDispatch.call(this, c), c.result
            }
        },
        props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "), filter: function (a, b) {
                return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), a
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function (a, c) {
                var d, e, f, g = c.button, h = c.fromElement;
                return null == a.pageX && null != c.clientX && (d = a.target.ownerDocument || P, e = d.documentElement, f = d.body, a.pageX = c.clientX + (e && e.scrollLeft || f && f.scrollLeft || 0) - (e && e.clientLeft || f && f.clientLeft || 0), a.pageY = c.clientY + (e && e.scrollTop || f && f.scrollTop || 0) - (e && e.clientTop || f && f.clientTop || 0)), !a.relatedTarget && h && (a.relatedTarget = h === a.target ? c.toElement : h), !a.which && g !== b && (a.which = 1 & g ? 1 : 2 & g ? 3 : 4 & g ? 2 : 0), a
            }
        },
        fix: function (a) {
            if (a[$.expando])return a;
            var b, c, d = a, e = $.event.fixHooks[a.type] || {}, f = e.props ? this.props.concat(e.props) : this.props;
            for (a = $.Event(d), b = f.length; b;)c = f[--b], a[c] = d[c];
            return a.target || (a.target = d.srcElement || P), 3 === a.target.nodeType && (a.target = a.target.parentNode), a.metaKey = !!a.metaKey, e.filter ? e.filter(a, d) : a
        },
        special: {
            load: {noBubble: !0},
            focus: {delegateType: "focusin"},
            blur: {delegateType: "focusout"},
            beforeunload: {
                setup: function (a, b, c) {
                    $.isWindow(this) && (this.onbeforeunload = c)
                }, teardown: function (a, b) {
                    this.onbeforeunload === b && (this.onbeforeunload = null)
                }
            }
        },
        simulate: function (a, b, c, d) {
            var e = $.extend(new $.Event, c, {type: a, isSimulated: !0, originalEvent: {}});
            d ? $.event.trigger(e, null, b) : $.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault()
        }
    }, $.event.handle = $.event.dispatch, $.removeEvent = P.removeEventListener ? function (a, b, c) {
        a.removeEventListener && a.removeEventListener(b, c, !1)
    } : function (a, b, c) {
        var d = "on" + b;
        a.detachEvent && ("undefined" == typeof a[d] && (a[d] = null), a.detachEvent(d, c))
    }, $.Event = function (a, b) {
        return this instanceof $.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || a.returnValue === !1 || a.getPreventDefault && a.getPreventDefault() ? g : f) : this.type = a, b && $.extend(this, b), this.timeStamp = a && a.timeStamp || $.now(), this[$.expando] = !0, void 0) : new $.Event(a, b)
    }, $.Event.prototype = {
        preventDefault: function () {
            this.isDefaultPrevented = g;
            var a = this.originalEvent;
            a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
        }, stopPropagation: function () {
            this.isPropagationStopped = g;
            var a = this.originalEvent;
            a && (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0)
        }, stopImmediatePropagation: function () {
            this.isImmediatePropagationStopped = g, this.stopPropagation()
        }, isDefaultPrevented: f, isPropagationStopped: f, isImmediatePropagationStopped: f
    }, $.each({mouseenter: "mouseover", mouseleave: "mouseout"}, function (a, b) {
        $.event.special[a] = {
            delegateType: b, bindType: b, handle: function (a) {
                var c, d = this, e = a.relatedTarget, f = a.handleObj;
                f.selector;
                return e && (e === d || $.contains(d, e)) || (a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b), c
            }
        }
    }), $.support.submitBubbles || ($.event.special.submit = {
        setup: function () {
            return !$.nodeName(this, "form") && void $.event.add(this, "click._submit keypress._submit", function (a) {
                    var c = a.target, d = $.nodeName(c, "input") || $.nodeName(c, "button") ? c.form : b;
                    d && !$._data(d, "_submit_attached") && ($.event.add(d, "submit._submit", function (a) {
                        a._submit_bubble = !0;
                    }), $._data(d, "_submit_attached", !0))
                })
        }, postDispatch: function (a) {
            a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && $.event.simulate("submit", this.parentNode, a, !0))
        }, teardown: function () {
            return !$.nodeName(this, "form") && void $.event.remove(this, "._submit")
        }
    }), $.support.changeBubbles || ($.event.special.change = {
        setup: function () {
            return Ba.test(this.nodeName) ? ("checkbox" !== this.type && "radio" !== this.type || ($.event.add(this, "propertychange._change", function (a) {
                "checked" === a.originalEvent.propertyName && (this._just_changed = !0)
            }), $.event.add(this, "click._change", function (a) {
                this._just_changed && !a.isTrigger && (this._just_changed = !1), $.event.simulate("change", this, a, !0)
            })), !1) : void $.event.add(this, "beforeactivate._change", function (a) {
                var b = a.target;
                Ba.test(b.nodeName) && !$._data(b, "_change_attached") && ($.event.add(b, "change._change", function (a) {
                    this.parentNode && !a.isSimulated && !a.isTrigger && $.event.simulate("change", this.parentNode, a, !0)
                }), $._data(b, "_change_attached", !0))
            })
        }, handle: function (a) {
            var b = a.target;
            if (this !== b || a.isSimulated || a.isTrigger || "radio" !== b.type && "checkbox" !== b.type)return a.handleObj.handler.apply(this, arguments)
        }, teardown: function () {
            return $.event.remove(this, "._change"), !Ba.test(this.nodeName)
        }
    }), $.support.focusinBubbles || $.each({focus: "focusin", blur: "focusout"}, function (a, b) {
        var c = 0, d = function (a) {
            $.event.simulate(b, a.target, $.event.fix(a), !0)
        };
        $.event.special[b] = {
            setup: function () {
                0 === c++ && P.addEventListener(a, d, !0)
            }, teardown: function () {
                0 === --c && P.removeEventListener(a, d, !0)
            }
        }
    }), $.fn.extend({
        on: function (a, c, d, e, g) {
            var h, i;
            if ("object" == typeof a) {
                "string" != typeof c && (d = d || c, c = b);
                for (i in a)this.on(i, c, d, a[i], g);
                return this
            }
            if (null == d && null == e ? (e = c, d = c = b) : null == e && ("string" == typeof c ? (e = d, d = b) : (e = d, d = c, c = b)), e === !1)e = f; else if (!e)return this;
            return 1 === g && (h = e, e = function (a) {
                return $().off(a), h.apply(this, arguments)
            }, e.guid = h.guid || (h.guid = $.guid++)), this.each(function () {
                $.event.add(this, a, e, d, c)
            })
        }, one: function (a, b, c, d) {
            return this.on(a, b, c, d, 1)
        }, off: function (a, c, d) {
            var e, g;
            if (a && a.preventDefault && a.handleObj)return e = a.handleObj, $(a.delegateTarget).off(e.namespace ? e.origType + "." + e.namespace : e.origType, e.selector, e.handler), this;
            if ("object" == typeof a) {
                for (g in a)this.off(g, c, a[g]);
                return this
            }
            return c !== !1 && "function" != typeof c || (d = c, c = b), d === !1 && (d = f), this.each(function () {
                $.event.remove(this, a, d, c)
            })
        }, bind: function (a, b, c) {
            return this.on(a, null, b, c)
        }, unbind: function (a, b) {
            return this.off(a, null, b)
        }, live: function (a, b, c) {
            return $(this.context).on(a, this.selector, b, c), this
        }, die: function (a, b) {
            return $(this.context).off(a, this.selector || "**", b), this
        }, delegate: function (a, b, c, d) {
            return this.on(b, a, c, d)
        }, undelegate: function (a, b, c) {
            return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
        }, trigger: function (a, b) {
            return this.each(function () {
                $.event.trigger(a, b, this)
            })
        }, triggerHandler: function (a, b) {
            if (this[0])return $.event.trigger(a, b, this[0], !0)
        }, toggle: function (a) {
            var b = arguments, c = a.guid || $.guid++, d = 0, e = function (c) {
                var e = ($._data(this, "lastToggle" + a.guid) || 0) % d;
                return $._data(this, "lastToggle" + a.guid, e + 1), c.preventDefault(), b[e].apply(this, arguments) || !1
            };
            for (e.guid = c; d < b.length;)b[d++].guid = c;
            return this.click(e)
        }, hover: function (a, b) {
            return this.mouseenter(a).mouseleave(b || a)
        }
    }), $.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (a, b) {
        $.fn[b] = function (a, c) {
            return null == c && (c = a, a = null), arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
        }, Ea.test(b) && ($.event.fixHooks[b] = $.event.keyHooks), Fa.test(b) && ($.event.fixHooks[b] = $.event.mouseHooks)
    }), function (a, b) {
        function c(a, b, c, d) {
            c = c || [], b = b || F;
            var e, f, g, h, i = b.nodeType;
            if (!a || "string" != typeof a)return c;
            if (1 !== i && 9 !== i)return [];
            if (g = v(b), !g && !d && (e = ca.exec(a)))if (h = e[1]) {
                if (9 === i) {
                    if (f = b.getElementById(h), !f || !f.parentNode)return c;
                    if (f.id === h)return c.push(f), c
                } else if (b.ownerDocument && (f = b.ownerDocument.getElementById(h)) && w(b, f) && f.id === h)return c.push(f), c
            } else {
                if (e[2])return K.apply(c, L.call(b.getElementsByTagName(a), 0)), c;
                if ((h = e[3]) && oa && b.getElementsByClassName)return K.apply(c, L.call(b.getElementsByClassName(h), 0)), c
            }
            return p(a.replace(Z, "$1"), b, c, d, g)
        }

        function d(a) {
            return function (b) {
                var c = b.nodeName.toLowerCase();
                return "input" === c && b.type === a
            }
        }

        function e(a) {
            return function (b) {
                var c = b.nodeName.toLowerCase();
                return ("input" === c || "button" === c) && b.type === a
            }
        }

        function f(a) {
            return N(function (b) {
                return b = +b, N(function (c, d) {
                    for (var e, f = a([], c.length, b), g = f.length; g--;)c[e = f[g]] && (c[e] = !(d[e] = c[e]))
                })
            })
        }

        function g(a, b, c) {
            if (a === b)return c;
            for (var d = a.nextSibling; d;) {
                if (d === b)return -1;
                d = d.nextSibling
            }
            return 1
        }

        function h(a, b) {
            var d, e, f, g, h, i, j, k = Q[D][a + " "];
            if (k)return b ? 0 : k.slice(0);
            for (h = a, i = [], j = t.preFilter; h;) {
                d && !(e = _.exec(h)) || (e && (h = h.slice(e[0].length) || h), i.push(f = [])), d = !1, (e = aa.exec(h)) && (f.push(d = new E(e.shift())), h = h.slice(d.length), d.type = e[0].replace(Z, " "));
                for (g in t.filter)(e = ja[g].exec(h)) && (!j[g] || (e = j[g](e))) && (f.push(d = new E(e.shift())), h = h.slice(d.length), d.type = g, d.matches = e);
                if (!d)break
            }
            return b ? h.length : h ? c.error(a) : Q(a, i).slice(0)
        }

        function i(a, b, c) {
            var d = b.dir, e = c && "parentNode" === b.dir, f = I++;
            return b.first ? function (b, c, f) {
                for (; b = b[d];)if (e || 1 === b.nodeType)return a(b, c, f)
            } : function (b, c, g) {
                if (g) {
                    for (; b = b[d];)if ((e || 1 === b.nodeType) && a(b, c, g))return b
                } else for (var h, i = H + " " + f + " ", j = i + r; b = b[d];)if (e || 1 === b.nodeType) {
                    if ((h = b[D]) === j)return b.sizset;
                    if ("string" == typeof h && 0 === h.indexOf(i)) {
                        if (b.sizset)return b
                    } else {
                        if (b[D] = j, a(b, c, g))return b.sizset = !0, b;
                        b.sizset = !1
                    }
                }
            }
        }

        function j(a) {
            return a.length > 1 ? function (b, c, d) {
                for (var e = a.length; e--;)if (!a[e](b, c, d))return !1;
                return !0
            } : a[0]
        }

        function k(a, b, c, d, e) {
            for (var f, g = [], h = 0, i = a.length, j = null != b; h < i; h++)(f = a[h]) && (c && !c(f, d, e) || (g.push(f), j && b.push(h)));
            return g
        }

        function l(a, b, c, d, e, f) {
            return d && !d[D] && (d = l(d)), e && !e[D] && (e = l(e, f)), N(function (f, g, h, i) {
                var j, l, m, n = [], p = [], q = g.length, r = f || o(b || "*", h.nodeType ? [h] : h, []), s = !a || !f && b ? r : k(r, n, a, h, i), t = c ? e || (f ? a : q || d) ? [] : g : s;
                if (c && c(s, t, h, i), d)for (j = k(t, p), d(j, [], h, i), l = j.length; l--;)(m = j[l]) && (t[p[l]] = !(s[p[l]] = m));
                if (f) {
                    if (e || a) {
                        if (e) {
                            for (j = [], l = t.length; l--;)(m = t[l]) && j.push(s[l] = m);
                            e(null, t = [], j, i)
                        }
                        for (l = t.length; l--;)(m = t[l]) && (j = e ? M.call(f, m) : n[l]) > -1 && (f[j] = !(g[j] = m))
                    }
                } else t = k(t === g ? t.splice(q, t.length) : t), e ? e(null, g, t, i) : K.apply(g, t)
            })
        }

        function m(a) {
            for (var b, c, d, e = a.length, f = t.relative[a[0].type], g = f || t.relative[" "], h = f ? 1 : 0, k = i(function (a) {
                return a === b
            }, g, !0), n = i(function (a) {
                return M.call(b, a) > -1
            }, g, !0), o = [function (a, c, d) {
                return !f && (d || c !== A) || ((b = c).nodeType ? k(a, c, d) : n(a, c, d))
            }]; h < e; h++)if (c = t.relative[a[h].type])o = [i(j(o), c)]; else {
                if (c = t.filter[a[h].type].apply(null, a[h].matches), c[D]) {
                    for (d = ++h; d < e && !t.relative[a[d].type]; d++);
                    return l(h > 1 && j(o), h > 1 && a.slice(0, h - 1).join("").replace(Z, "$1"), c, h < d && m(a.slice(h, d)), d < e && m(a = a.slice(d)), d < e && a.join(""))
                }
                o.push(c)
            }
            return j(o)
        }

        function n(a, b) {
            var d = b.length > 0, e = a.length > 0, f = function (g, h, i, j, l) {
                var m, n, o, p = [], q = 0, s = "0", u = g && [], v = null != l, w = A, x = g || e && t.find.TAG("*", l && h.parentNode || h), y = H += null == w ? 1 : Math.E;
                for (v && (A = h !== F && h, r = f.el); null != (m = x[s]); s++) {
                    if (e && m) {
                        for (n = 0; o = a[n]; n++)if (o(m, h, i)) {
                            j.push(m);
                            break
                        }
                        v && (H = y, r = ++f.el)
                    }
                    d && ((m = !o && m) && q--, g && u.push(m))
                }
                if (q += s, d && s !== q) {
                    for (n = 0; o = b[n]; n++)o(u, p, h, i);
                    if (g) {
                        if (q > 0)for (; s--;)!u[s] && !p[s] && (p[s] = J.call(j));
                        p = k(p)
                    }
                    K.apply(j, p), v && !g && p.length > 0 && q + b.length > 1 && c.uniqueSort(j)
                }
                return v && (H = y, A = w), u
            };
            return f.el = 0, d ? N(f) : f
        }

        function o(a, b, d) {
            for (var e = 0, f = b.length; e < f; e++)c(a, b[e], d);
            return d
        }

        function p(a, b, c, d, e) {
            var f, g, i, j, k, l = h(a);
            l.length;
            if (!d && 1 === l.length) {
                if (g = l[0] = l[0].slice(0), g.length > 2 && "ID" === (i = g[0]).type && 9 === b.nodeType && !e && t.relative[g[1].type]) {
                    if (b = t.find.ID(i.matches[0].replace(ia, ""), b, e)[0], !b)return c;
                    a = a.slice(g.shift().length)
                }
                for (f = ja.POS.test(a) ? -1 : g.length - 1; f >= 0 && (i = g[f], !t.relative[j = i.type]); f--)if ((k = t.find[j]) && (d = k(i.matches[0].replace(ia, ""), ea.test(g[0].type) && b.parentNode || b, e))) {
                    if (g.splice(f, 1), a = d.length && g.join(""), !a)return K.apply(c, L.call(d, 0)), c;
                    break
                }
            }
            return x(a, l)(d, b, e, c, ea.test(a)), c
        }

        function q() {
        }

        var r, s, t, u, v, w, x, y, z, A, B = !0, C = "undefined", D = ("sizcache" + Math.random()).replace(".", ""), E = String, F = a.document, G = F.documentElement, H = 0, I = 0, J = [].pop, K = [].push, L = [].slice, M = [].indexOf || function (a) {
                for (var b = 0, c = this.length; b < c; b++)if (this[b] === a)return b;
                return -1
            }, N = function (a, b) {
            return a[D] = null == b || b, a
        }, O = function () {
            var a = {}, b = [];
            return N(function (c, d) {
                return b.push(c) > t.cacheLength && delete a[b.shift()], a[c + " "] = d
            }, a)
        }, P = O(), Q = O(), R = O(), S = "[\\x20\\t\\r\\n\\f]", T = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+", U = T.replace("w", "w#"), V = "([*^$|!~]?=)", W = "\\[" + S + "*(" + T + ")" + S + "*(?:" + V + S + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + U + ")|)|)" + S + "*\\]", X = ":(" + T + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + W + ")|[^:]|\\\\.)*|.*))\\)|)", Y = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + S + "*((?:-\\d)?\\d*)" + S + "*\\)|)(?=[^-]|$)", Z = new RegExp("^" + S + "+|((?:^|[^\\\\])(?:\\\\.)*)" + S + "+$", "g"), _ = new RegExp("^" + S + "*," + S + "*"), aa = new RegExp("^" + S + "*([\\x20\\t\\r\\n\\f>+~])" + S + "*"), ba = new RegExp(X), ca = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/, ea = /[\x20\t\r\n\f]*[+~]/, ga = /h\d/i, ha = /input|select|textarea|button/i, ia = /\\(?!\\)/g, ja = {
            ID: new RegExp("^#(" + T + ")"),
            CLASS: new RegExp("^\\.(" + T + ")"),
            NAME: new RegExp("^\\[name=['\"]?(" + T + ")['\"]?\\]"),
            TAG: new RegExp("^(" + T.replace("w", "w*") + ")"),
            ATTR: new RegExp("^" + W),
            PSEUDO: new RegExp("^" + X),
            POS: new RegExp(Y, "i"),
            CHILD: new RegExp("^:(only|nth|first|last)-child(?:\\(" + S + "*(even|odd|(([+-]|)(\\d*)n|)" + S + "*(?:([+-]|)" + S + "*(\\d+)|))" + S + "*\\)|)", "i"),
            needsContext: new RegExp("^" + S + "*[>+~]|" + Y, "i")
        }, ka = function (a) {
            var b = F.createElement("div");
            try {
                return a(b)
            } catch (a) {
                return !1
            } finally {
                b = null
            }
        }, la = ka(function (a) {
            return a.appendChild(F.createComment("")), !a.getElementsByTagName("*").length
        }), ma = ka(function (a) {
            return a.innerHTML = "<a href='#'></a>", a.firstChild && typeof a.firstChild.getAttribute !== C && "#" === a.firstChild.getAttribute("href")
        }), na = ka(function (a) {
            a.innerHTML = "<select></select>";
            var b = typeof a.lastChild.getAttribute("multiple");
            return "boolean" !== b && "string" !== b
        }), oa = ka(function (a) {
            return a.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>", !(!a.getElementsByClassName || !a.getElementsByClassName("e").length) && (a.lastChild.className = "e", 2 === a.getElementsByClassName("e").length)
        }), pa = ka(function (a) {
            a.id = D + 0, a.innerHTML = "<a name='" + D + "'></a><div name='" + D + "'></div>", G.insertBefore(a, G.firstChild);
            var b = F.getElementsByName && F.getElementsByName(D).length === 2 + F.getElementsByName(D + 0).length;
            return s = !F.getElementById(D), G.removeChild(a), b
        });
        try {
            L.call(G.childNodes, 0)[0].nodeType
        } catch (a) {
            L = function (a) {
                for (var b, c = []; b = this[a]; a++)c.push(b);
                return c
            }
        }
        c.matches = function (a, b) {
            return c(a, null, null, b)
        }, c.matchesSelector = function (a, b) {
            return c(b, null, null, [a]).length > 0
        }, u = c.getText = function (a) {
            var b, c = "", d = 0, e = a.nodeType;
            if (e) {
                if (1 === e || 9 === e || 11 === e) {
                    if ("string" == typeof a.textContent)return a.textContent;
                    for (a = a.firstChild; a; a = a.nextSibling)c += u(a)
                } else if (3 === e || 4 === e)return a.nodeValue
            } else for (; b = a[d]; d++)c += u(b);
            return c
        }, v = c.isXML = function (a) {
            var b = a && (a.ownerDocument || a).documentElement;
            return !!b && "HTML" !== b.nodeName
        }, w = c.contains = G.contains ? function (a, b) {
            var c = 9 === a.nodeType ? a.documentElement : a, d = b && b.parentNode;
            return a === d || !!(d && 1 === d.nodeType && c.contains && c.contains(d))
        } : G.compareDocumentPosition ? function (a, b) {
            return b && !!(16 & a.compareDocumentPosition(b))
        } : function (a, b) {
            for (; b = b.parentNode;)if (b === a)return !0;
            return !1
        }, c.attr = function (a, b) {
            var c, d = v(a);
            return d || (b = b.toLowerCase()), (c = t.attrHandle[b]) ? c(a) : d || na ? a.getAttribute(b) : (c = a.getAttributeNode(b), c ? "boolean" == typeof a[b] ? a[b] ? b : null : c.specified ? c.value : null : null)
        }, t = c.selectors = {
            cacheLength: 50,
            createPseudo: N,
            match: ja,
            attrHandle: ma ? {} : {
                href: function (a) {
                    return a.getAttribute("href", 2)
                }, type: function (a) {
                    return a.getAttribute("type")
                }
            },
            find: {
                ID: s ? function (a, b, c) {
                    if (typeof b.getElementById !== C && !c) {
                        var d = b.getElementById(a);
                        return d && d.parentNode ? [d] : []
                    }
                } : function (a, c, d) {
                    if (typeof c.getElementById !== C && !d) {
                        var e = c.getElementById(a);
                        return e ? e.id === a || typeof e.getAttributeNode !== C && e.getAttributeNode("id").value === a ? [e] : b : []
                    }
                }, TAG: la ? function (a, b) {
                    if (typeof b.getElementsByTagName !== C)return b.getElementsByTagName(a)
                } : function (a, b) {
                    var c = b.getElementsByTagName(a);
                    if ("*" === a) {
                        for (var d, e = [], f = 0; d = c[f]; f++)1 === d.nodeType && e.push(d);
                        return e
                    }
                    return c
                }, NAME: pa && function (a, b) {
                    if (typeof b.getElementsByName !== C)return b.getElementsByName(name)
                }, CLASS: oa && function (a, b, c) {
                    if (typeof b.getElementsByClassName !== C && !c)return b.getElementsByClassName(a)
                }
            },
            relative: {
                ">": {dir: "parentNode", first: !0},
                " ": {dir: "parentNode"},
                "+": {dir: "previousSibling", first: !0},
                "~": {dir: "previousSibling"}
            },
            preFilter: {
                ATTR: function (a) {
                    return a[1] = a[1].replace(ia, ""), a[3] = (a[4] || a[5] || "").replace(ia, ""), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4)
                }, CHILD: function (a) {
                    return a[1] = a[1].toLowerCase(), "nth" === a[1] ? (a[2] || c.error(a[0]), a[3] = +(a[3] ? a[4] + (a[5] || 1) : 2 * ("even" === a[2] || "odd" === a[2])), a[4] = +(a[6] + a[7] || "odd" === a[2])) : a[2] && c.error(a[0]), a
                }, PSEUDO: function (a) {
                    var b, c;
                    return ja.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[3] : (b = a[4]) && (ba.test(b) && (c = h(b, !0)) && (c = b.indexOf(")", b.length - c) - b.length) && (b = b.slice(0, c), a[0] = a[0].slice(0, c)), a[2] = b), a.slice(0, 3))
                }
            },
            filter: {
                ID: s ? function (a) {
                    return a = a.replace(ia, ""), function (b) {
                        return b.getAttribute("id") === a
                    }
                } : function (a) {
                    return a = a.replace(ia, ""), function (b) {
                        var c = typeof b.getAttributeNode !== C && b.getAttributeNode("id");
                        return c && c.value === a
                    }
                }, TAG: function (a) {
                    return "*" === a ? function () {
                        return !0
                    } : (a = a.replace(ia, "").toLowerCase(), function (b) {
                        return b.nodeName && b.nodeName.toLowerCase() === a
                    })
                }, CLASS: function (a) {
                    var b = P[D][a + " "];
                    return b || (b = new RegExp("(^|" + S + ")" + a + "(" + S + "|$)")) && P(a, function (a) {
                            return b.test(a.className || typeof a.getAttribute !== C && a.getAttribute("class") || "")
                        })
                }, ATTR: function (a, b, d) {
                    return function (e, f) {
                        var g = c.attr(e, a);
                        return null == g ? "!=" === b : !b || (g += "", "=" === b ? g === d : "!=" === b ? g !== d : "^=" === b ? d && 0 === g.indexOf(d) : "*=" === b ? d && g.indexOf(d) > -1 : "$=" === b ? d && g.substr(g.length - d.length) === d : "~=" === b ? (" " + g + " ").indexOf(d) > -1 : "|=" === b && (g === d || g.substr(0, d.length + 1) === d + "-"))
                    }
                }, CHILD: function (a, b, c, d) {
                    return "nth" === a ? function (a) {
                        var b, e, f = a.parentNode;
                        if (1 === c && 0 === d)return !0;
                        if (f)for (e = 0, b = f.firstChild; b && (1 !== b.nodeType || (e++, a !== b)); b = b.nextSibling);
                        return e -= d, e === c || e % c === 0 && e / c >= 0
                    } : function (b) {
                        var c = b;
                        switch (a) {
                            case"only":
                            case"first":
                                for (; c = c.previousSibling;)if (1 === c.nodeType)return !1;
                                if ("first" === a)return !0;
                                c = b;
                            case"last":
                                for (; c = c.nextSibling;)if (1 === c.nodeType)return !1;
                                return !0
                        }
                    }
                }, PSEUDO: function (a, b) {
                    var d, e = t.pseudos[a] || t.setFilters[a.toLowerCase()] || c.error("unsupported pseudo: " + a);
                    return e[D] ? e(b) : e.length > 1 ? (d = [a, a, "", b], t.setFilters.hasOwnProperty(a.toLowerCase()) ? N(function (a, c) {
                        for (var d, f = e(a, b), g = f.length; g--;)d = M.call(a, f[g]), a[d] = !(c[d] = f[g])
                    }) : function (a) {
                        return e(a, 0, d)
                    }) : e
                }
            },
            pseudos: {
                not: N(function (a) {
                    var b = [], c = [], d = x(a.replace(Z, "$1"));
                    return d[D] ? N(function (a, b, c, e) {
                        for (var f, g = d(a, null, e, []), h = a.length; h--;)(f = g[h]) && (a[h] = !(b[h] = f))
                    }) : function (a, e, f) {
                        return b[0] = a, d(b, null, f, c), !c.pop()
                    }
                }),
                has: N(function (a) {
                    return function (b) {
                        return c(a, b).length > 0
                    }
                }),
                contains: N(function (a) {
                    return function (b) {
                        return (b.textContent || b.innerText || u(b)).indexOf(a) > -1
                    }
                }),
                enabled: function (a) {
                    return a.disabled === !1
                },
                disabled: function (a) {
                    return a.disabled === !0
                },
                checked: function (a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && !!a.checked || "option" === b && !!a.selected
                },
                selected: function (a) {
                    return a.parentNode && a.parentNode.selectedIndex, a.selected === !0
                },
                parent: function (a) {
                    return !t.pseudos.empty(a)
                },
                empty: function (a) {
                    var b;
                    for (a = a.firstChild; a;) {
                        if (a.nodeName > "@" || 3 === (b = a.nodeType) || 4 === b)return !1;
                        a = a.nextSibling
                    }
                    return !0
                },
                header: function (a) {
                    return ga.test(a.nodeName)
                },
                text: function (a) {
                    var b, c;
                    return "input" === a.nodeName.toLowerCase() && "text" === (b = a.type) && (null == (c = a.getAttribute("type")) || c.toLowerCase() === b)
                },
                radio: d("radio"),
                checkbox: d("checkbox"),
                file: d("file"),
                password: d("password"),
                image: d("image"),
                submit: e("submit"),
                reset: e("reset"),
                button: function (a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && "button" === a.type || "button" === b
                },
                input: function (a) {
                    return ha.test(a.nodeName)
                },
                focus: function (a) {
                    var b = a.ownerDocument;
                    return a === b.activeElement && (!b.hasFocus || b.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
                },
                active: function (a) {
                    return a === a.ownerDocument.activeElement
                },
                first: f(function () {
                    return [0]
                }),
                last: f(function (a, b) {
                    return [b - 1]
                }),
                eq: f(function (a, b, c) {
                    return [c < 0 ? c + b : c]
                }),
                even: f(function (a, b) {
                    for (var c = 0; c < b; c += 2)a.push(c);
                    return a
                }),
                odd: f(function (a, b) {
                    for (var c = 1; c < b; c += 2)a.push(c);
                    return a
                }),
                lt: f(function (a, b, c) {
                    for (var d = c < 0 ? c + b : c; --d >= 0;)a.push(d);
                    return a
                }),
                gt: f(function (a, b, c) {
                    for (var d = c < 0 ? c + b : c; ++d < b;)a.push(d);
                    return a
                })
            }
        }, y = G.compareDocumentPosition ? function (a, b) {
            return a === b ? (z = !0, 0) : (a.compareDocumentPosition && b.compareDocumentPosition ? 4 & a.compareDocumentPosition(b) : a.compareDocumentPosition) ? -1 : 1
        } : function (a, b) {
            if (a === b)return z = !0, 0;
            if (a.sourceIndex && b.sourceIndex)return a.sourceIndex - b.sourceIndex;
            var c, d, e = [], f = [], h = a.parentNode, i = b.parentNode, j = h;
            if (h === i)return g(a, b);
            if (!h)return -1;
            if (!i)return 1;
            for (; j;)e.unshift(j), j = j.parentNode;
            for (j = i; j;)f.unshift(j), j = j.parentNode;
            c = e.length, d = f.length;
            for (var k = 0; k < c && k < d; k++)if (e[k] !== f[k])return g(e[k], f[k]);
            return k === c ? g(a, f[k], -1) : g(e[k], b, 1)
        }, [0, 0].sort(y), B = !z, c.uniqueSort = function (a) {
            var b, c = [], d = 1, e = 0;
            if (z = B, a.sort(y), z) {
                for (; b = a[d]; d++)b === a[d - 1] && (e = c.push(d));
                for (; e--;)a.splice(c[e], 1)
            }
            return a
        }, c.error = function (a) {
            throw new Error("Syntax error, unrecognized expression: " + a)
        }, x = c.compile = function (a, b) {
            var c, d = [], e = [], f = R[D][a + " "];
            if (!f) {
                for (b || (b = h(a)), c = b.length; c--;)f = m(b[c]), f[D] ? d.push(f) : e.push(f);
                f = R(a, n(e, d))
            }
            return f
        }, F.querySelectorAll && function () {
            var a, b = p, d = /'|\\/g, e = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g, f = [":focus"], g = [":active"], i = G.matchesSelector || G.mozMatchesSelector || G.webkitMatchesSelector || G.oMatchesSelector || G.msMatchesSelector;
            ka(function (a) {
                a.innerHTML = "<select><option selected=''></option></select>", a.querySelectorAll("[selected]").length || f.push("\\[" + S + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)"), a.querySelectorAll(":checked").length || f.push(":checked")
            }), ka(function (a) {
                a.innerHTML = "<p test=''></p>", a.querySelectorAll("[test^='']").length && f.push("[*^$]=" + S + "*(?:\"\"|'')"), a.innerHTML = "<input type='hidden'/>", a.querySelectorAll(":enabled").length || f.push(":enabled", ":disabled")
            }), f = new RegExp(f.join("|")), p = function (a, c, e, g, i) {
                if (!g && !i && !f.test(a)) {
                    var j, k, l = !0, m = D, n = c, o = 9 === c.nodeType && a;
                    if (1 === c.nodeType && "object" !== c.nodeName.toLowerCase()) {
                        for (j = h(a), (l = c.getAttribute("id")) ? m = l.replace(d, "\\$&") : c.setAttribute("id", m), m = "[id='" + m + "'] ", k = j.length; k--;)j[k] = m + j[k].join("");
                        n = ea.test(a) && c.parentNode || c, o = j.join(",")
                    }
                    if (o)try {
                        return K.apply(e, L.call(n.querySelectorAll(o), 0)), e
                    } catch (a) {
                    } finally {
                        l || c.removeAttribute("id")
                    }
                }
                return b(a, c, e, g, i)
            }, i && (ka(function (b) {
                a = i.call(b, "div");
                try {
                    i.call(b, "[test!='']:sizzle"), g.push("!=", X)
                } catch (a) {
                }
            }), g = new RegExp(g.join("|")), c.matchesSelector = function (b, d) {
                if (d = d.replace(e, "='$1']"), !v(b) && !g.test(d) && !f.test(d))try {
                    var h = i.call(b, d);
                    if (h || a || b.document && 11 !== b.document.nodeType)return h
                } catch (a) {
                }
                return c(d, null, null, [b]).length > 0
            })
        }(), t.pseudos.nth = t.pseudos.eq, t.filters = q.prototype = t.pseudos, t.setFilters = new q, c.attr = $.attr, $.find = c, $.expr = c.selectors, $.expr[":"] = $.expr.pseudos, $.unique = c.uniqueSort, $.text = c.getText, $.isXMLDoc = c.isXML, $.contains = c.contains
    }(a);
    var Ia = /Until$/, Ja = /^(?:parents|prev(?:Until|All))/, Ka = /^.[^:#\[\.,]*$/, La = $.expr.match.needsContext, Ma = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    $.fn.extend({
        find: function (a) {
            var b, c, d, e, f, g, h = this;
            if ("string" != typeof a)return $(a).filter(function () {
                for (b = 0, c = h.length; b < c; b++)if ($.contains(h[b], this))return !0
            });
            for (g = this.pushStack("", "find", a), b = 0, c = this.length; b < c; b++)if (d = g.length, $.find(a, this[b], g), b > 0)for (e = d; e < g.length; e++)for (f = 0; f < d; f++)if (g[f] === g[e]) {
                g.splice(e--, 1);
                break
            }
            return g
        }, has: function (a) {
            var b, c = $(a, this), d = c.length;
            return this.filter(function () {
                for (b = 0; b < d; b++)if ($.contains(this, c[b]))return !0
            })
        }, not: function (a) {
            return this.pushStack(j(this, a, !1), "not", a)
        }, filter: function (a) {
            return this.pushStack(j(this, a, !0), "filter", a)
        }, is: function (a) {
            return !!a && ("string" == typeof a ? La.test(a) ? $(a, this.context).index(this[0]) >= 0 : $.filter(a, this).length > 0 : this.filter(a).length > 0)
        }, closest: function (a, b) {
            for (var c, d = 0, e = this.length, f = [], g = La.test(a) || "string" != typeof a ? $(a, b || this.context) : 0; d < e; d++)for (c = this[d]; c && c.ownerDocument && c !== b && 11 !== c.nodeType;) {
                if (g ? g.index(c) > -1 : $.find.matchesSelector(c, a)) {
                    f.push(c);
                    break
                }
                c = c.parentNode
            }
            return f = f.length > 1 ? $.unique(f) : f, this.pushStack(f, "closest", a)
        }, index: function (a) {
            return a ? "string" == typeof a ? $.inArray(this[0], $(a)) : $.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.prevAll().length : -1
        }, add: function (a, b) {
            var c = "string" == typeof a ? $(a, b) : $.makeArray(a && a.nodeType ? [a] : a), d = $.merge(this.get(), c);
            return this.pushStack(h(c[0]) || h(d[0]) ? d : $.unique(d))
        }, addBack: function (a) {
            return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
        }
    }), $.fn.andSelf = $.fn.addBack, $.each({
        parent: function (a) {
            var b = a.parentNode;
            return b && 11 !== b.nodeType ? b : null
        }, parents: function (a) {
            return $.dir(a, "parentNode")
        }, parentsUntil: function (a, b, c) {
            return $.dir(a, "parentNode", c)
        }, next: function (a) {
            return i(a, "nextSibling")
        }, prev: function (a) {
            return i(a, "previousSibling")
        }, nextAll: function (a) {
            return $.dir(a, "nextSibling")
        }, prevAll: function (a) {
            return $.dir(a, "previousSibling")
        }, nextUntil: function (a, b, c) {
            return $.dir(a, "nextSibling", c)
        }, prevUntil: function (a, b, c) {
            return $.dir(a, "previousSibling", c)
        }, siblings: function (a) {
            return $.sibling((a.parentNode || {}).firstChild, a)
        }, children: function (a) {
            return $.sibling(a.firstChild)
        }, contents: function (a) {
            return $.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : $.merge([], a.childNodes)
        }
    }, function (a, b) {
        $.fn[a] = function (c, d) {
            var e = $.map(this, b, c);
            return Ia.test(a) || (d = c), d && "string" == typeof d && (e = $.filter(d, e)), e = this.length > 1 && !Ma[a] ? $.unique(e) : e, this.length > 1 && Ja.test(a) && (e = e.reverse()), this.pushStack(e, a, V.call(arguments).join(","))
        }
    }), $.extend({
        filter: function (a, b, c) {
            return c && (a = ":not(" + a + ")"), 1 === b.length ? $.find.matchesSelector(b[0], a) ? [b[0]] : [] : $.find.matches(a, b)
        }, dir: function (a, c, d) {
            for (var e = [], f = a[c]; f && 9 !== f.nodeType && (d === b || 1 !== f.nodeType || !$(f).is(d));)1 === f.nodeType && e.push(f), f = f[c];
            return e
        }, sibling: function (a, b) {
            for (var c = []; a; a = a.nextSibling)1 === a.nodeType && a !== b && c.push(a);
            return c
        }
    });
    var Na = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", Oa = / jQuery\d+="(?:null|\d+)"/g, Pa = /^\s+/, Qa = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, Ra = /<([\w:]+)/, Sa = /<tbody/i, Ta = /<|&#?\w+;/, Ua = /<(?:script|style|link)/i, Va = /<(?:script|object|embed|option|style)/i, Wa = new RegExp("<(?:" + Na + ")[\\s/>]", "i"), Xa = /^(?:checkbox|radio)$/, Ya = /checked\s*(?:[^=]|=\s*.checked.)/i, Za = /\/(java|ecma)script/i, $a = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g, _a = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        legend: [1, "<fieldset>", "</fieldset>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
        area: [1, "<map>", "</map>"],
        _default: [0, "", ""]
    }, ab = k(P), bb = ab.appendChild(P.createElement("div"));
    _a.optgroup = _a.option, _a.tbody = _a.tfoot = _a.colgroup = _a.caption = _a.thead, _a.th = _a.td, $.support.htmlSerialize || (_a._default = [1, "X<div>", "</div>"]), $.fn.extend({
        text: function (a) {
            return $.access(this, function (a) {
                return a === b ? $.text(this) : this.empty().append((this[0] && this[0].ownerDocument || P).createTextNode(a))
            }, null, a, arguments.length)
        }, wrapAll: function (a) {
            if ($.isFunction(a))return this.each(function (b) {
                $(this).wrapAll(a.call(this, b))
            });
            if (this[0]) {
                var b = $(a, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && b.insertBefore(this[0]), b.map(function () {
                    for (var a = this; a.firstChild && 1 === a.firstChild.nodeType;)a = a.firstChild;
                    return a
                }).append(this)
            }
            return this
        }, wrapInner: function (a) {
            return $.isFunction(a) ? this.each(function (b) {
                $(this).wrapInner(a.call(this, b))
            }) : this.each(function () {
                var b = $(this), c = b.contents();
                c.length ? c.wrapAll(a) : b.append(a)
            })
        }, wrap: function (a) {
            var b = $.isFunction(a);
            return this.each(function (c) {
                $(this).wrapAll(b ? a.call(this, c) : a)
            })
        }, unwrap: function () {
            return this.parent().each(function () {
                $.nodeName(this, "body") || $(this).replaceWith(this.childNodes)
            }).end()
        }, append: function () {
            return this.domManip(arguments, !0, function (a) {
                (1 === this.nodeType || 11 === this.nodeType) && this.appendChild(a)
            })
        }, prepend: function () {
            return this.domManip(arguments, !0, function (a) {
                (1 === this.nodeType || 11 === this.nodeType) && this.insertBefore(a, this.firstChild)
            })
        }, before: function () {
            if (!h(this[0]))return this.domManip(arguments, !1, function (a) {
                this.parentNode.insertBefore(a, this)
            });
            if (arguments.length) {
                var a = $.clean(arguments);
                return this.pushStack($.merge(a, this), "before", this.selector)
            }
        }, after: function () {
            if (!h(this[0]))return this.domManip(arguments, !1, function (a) {
                this.parentNode.insertBefore(a, this.nextSibling)
            });
            if (arguments.length) {
                var a = $.clean(arguments);
                return this.pushStack($.merge(this, a), "after", this.selector)
            }
        }, remove: function (a, b) {
            for (var c, d = 0; null != (c = this[d]); d++)a && !$.filter(a, [c]).length || (!b && 1 === c.nodeType && ($.cleanData(c.getElementsByTagName("*")), $.cleanData([c])), c.parentNode && c.parentNode.removeChild(c));
            return this
        }, empty: function () {
            for (var a, b = 0; null != (a = this[b]); b++)for (1 === a.nodeType && $.cleanData(a.getElementsByTagName("*")); a.firstChild;)a.removeChild(a.firstChild);
            return this
        }, clone: function (a, b) {
            return a = null != a && a, b = null == b ? a : b, this.map(function () {
                return $.clone(this, a, b)
            })
        }, html: function (a) {
            return $.access(this, function (a) {
                var c = this[0] || {}, d = 0, e = this.length;
                if (a === b)return 1 === c.nodeType ? c.innerHTML.replace(Oa, "") : b;
                if ("string" == typeof a && !Ua.test(a) && ($.support.htmlSerialize || !Wa.test(a)) && ($.support.leadingWhitespace || !Pa.test(a)) && !_a[(Ra.exec(a) || ["", ""])[1].toLowerCase()]) {
                    a = a.replace(Qa, "<$1></$2>");
                    try {
                        for (; d < e; d++)c = this[d] || {}, 1 === c.nodeType && ($.cleanData(c.getElementsByTagName("*")), c.innerHTML = a);
                        c = 0
                    } catch (a) {
                    }
                }
                c && this.empty().append(a)
            }, null, a, arguments.length)
        }, replaceWith: function (a) {
            return h(this[0]) ? this.length ? this.pushStack($($.isFunction(a) ? a() : a), "replaceWith", a) : this : $.isFunction(a) ? this.each(function (b) {
                var c = $(this), d = c.html();
                c.replaceWith(a.call(this, b, d))
            }) : ("string" != typeof a && (a = $(a).detach()), this.each(function () {
                var b = this.nextSibling, c = this.parentNode;
                $(this).remove(), b ? $(b).before(a) : $(c).append(a)
            }))
        }, detach: function (a) {
            return this.remove(a, !0)
        }, domManip: function (a, c, d) {
            a = [].concat.apply([], a);
            var e, f, g, h, i = 0, j = a[0], k = [], m = this.length;
            if (!$.support.checkClone && m > 1 && "string" == typeof j && Ya.test(j))return this.each(function () {
                $(this).domManip(a, c, d)
            });
            if ($.isFunction(j))return this.each(function (e) {
                var f = $(this);
                a[0] = j.call(this, e, c ? f.html() : b), f.domManip(a, c, d)
            });
            if (this[0]) {
                if (e = $.buildFragment(a, this, k), g = e.fragment, f = g.firstChild, 1 === g.childNodes.length && (g = f), f)for (c = c && $.nodeName(f, "tr"), h = e.cacheable || m - 1; i < m; i++)d.call(c && $.nodeName(this[i], "table") ? l(this[i], "tbody") : this[i], i === h ? g : $.clone(g, !0, !0));
                g = f = null, k.length && $.each(k, function (a, b) {
                    b.src ? $.ajax ? $.ajax({
                        url: b.src,
                        type: "GET",
                        dataType: "script",
                        async: !1,
                        global: !1,
                        throws: !0
                    }) : $.error("no ajax") : $.globalEval((b.text || b.textContent || b.innerHTML || "").replace($a, "")), b.parentNode && b.parentNode.removeChild(b)
                })
            }
            return this
        }
    }), $.buildFragment = function (a, c, d) {
        var e, f, g, h = a[0];
        return c = c || P, c = !c.nodeType && c[0] || c, c = c.ownerDocument || c, 1 === a.length && "string" == typeof h && h.length < 512 && c === P && "<" === h.charAt(0) && !Va.test(h) && ($.support.checkClone || !Ya.test(h)) && ($.support.html5Clone || !Wa.test(h)) && (f = !0, e = $.fragments[h], g = e !== b), e || (e = c.createDocumentFragment(), $.clean(a, c, e, d), f && ($.fragments[h] = g && e)), {
            fragment: e,
            cacheable: f
        }
    }, $.fragments = {}, $.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (a, b) {
        $.fn[a] = function (c) {
            var d, e = 0, f = [], g = $(c), h = g.length, i = 1 === this.length && this[0].parentNode;
            if ((null == i || i && 11 === i.nodeType && 1 === i.childNodes.length) && 1 === h)return g[b](this[0]), this;
            for (; e < h; e++)d = (e > 0 ? this.clone(!0) : this).get(), $(g[e])[b](d), f = f.concat(d);
            return this.pushStack(f, a, g.selector)
        }
    }), $.extend({
        clone: function (a, b, c) {
            var d, e, f, g;
            if ($.support.html5Clone || $.isXMLDoc(a) || !Wa.test("<" + a.nodeName + ">") ? g = a.cloneNode(!0) : (bb.innerHTML = a.outerHTML, bb.removeChild(g = bb.firstChild)), !($.support.noCloneEvent && $.support.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || $.isXMLDoc(a)))for (n(a, g), d = o(a), e = o(g), f = 0; d[f]; ++f)e[f] && n(d[f], e[f]);
            if (b && (m(a, g), c))for (d = o(a), e = o(g), f = 0; d[f]; ++f)m(d[f], e[f]);
            return d = e = null, g
        }, clean: function (a, b, c, d) {
            var e, f, g, h, i, j, l, m, n, q, r, s = b === P && ab, t = [];
            for (b && "undefined" != typeof b.createDocumentFragment || (b = P), e = 0; null != (g = a[e]); e++)if ("number" == typeof g && (g += ""), g) {
                if ("string" == typeof g)if (Ta.test(g)) {
                    for (s = s || k(b), l = b.createElement("div"), s.appendChild(l), g = g.replace(Qa, "<$1></$2>"), h = (Ra.exec(g) || ["", ""])[1].toLowerCase(), i = _a[h] || _a._default, j = i[0], l.innerHTML = i[1] + g + i[2]; j--;)l = l.lastChild;
                    if (!$.support.tbody)for (m = Sa.test(g), n = "table" !== h || m ? "<table>" !== i[1] || m ? [] : l.childNodes : l.firstChild && l.firstChild.childNodes, f = n.length - 1; f >= 0; --f)$.nodeName(n[f], "tbody") && !n[f].childNodes.length && n[f].parentNode.removeChild(n[f]);
                    !$.support.leadingWhitespace && Pa.test(g) && l.insertBefore(b.createTextNode(Pa.exec(g)[0]), l.firstChild), g = l.childNodes, l.parentNode.removeChild(l)
                } else g = b.createTextNode(g);
                g.nodeType ? t.push(g) : $.merge(t, g)
            }
            if (l && (g = l = s = null), !$.support.appendChecked)for (e = 0; null != (g = t[e]); e++)$.nodeName(g, "input") ? p(g) : "undefined" != typeof g.getElementsByTagName && $.grep(g.getElementsByTagName("input"), p);
            if (c)for (q = function (a) {
                if (!a.type || Za.test(a.type))return d ? d.push(a.parentNode ? a.parentNode.removeChild(a) : a) : c.appendChild(a)
            }, e = 0; null != (g = t[e]); e++)$.nodeName(g, "script") && q(g) || (c.appendChild(g), "undefined" != typeof g.getElementsByTagName && (r = $.grep($.merge([], g.getElementsByTagName("script")), q), t.splice.apply(t, [e + 1, 0].concat(r)), e += r.length));
            return t
        }, cleanData: function (a, b) {
            for (var c, d, e, f, g = 0, h = $.expando, i = $.cache, j = $.support.deleteExpando, k = $.event.special; null != (e = a[g]); g++)if ((b || $.acceptData(e)) && (d = e[h], c = d && i[d])) {
                if (c.events)for (f in c.events)k[f] ? $.event.remove(e, f) : $.removeEvent(e, f, c.handle);
                i[d] && (delete i[d], j ? delete e[h] : e.removeAttribute ? e.removeAttribute(h) : e[h] = null, $.deletedIds.push(d))
            }
        }
    }), function () {
        var a, b;
        $.uaMatch = function (a) {
            a = a.toLowerCase();
            var b = /(chrome)[ \/]([\w.]+)/.exec(a) || /(webkit)[ \/]([\w.]+)/.exec(a) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(a) || /(msie) ([\w.]+)/.exec(a) || a.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(a) || [];
            return {browser: b[1] || "", version: b[2] || "0"}
        }, a = $.uaMatch(R.userAgent), b = {}, a.browser && (b[a.browser] = !0, b.version = a.version), b.chrome ? b.webkit = !0 : b.webkit && (b.safari = !0), $.browser = b, $.sub = function () {
            function a(b, c) {
                return new a.fn.init(b, c)
            }

            $.extend(!0, a, this), a.superclass = this, a.fn = a.prototype = this(), a.fn.constructor = a, a.sub = this.sub, a.fn.init = function (c, d) {
                return d && d instanceof $ && !(d instanceof a) && (d = a(d)), $.fn.init.call(this, c, d, b)
            }, a.fn.init.prototype = a.fn;
            var b = a(P);
            return a
        }
    }();
    var cb, db, eb, fb = /alpha\([^)]*\)/i, gb = /opacity=([^)]*)/, hb = /^(top|right|bottom|left)$/, ib = /^(none|table(?!-c[ea]).+)/, jb = /^margin/, kb = new RegExp("^(" + _ + ")(.*)$", "i"), lb = new RegExp("^(" + _ + ")(?!px)[a-z%]+$", "i"), mb = new RegExp("^([-+])=(" + _ + ")", "i"), nb = {BODY: "block"}, ob = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }, pb = {
        letterSpacing: 0,
        fontWeight: 400
    }, qb = ["Top", "Right", "Bottom", "Left"], rb = ["Webkit", "O", "Moz", "ms"], sb = $.fn.toggle;
    $.fn.extend({
        css: function (a, c) {
            return $.access(this, function (a, c, d) {
                return d !== b ? $.style(a, c, d) : $.css(a, c)
            }, a, c, arguments.length > 1)
        }, show: function () {
            return s(this, !0)
        }, hide: function () {
            return s(this)
        }, toggle: function (a, b) {
            var c = "boolean" == typeof a;
            return $.isFunction(a) && $.isFunction(b) ? sb.apply(this, arguments) : this.each(function () {
                (c ? a : r(this)) ? $(this).show() : $(this).hide()
            })
        }
    }), $.extend({
        cssHooks: {
            opacity: {
                get: function (a, b) {
                    if (b) {
                        var c = cb(a, "opacity");
                        return "" === c ? "1" : c
                    }
                }
            }
        },
        cssNumber: {
            fillOpacity: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {float: $.support.cssFloat ? "cssFloat" : "styleFloat"},
        style: function (a, c, d, e) {
            if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
                var f, g, h, i = $.camelCase(c), j = a.style;
                if (c = $.cssProps[i] || ($.cssProps[i] = q(j, i)), h = $.cssHooks[c] || $.cssHooks[i], d === b)return h && "get"in h && (f = h.get(a, !1, e)) !== b ? f : j[c];
                if (g = typeof d, "string" === g && (f = mb.exec(d)) && (d = (f[1] + 1) * f[2] + parseFloat($.css(a, c)), g = "number"), !(null == d || "number" === g && isNaN(d) || ("number" === g && !$.cssNumber[i] && (d += "px"), h && "set"in h && (d = h.set(a, d, e)) === b)))try {
                    j[c] = d
                } catch (a) {
                }
            }
        },
        css: function (a, c, d, e) {
            var f, g, h, i = $.camelCase(c);
            return c = $.cssProps[i] || ($.cssProps[i] = q(a.style, i)), h = $.cssHooks[c] || $.cssHooks[i], h && "get"in h && (f = h.get(a, !0, e)), f === b && (f = cb(a, c)), "normal" === f && c in pb && (f = pb[c]), d || e !== b ? (g = parseFloat(f), d || $.isNumeric(g) ? g || 0 : f) : f
        },
        swap: function (a, b, c) {
            var d, e, f = {};
            for (e in b)f[e] = a.style[e], a.style[e] = b[e];
            d = c.call(a);
            for (e in b)a.style[e] = f[e];
            return d
        }
    }), a.getComputedStyle ? cb = function (b, c) {
        var d, e, f, g, h = a.getComputedStyle(b, null), i = b.style;
        return h && (d = h.getPropertyValue(c) || h[c], "" === d && !$.contains(b.ownerDocument, b) && (d = $.style(b, c)), lb.test(d) && jb.test(c) && (e = i.width, f = i.minWidth, g = i.maxWidth, i.minWidth = i.maxWidth = i.width = d, d = h.width, i.width = e, i.minWidth = f, i.maxWidth = g)), d
    } : P.documentElement.currentStyle && (cb = function (a, b) {
        var c, d, e = a.currentStyle && a.currentStyle[b], f = a.style;
        return null == e && f && f[b] && (e = f[b]), lb.test(e) && !hb.test(b) && (c = f.left, d = a.runtimeStyle && a.runtimeStyle.left, d && (a.runtimeStyle.left = a.currentStyle.left), f.left = "fontSize" === b ? "1em" : e, e = f.pixelLeft + "px", f.left = c, d && (a.runtimeStyle.left = d)), "" === e ? "auto" : e
    }), $.each(["height", "width"], function (a, b) {
        $.cssHooks[b] = {
            get: function (a, c, d) {
                if (c)return 0 === a.offsetWidth && ib.test(cb(a, "display")) ? $.swap(a, ob, function () {
                    return v(a, b, d)
                }) : v(a, b, d)
            }, set: function (a, c, d) {
                return t(a, c, d ? u(a, b, d, $.support.boxSizing && "border-box" === $.css(a, "boxSizing")) : 0)
            }
        }
    }), $.support.opacity || ($.cssHooks.opacity = {
        get: function (a, b) {
            return gb.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : b ? "1" : ""
        }, set: function (a, b) {
            var c = a.style, d = a.currentStyle, e = $.isNumeric(b) ? "alpha(opacity=" + 100 * b + ")" : "", f = d && d.filter || c.filter || "";
            c.zoom = 1, b >= 1 && "" === $.trim(f.replace(fb, "")) && c.removeAttribute && (c.removeAttribute("filter"), d && !d.filter) || (c.filter = fb.test(f) ? f.replace(fb, e) : f + " " + e)
        }
    }), $(function () {
        $.support.reliableMarginRight || ($.cssHooks.marginRight = {
            get: function (a, b) {
                return $.swap(a, {display: "inline-block"}, function () {
                    if (b)return cb(a, "marginRight")
                })
            }
        }), !$.support.pixelPosition && $.fn.position && $.each(["top", "left"], function (a, b) {
            $.cssHooks[b] = {
                get: function (a, c) {
                    if (c) {
                        var d = cb(a, b);
                        return lb.test(d) ? $(a).position()[b] + "px" : d
                    }
                }
            }
        })
    }), $.expr && $.expr.filters && ($.expr.filters.hidden = function (a) {
        return 0 === a.offsetWidth && 0 === a.offsetHeight || !$.support.reliableHiddenOffsets && "none" === (a.style && a.style.display || cb(a, "display"))
    }, $.expr.filters.visible = function (a) {
        return !$.expr.filters.hidden(a)
    }), $.each({margin: "", padding: "", border: "Width"}, function (a, b) {
        $.cssHooks[a + b] = {
            expand: function (c) {
                var d, e = "string" == typeof c ? c.split(" ") : [c], f = {};
                for (d = 0; d < 4; d++)f[a + qb[d] + b] = e[d] || e[d - 2] || e[0];
                return f
            }
        }, jb.test(a) || ($.cssHooks[a + b].set = t)
    });
    var tb = /%20/g, ub = /\[\]$/, vb = /\r?\n/g, wb = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i, xb = /^(?:select|textarea)/i;
    $.fn.extend({
        serialize: function () {
            return $.param(this.serializeArray())
        }, serializeArray: function () {
            return this.map(function () {
                return this.elements ? $.makeArray(this.elements) : this
            }).filter(function () {
                return this.name && !this.disabled && (this.checked || xb.test(this.nodeName) || wb.test(this.type))
            }).map(function (a, b) {
                var c = $(this).val();
                return null == c ? null : $.isArray(c) ? $.map(c, function (a, c) {
                    return {name: b.name, value: a.replace(vb, "\r\n")}
                }) : {name: b.name, value: c.replace(vb, "\r\n")}
            }).get()
        }
    }), $.param = function (a, c) {
        var d, e = [], f = function (a, b) {
            b = $.isFunction(b) ? b() : null == b ? "" : b, e[e.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
        };
        if (c === b && (c = $.ajaxSettings && $.ajaxSettings.traditional), $.isArray(a) || a.jquery && !$.isPlainObject(a))$.each(a, function () {
            f(this.name, this.value)
        }); else for (d in a)x(d, a[d], c, f);
        return e.join("&").replace(tb, "+")
    };
    var yb, zb, Ab = /#.*$/, Bb = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, Cb = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/, Db = /^(?:GET|HEAD)$/, Eb = /^\/\//, Fb = /\?/, Gb = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, Hb = /([?&])_=[^&]*/, Ib = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/, Jb = $.fn.load, Kb = {}, Lb = {}, Mb = ["*/"] + ["*"];
    try {
        zb = Q.href
    } catch (a) {
        zb = P.createElement("a"), zb.href = "", zb = zb.href
    }
    yb = Ib.exec(zb.toLowerCase()) || [], $.fn.load = function (a, c, d) {
        if ("string" != typeof a && Jb)return Jb.apply(this, arguments);
        if (!this.length)return this;
        var e, f, g, h = this, i = a.indexOf(" ");
        return i >= 0 && (e = a.slice(i, a.length), a = a.slice(0, i)), $.isFunction(c) ? (d = c, c = b) : c && "object" == typeof c && (f = "POST"), $.ajax({
            url: a,
            type: f,
            dataType: "html",
            data: c,
            complete: function (a, b) {
                d && h.each(d, g || [a.responseText, b, a])
            }
        }).done(function (a) {
            g = arguments, h.html(e ? $("<div>").append(a.replace(Gb, "")).find(e) : a)
        }), this
    }, $.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function (a, b) {
        $.fn[b] = function (a) {
            return this.on(b, a)
        }
    }), $.each(["get", "post"], function (a, c) {
        $[c] = function (a, d, e, f) {
            return $.isFunction(d) && (f = f || e, e = d, d = b), $.ajax({
                type: c,
                url: a,
                data: d,
                success: e,
                dataType: f
            })
        }
    }), $.extend({
        getScript: function (a, c) {
            return $.get(a, b, c, "script")
        },
        getJSON: function (a, b, c) {
            return $.get(a, b, c, "json")
        },
        ajaxSetup: function (a, b) {
            return b ? A(a, $.ajaxSettings) : (b = a, a = $.ajaxSettings), A(a, b), a
        },
        ajaxSettings: {
            url: zb,
            isLocal: Cb.test(yb[1]),
            global: !0,
            type: "GET",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            processData: !0,
            async: !0,
            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                text: "text/plain",
                json: "application/json, text/javascript",
                "*": Mb
            },
            contents: {xml: /xml/, html: /html/, json: /json/},
            responseFields: {xml: "responseXML", text: "responseText"},
            converters: {"* text": a.String, "text html": !0, "text json": $.parseJSON, "text xml": $.parseXML},
            flatOptions: {context: !0, url: !0}
        },
        ajaxPrefilter: y(Kb),
        ajaxTransport: y(Lb),
        ajax: function (a, c) {
            function d(a, c, d, g) {
                var j, l, s, t, v, x = c;
                2 !== u && (u = 2, i && clearTimeout(i), h = b, f = g || "", w.readyState = a > 0 ? 4 : 0, d && (t = B(m, w, d)), a >= 200 && a < 300 || 304 === a ? (m.ifModified && (v = w.getResponseHeader("Last-Modified"), v && ($.lastModified[e] = v), v = w.getResponseHeader("Etag"), v && ($.etag[e] = v)), 304 === a ? (x = "notmodified", j = !0) : (j = C(m, t), x = j.state, l = j.data, s = j.error, j = !s)) : (s = x, x && !a || (x = "error", a < 0 && (a = 0))), w.status = a, w.statusText = (c || x) + "", j ? p.resolveWith(n, [l, x, w]) : p.rejectWith(n, [w, x, s]), w.statusCode(r), r = b, k && o.trigger("ajax" + (j ? "Success" : "Error"), [w, m, j ? l : s]), q.fireWith(n, [w, x]), k && (o.trigger("ajaxComplete", [w, m]), --$.active || $.event.trigger("ajaxStop")))
            }

            "object" == typeof a && (c = a, a = b), c = c || {};
            var e, f, g, h, i, j, k, l, m = $.ajaxSetup({}, c), n = m.context || m, o = n !== m && (n.nodeType || n instanceof $) ? $(n) : $.event, p = $.Deferred(), q = $.Callbacks("once memory"), r = m.statusCode || {}, s = {}, t = {}, u = 0, v = "canceled", w = {
                readyState: 0,
                setRequestHeader: function (a, b) {
                    if (!u) {
                        var c = a.toLowerCase();
                        a = t[c] = t[c] || a, s[a] = b
                    }
                    return this
                },
                getAllResponseHeaders: function () {
                    return 2 === u ? f : null
                },
                getResponseHeader: function (a) {
                    var c;
                    if (2 === u) {
                        if (!g)for (g = {}; c = Bb.exec(f);)g[c[1].toLowerCase()] = c[2];
                        c = g[a.toLowerCase()]
                    }
                    return c === b ? null : c
                },
                overrideMimeType: function (a) {
                    return u || (m.mimeType = a), this
                },
                abort: function (a) {
                    return a = a || v, h && h.abort(a), d(0, a), this
                }
            };
            if (p.promise(w), w.success = w.done, w.error = w.fail, w.complete = q.add, w.statusCode = function (a) {
                    if (a) {
                        var b;
                        if (u < 2)for (b in a)r[b] = [r[b], a[b]]; else b = a[w.status], w.always(b)
                    }
                    return this
                }, m.url = ((a || m.url) + "").replace(Ab, "").replace(Eb, yb[1] + "//"), m.dataTypes = $.trim(m.dataType || "*").toLowerCase().split(ba), null == m.crossDomain && (j = Ib.exec(m.url.toLowerCase()), m.crossDomain = !(!j || j[1] === yb[1] && j[2] === yb[2] && (j[3] || ("http:" === j[1] ? 80 : 443)) == (yb[3] || ("http:" === yb[1] ? 80 : 443)))), m.data && m.processData && "string" != typeof m.data && (m.data = $.param(m.data, m.traditional)), z(Kb, m, c, w), 2 === u)return w;
            if (k = m.global, m.type = m.type.toUpperCase(), m.hasContent = !Db.test(m.type), k && 0 === $.active++ && $.event.trigger("ajaxStart"), !m.hasContent && (m.data && (m.url += (Fb.test(m.url) ? "&" : "?") + m.data, delete m.data), e = m.url, m.cache === !1)) {
                var x = $.now(), y = m.url.replace(Hb, "$1_=" + x);
                m.url = y + (y === m.url ? (Fb.test(m.url) ? "&" : "?") + "_=" + x : "")
            }
            (m.data && m.hasContent && m.contentType !== !1 || c.contentType) && w.setRequestHeader("Content-Type", m.contentType), m.ifModified && (e = e || m.url, $.lastModified[e] && w.setRequestHeader("If-Modified-Since", $.lastModified[e]), $.etag[e] && w.setRequestHeader("If-None-Match", $.etag[e])), w.setRequestHeader("Accept", m.dataTypes[0] && m.accepts[m.dataTypes[0]] ? m.accepts[m.dataTypes[0]] + ("*" !== m.dataTypes[0] ? ", " + Mb + "; q=0.01" : "") : m.accepts["*"]);
            for (l in m.headers)w.setRequestHeader(l, m.headers[l]);
            if (!m.beforeSend || m.beforeSend.call(n, w, m) !== !1 && 2 !== u) {
                v = "abort";
                for (l in{success: 1, error: 1, complete: 1})w[l](m[l]);
                if (h = z(Lb, m, c, w)) {
                    w.readyState = 1, k && o.trigger("ajaxSend", [w, m]), m.async && m.timeout > 0 && (i = setTimeout(function () {
                        w.abort("timeout")
                    }, m.timeout));
                    try {
                        u = 1, h.send(s, d)
                    } catch (a) {
                        if (!(u < 2))throw a;
                        d(-1, a)
                    }
                } else d(-1, "No Transport");
                return w
            }
            return w.abort()
        },
        active: 0,
        lastModified: {},
        etag: {}
    });
    var Nb = [], Ob = /\?/, Pb = /(=)\?(?=&|$)|\?\?/, Qb = $.now();
    $.ajaxSetup({
        jsonp: "callback", jsonpCallback: function () {
            var a = Nb.pop() || $.expando + "_" + Qb++;
            return this[a] = !0, a
        }
    }), $.ajaxPrefilter("json jsonp", function (c, d, e) {
        var f, g, h, i = c.data, j = c.url, k = c.jsonp !== !1, l = k && Pb.test(j), m = k && !l && "string" == typeof i && !(c.contentType || "").indexOf("application/x-www-form-urlencoded") && Pb.test(i);
        if ("jsonp" === c.dataTypes[0] || l || m)return f = c.jsonpCallback = $.isFunction(c.jsonpCallback) ? c.jsonpCallback() : c.jsonpCallback, g = a[f], l ? c.url = j.replace(Pb, "$1" + f) : m ? c.data = i.replace(Pb, "$1" + f) : k && (c.url += (Ob.test(j) ? "&" : "?") + c.jsonp + "=" + f), c.converters["script json"] = function () {
            return h || $.error(f + " was not called"), h[0]
        }, c.dataTypes[0] = "json", a[f] = function () {
            h = arguments
        }, e.always(function () {
            a[f] = g, c[f] && (c.jsonpCallback = d.jsonpCallback, Nb.push(f)), h && $.isFunction(g) && g(h[0]), h = g = b
        }), "script"
    }), $.ajaxSetup({
        accepts: {script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},
        contents: {script: /javascript|ecmascript/},
        converters: {
            "text script": function (a) {
                return $.globalEval(a), a
            }
        }
    }), $.ajaxPrefilter("script", function (a) {
        a.cache === b && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1)
    }), $.ajaxTransport("script", function (a) {
        if (a.crossDomain) {
            var c, d = P.head || P.getElementsByTagName("head")[0] || P.documentElement;
            return {
                send: function (e, f) {
                    c = P.createElement("script"), c.async = "async", a.scriptCharset && (c.charset = a.scriptCharset), c.src = a.url, c.onload = c.onreadystatechange = function (a, e) {
                        (e || !c.readyState || /loaded|complete/.test(c.readyState)) && (c.onload = c.onreadystatechange = null, d && c.parentNode && d.removeChild(c), c = b, e || f(200, "success"))
                    }, d.insertBefore(c, d.firstChild)
                }, abort: function () {
                    c && c.onload(0, 1)
                }
            }
        }
    });
    var Rb, Sb = !!a.ActiveXObject && function () {
            for (var a in Rb)Rb[a](0, 1)
        }, Tb = 0;
    $.ajaxSettings.xhr = a.ActiveXObject ? function () {
        return !this.isLocal && D() || E()
    } : D, function (a) {
        $.extend($.support, {ajax: !!a, cors: !!a && "withCredentials"in a})
    }($.ajaxSettings.xhr()), $.support.ajax && $.ajaxTransport(function (c) {
        if (!c.crossDomain || $.support.cors) {
            var d;
            return {
                send: function (e, f) {
                    var g, h, i = c.xhr();
                    if (c.username ? i.open(c.type, c.url, c.async, c.username, c.password) : i.open(c.type, c.url, c.async), c.xhrFields)for (h in c.xhrFields)i[h] = c.xhrFields[h];
                    c.mimeType && i.overrideMimeType && i.overrideMimeType(c.mimeType), !c.crossDomain && !e["X-Requested-With"] && (e["X-Requested-With"] = "XMLHttpRequest");
                    try {
                        for (h in e)i.setRequestHeader(h, e[h])
                    } catch (a) {
                    }
                    i.send(c.hasContent && c.data || null), d = function (a, e) {
                        var h, j, k, l, m;
                        try {
                            if (d && (e || 4 === i.readyState))if (d = b, g && (i.onreadystatechange = $.noop, Sb && delete Rb[g]), e)4 !== i.readyState && i.abort(); else {
                                h = i.status, k = i.getAllResponseHeaders(), l = {}, m = i.responseXML, m && m.documentElement && (l.xml = m);
                                try {
                                    l.text = i.responseText
                                } catch (a) {
                                }
                                try {
                                    j = i.statusText
                                } catch (a) {
                                    j = ""
                                }
                                h || !c.isLocal || c.crossDomain ? 1223 === h && (h = 204) : h = l.text ? 200 : 404
                            }
                        } catch (a) {
                            e || f(-1, a)
                        }
                        l && f(h, j, l, k)
                    }, c.async ? 4 === i.readyState ? setTimeout(d, 0) : (g = ++Tb, Sb && (Rb || (Rb = {}, $(a).unload(Sb)), Rb[g] = d), i.onreadystatechange = d) : d()
                }, abort: function () {
                    d && d(0, 1)
                }
            }
        }
    });
    var Ub, Vb, Wb = /^(?:toggle|show|hide)$/, Xb = new RegExp("^(?:([-+])=|)(" + _ + ")([a-z%]*)$", "i"), Yb = /queueHooks$/, Zb = [J], $b = {
        "*": [function (a, b) {
            var c, d, e = this.createTween(a, b), f = Xb.exec(b), g = e.cur(), h = +g || 0, i = 1, j = 20;
            if (f) {
                if (c = +f[2], d = f[3] || ($.cssNumber[a] ? "" : "px"), "px" !== d && h) {
                    h = $.css(e.elem, a, !0) || c || 1;
                    do i = i || ".5", h /= i, $.style(e.elem, a, h + d); while (i !== (i = e.cur() / g) && 1 !== i && --j)
                }
                e.unit = d, e.start = h, e.end = f[1] ? h + (f[1] + 1) * c : c
            }
            return e
        }]
    };
    $.Animation = $.extend(H, {
        tweener: function (a, b) {
            $.isFunction(a) ? (b = a, a = ["*"]) : a = a.split(" ");
            for (var c, d = 0, e = a.length; d < e; d++)c = a[d], $b[c] = $b[c] || [], $b[c].unshift(b)
        }, prefilter: function (a, b) {
            b ? Zb.unshift(a) : Zb.push(a)
        }
    }), $.Tween = K, K.prototype = {
        constructor: K, init: function (a, b, c, d, e, f) {
            this.elem = a, this.prop = c, this.easing = e || "swing", this.options = b, this.start = this.now = this.cur(), this.end = d, this.unit = f || ($.cssNumber[c] ? "" : "px")
        }, cur: function () {
            var a = K.propHooks[this.prop];
            return a && a.get ? a.get(this) : K.propHooks._default.get(this)
        }, run: function (a) {
            var b, c = K.propHooks[this.prop];
            return this.options.duration ? this.pos = b = $.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : this.pos = b = a, this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), c && c.set ? c.set(this) : K.propHooks._default.set(this), this
        }
    }, K.prototype.init.prototype = K.prototype, K.propHooks = {
        _default: {
            get: function (a) {
                var b;
                return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = $.css(a.elem, a.prop, !1, ""), b && "auto" !== b ? b : 0) : a.elem[a.prop]
            }, set: function (a) {
                $.fx.step[a.prop] ? $.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[$.cssProps[a.prop]] || $.cssHooks[a.prop]) ? $.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now
            }
        }
    }, K.propHooks.scrollTop = K.propHooks.scrollLeft = {
        set: function (a) {
            a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
        }
    }, $.each(["toggle", "show", "hide"], function (a, b) {
        var c = $.fn[b];
        $.fn[b] = function (d, e, f) {
            return null == d || "boolean" == typeof d || !a && $.isFunction(d) && $.isFunction(e) ? c.apply(this, arguments) : this.animate(L(b, !0), d, e, f)
        }
    }), $.fn.extend({
        fadeTo: function (a, b, c, d) {
            return this.filter(r).css("opacity", 0).show().end().animate({opacity: b}, a, c, d)
        }, animate: function (a, b, c, d) {
            var e = $.isEmptyObject(a), f = $.speed(b, c, d), g = function () {
                var b = H(this, $.extend({}, a), f);
                e && b.stop(!0)
            };
            return e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
        }, stop: function (a, c, d) {
            var e = function (a) {
                var b = a.stop;
                delete a.stop, b(d)
            };
            return "string" != typeof a && (d = c, c = a, a = b), c && a !== !1 && this.queue(a || "fx", []), this.each(function () {
                var b = !0, c = null != a && a + "queueHooks", f = $.timers, g = $._data(this);
                if (c)g[c] && g[c].stop && e(g[c]); else for (c in g)g[c] && g[c].stop && Yb.test(c) && e(g[c]);
                for (c = f.length; c--;)f[c].elem === this && (null == a || f[c].queue === a) && (f[c].anim.stop(d), b = !1, f.splice(c, 1));
                (b || !d) && $.dequeue(this, a)
            })
        }
    }), $.each({
        slideDown: L("show"),
        slideUp: L("hide"),
        slideToggle: L("toggle"),
        fadeIn: {opacity: "show"},
        fadeOut: {opacity: "hide"},
        fadeToggle: {opacity: "toggle"}
    }, function (a, b) {
        $.fn[a] = function (a, c, d) {
            return this.animate(b, a, c, d)
        }
    }), $.speed = function (a, b, c) {
        var d = a && "object" == typeof a ? $.extend({}, a) : {
            complete: c || !c && b || $.isFunction(a) && a,
            duration: a,
            easing: c && b || b && !$.isFunction(b) && b
        };
        return d.duration = $.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in $.fx.speeds ? $.fx.speeds[d.duration] : $.fx.speeds._default, null != d.queue && d.queue !== !0 || (d.queue = "fx"), d.old = d.complete, d.complete = function () {
            $.isFunction(d.old) && d.old.call(this), d.queue && $.dequeue(this, d.queue)
        }, d
    }, $.easing = {
        linear: function (a) {
            return a
        }, swing: function (a) {
            return .5 - Math.cos(a * Math.PI) / 2
        }
    }, $.timers = [], $.fx = K.prototype.init, $.fx.tick = function () {
        var a, c = $.timers, d = 0;
        for (Ub = $.now(); d < c.length; d++)a = c[d], !a() && c[d] === a && c.splice(d--, 1);
        c.length || $.fx.stop(), Ub = b
    }, $.fx.timer = function (a) {
        a() && $.timers.push(a) && !Vb && (Vb = setInterval($.fx.tick, $.fx.interval))
    }, $.fx.interval = 13, $.fx.stop = function () {
        clearInterval(Vb), Vb = null
    }, $.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    }, $.fx.step = {}, $.expr && $.expr.filters && ($.expr.filters.animated = function (a) {
        return $.grep($.timers, function (b) {
            return a === b.elem
        }).length
    });
    var _b = /^(?:body|html)$/i;
    $.fn.offset = function (a) {
        if (arguments.length)return a === b ? this : this.each(function (b) {
            $.offset.setOffset(this, a, b)
        });
        var c, d, e, f, g, h, i, j = {top: 0, left: 0}, k = this[0], l = k && k.ownerDocument;
        if (l)return (d = l.body) === k ? $.offset.bodyOffset(k) : (c = l.documentElement, $.contains(c, k) ? ("undefined" != typeof k.getBoundingClientRect && (j = k.getBoundingClientRect()), e = M(l), f = c.clientTop || d.clientTop || 0, g = c.clientLeft || d.clientLeft || 0, h = e.pageYOffset || c.scrollTop, i = e.pageXOffset || c.scrollLeft, {
            top: j.top + h - f,
            left: j.left + i - g
        }) : j)
    }, $.offset = {
        bodyOffset: function (a) {
            var b = a.offsetTop, c = a.offsetLeft;
            return $.support.doesNotIncludeMarginInBodyOffset && (b += parseFloat($.css(a, "marginTop")) || 0, c += parseFloat($.css(a, "marginLeft")) || 0), {
                top: b,
                left: c
            }
        }, setOffset: function (a, b, c) {
            var d = $.css(a, "position");
            "static" === d && (a.style.position = "relative");
            var l, m, e = $(a), f = e.offset(), g = $.css(a, "top"), h = $.css(a, "left"), i = ("absolute" === d || "fixed" === d) && $.inArray("auto", [g, h]) > -1, j = {}, k = {};
            i ? (k = e.position(), l = k.top, m = k.left) : (l = parseFloat(g) || 0, m = parseFloat(h) || 0), $.isFunction(b) && (b = b.call(a, c, f)), null != b.top && (j.top = b.top - f.top + l), null != b.left && (j.left = b.left - f.left + m), "using"in b ? b.using.call(a, j) : e.css(j)
        }
    }, $.fn.extend({
        position: function () {
            if (this[0]) {
                var a = this[0], b = this.offsetParent(), c = this.offset(), d = _b.test(b[0].nodeName) ? {
                    top: 0,
                    left: 0
                } : b.offset();
                return c.top -= parseFloat($.css(a, "marginTop")) || 0, c.left -= parseFloat($.css(a, "marginLeft")) || 0, d.top += parseFloat($.css(b[0], "borderTopWidth")) || 0, d.left += parseFloat($.css(b[0], "borderLeftWidth")) || 0, {
                    top: c.top - d.top,
                    left: c.left - d.left
                }
            }
        }, offsetParent: function () {
            return this.map(function () {
                for (var a = this.offsetParent || P.body; a && !_b.test(a.nodeName) && "static" === $.css(a, "position");)a = a.offsetParent;
                return a || P.body
            })
        }
    }), $.each({scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function (a, c) {
        var d = /Y/.test(c);
        $.fn[a] = function (e) {
            return $.access(this, function (a, e, f) {
                var g = M(a);
                return f === b ? g ? c in g ? g[c] : g.document.documentElement[e] : a[e] : void(g ? g.scrollTo(d ? $(g).scrollLeft() : f, d ? f : $(g).scrollTop()) : a[e] = f)
            }, a, e, arguments.length, null)
        }
    }), $.each({Height: "height", Width: "width"}, function (a, c) {
        $.each({padding: "inner" + a, content: c, "": "outer" + a}, function (d, e) {
            $.fn[e] = function (e, f) {
                var g = arguments.length && (d || "boolean" != typeof e), h = d || (e === !0 || f === !0 ? "margin" : "border");
                return $.access(this, function (c, d, e) {
                    var f;
                    return $.isWindow(c) ? c.document.documentElement["client" + a] : 9 === c.nodeType ? (f = c.documentElement, Math.max(c.body["scroll" + a], f["scroll" + a], c.body["offset" + a], f["offset" + a], f["client" + a])) : e === b ? $.css(c, d, e, h) : $.style(c, d, e, h)
                }, c, g ? e : b, g, null)
            }
        })
    }), a.jQuery = a.$ = $, "function" == typeof define && define.amd && define.amd.jQuery && define("jquery", [], function () {
        return $
    })
}(window), function (a) {
    a.encoding || (a.encoding = {}), a.extend(a.encoding, {
        strToBe32s: function (a) {
            var d, e, b = [], c = Math.floor(a.length / 4);
            for (d = 0, e = 0; d < c; d++, e += 4)b[d] = (255 & a.charCodeAt(e)) << 24 | (255 & a.charCodeAt(e + 1)) << 16 | (255 & a.charCodeAt(e + 2)) << 8 | 255 & a.charCodeAt(e + 3);
            for (; e < a.length;)b[e >> 2] |= (255 & a.charCodeAt(e)) << 24 - 8 * e % 32, e++;
            return b
        }, be32sToStr: function (a) {
            for (var b = "", c = 0; c < 32 * a.length; c += 8)b += String.fromCharCode(a[c >> 5] >>> 24 - c % 32 & 255);
            return b
        }, be32sToHex: function (a) {
            for (var b = "0123456789ABCDEF", c = "", d = 0; d < 4 * a.length; d++)c += b.charAt(a[d >> 2] >> 8 * (3 - d % 4) + 4 & 15) + b.charAt(a[d >> 2] >> 8 * (3 - d % 4) & 15);
            return c
        }
    })
}(jQuery), function (a) {
    function b(a, b) {
        function c(a, b) {
            var c = (65535 & a) + (65535 & b), d = (a >> 16) + (b >> 16) + (c >> 16);
            return d << 16 | 65535 & c
        }

        function d(a, b, c, d, e) {
            b = b >>> 27 | b << 5;
            var f = (65535 & a) + (65535 & b) + (65535 & c) + (65535 & d) + (65535 & e), g = (a >> 16) + (b >> 16) + (c >> 16) + (d >> 16) + (e >> 16) + (f >> 16);
            return g << 16 | 65535 & f
        }

        function e(a, b) {
            var c = a[b - 3] ^ a[b - 8] ^ a[b - 14] ^ a[b - 16];
            return c >>> 31 | c << 1
        }

        var f = 8 * b;
        a[f >> 5] |= 128 << 24 - f % 32, a[(f + 64 >> 9 << 4) + 15] = f;
        for (var g = new Array(80), h = 1518500249, i = 1859775393, j = 2400959708, k = 3395469782, l = 1732584193, m = 4023233417, n = 2562383102, o = 271733878, p = 3285377520, q = 0; q < a.length; q += 16) {
            for (var s, r = 0, t = l, u = m, v = n, w = o, x = p; r < 16;)g[r] = a[q + r], s = d(x, t, w ^ u & (v ^ w), g[r], h), x = w, w = v, v = u >>> 2 | u << 30, u = t, t = s, r++;
            for (; r < 20;)g[r] = e(g, r), s = d(x, t, w ^ u & (v ^ w), g[r], h), x = w, w = v, v = u >>> 2 | u << 30, u = t, t = s, r++;
            for (; r < 40;)g[r] = e(g, r), s = d(x, t, u ^ v ^ w, g[r], i), x = w, w = v, v = u >>> 2 | u << 30, u = t, t = s, r++;
            for (; r < 60;)g[r] = e(g, r), s = d(x, t, u & v | w & (u | v), g[r], j), x = w, w = v, v = u >>> 2 | u << 30, u = t, t = s, r++;
            for (; r < 80;)g[r] = e(g, r), s = d(x, t, u ^ v ^ w, g[r], k), x = w, w = v, v = u >>> 2 | u << 30, u = t, t = s, r++;
            l = c(l, t), m = c(m, u), n = c(n, v), o = c(o, w), p = c(p, x)
        }
        return [l, m, n, o, p]
    }

    a.encoding.digests || (a.encoding.digests = {}), a.extend(a.encoding.digests, {
        hexSha1Str: function (b) {
            return a.encoding.be32sToHex(a.encoding.digests.sha1Str(b))
        }, sha1Str: function (c) {
            return b(a.encoding.strToBe32s(c), c.length)
        }, sha1: function (c, d) {
            return b(a.encoding.strToBe32s(str), str.length)
        }
    })
}(jQuery), function (a) {
    var b = "customStyleSheet";
    a.twStylesheet = function (a, c) {
        c = c || {};
        var d = c.id || b, e = c.doc || document, f = e.getElementById(d);
        e.createStyleSheet ? (f && f.parentNode.removeChild(f), e.getElementsByTagName("head")[0].insertAdjacentHTML("beforeEnd", '&nbsp;<style id="' + d + '" type="text/css">' + a + "</style>")) : f ? f.replaceChild(e.createTextNode(a), f.firstChild) : (f = e.createElement("style"), f.type = "text/css", f.id = d, f.appendChild(e.createTextNode(a)), e.getElementsByTagName("head")[0].appendChild(f))
    }, a.twStylesheet.remove = function (a) {
        a = a || {};
        var c = a.id || b, d = a.doc || document, e = d.getElementById(c);
        e && e.parentNode.removeChild(e)
    }
}(jQuery);