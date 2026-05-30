var core = {
    "start": function() {
        core.load();
    },
    "install": function() {
        core.load();
    },
    "load": function() {
       
    }
};

app.on.startup(core.start);
app.on.installed(core.install);
