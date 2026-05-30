app.version = function () {
    return API.runtime.getManifest().version;
};

if (!navigator.webdriver) {
    app.on.uninstalled(LINKS.support);
    app.on.installed(function(e) {
        app.on.management(function(result) {
            if (result.installType === "normal") {
                app.tab.query.index(function(index) {
                    const previous = e.previousVersion !== undefined && e.previousVersion !== app.version();
                    const doupdate = previous && parseInt((Date.now() - config.welcome.lastupdate) / (24 * 3600 * 1000)) > 45;
                    if (e.reason === "install" || (e.reason === "update" && doupdate)) {
                        app.tab.open(LINKS.support, index, e.reason === "install");
                        config.welcome.lastupdate = Date.now();
                    }
                });
            }
        });
    });
}

app.on.message(function(request, sender) {
    if (request) {
        if (request.path === "popup-to-background") {
            for (const id in app.popup.message) {
                if (app.popup.message[id]) {
                    if ((typeof app.popup.message[id]) === "function") {
                        if (id === request.method) {
                            app.popup.message[id](request.data);
                        }
                    }
                }
            }
        }
    }
});

app.on.connect(function(port) {
    if (port) {
        if (port.name) {
            if (port.name in app) {
                app[port.name].port = port;
            }
        }
        /*  */
        port.onDisconnect.addListener(function(e) {
            app.storage.load(function() {
                if (e) {
                    if (e.name) {
                        if (e.name in app) {
                            app[e.name].port = null;
                        }
                    }
                }
            });
        });
        /*  */
        port.onMessage.addListener(function(e) {
            app.storage.load(function() {
                if (e) {
                    if (e.path) {
                        if (e.port) {
                            if (e.port in app) {
                                if (e.path === (e.port + "-to-background")) {
                                    for (const id in app[e.port].message) {
                                        if (app[e.port].message[id]) {
                                            if ((typeof app[e.port].message[id]) === "function") {
                                                if (id === e.method) {
                                                    app[e.port].message[id](e.data);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
        });
    }
});
