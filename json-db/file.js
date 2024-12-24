const fs = require("fs");
const path = require("path");

module.exports = (req, res, next) => {
    res.header("Access-Control-Expose-Headers", "Content-Range");
    res.header("Content-Range", "clients 0-24/2");

    const dbPath = path.join(__dirname, "db.json");
    const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

    const matchCategories = req.url.match(/^\/clients\/(\d+)\/categories$/);
    if (matchCategories) {
        const clientId = parseInt(matchCategories[1], 10);
        const client = db.clients.find(client => client.id === clientId);
        if (client && client.categories) {
            res.json(client.categories);
        } else {
            res.status(404).json({ error: "Client or categories not found" });
        }
    }

    const matchTags = req.url.match(/^\/clients\/(\d+)\/tags$/);
    if (matchTags) {
        const clientId = parseInt(matchTags[1], 10);
        const client = db.clients.find(client => client.id === clientId);
        if (client && client.tags) {
            res.json(client.tags);
        } else {
            res.status(404).json({ error: "Client or categories not found" });
        }
    }

    const matchConfigurations = req.url.match(/^\/configurations\/client\/(\d+)\/feature\/(\d+)$/);
    if (matchConfigurations) {
        const clientId = parseInt(matchConfigurations[1], 10);
        const featureId = parseInt(matchConfigurations[2], 10);
        const config = db.configurations.find(conf => conf.featureId === featureId && conf.clientId === clientId);
        if (config) {
            res.json([config]);
        } else {
            res.status(404).json({ error: "Feature not found" });
        }
    }

    const matchUsages = req.url.match(/^\/usages\/client\/(\d+)\/feature\/(\d+)$/);
    if (matchUsages) {
        const clientId = parseInt(matchUsages[1], 10);
        const featureId = parseInt(matchUsages[2], 10);
        const usage = db.usages.find(u => u.featureId === featureId && u.id.clientId === clientId);
        if (usage) {
            res.json([usage]);
        } else {
            res.status(404).json({ error: "Feature not found" });
        }
    }

    if (req.url === "/overview/10") {
        res.json([
            {
                id: 1,
                name: "Header",
                key: "header",
                shortName: "Header",
                description:
                    "Der Header ist eine Navigation für den Nutzer und kann ihn z.B. über featured und action Links durch die Seite leiten.",
                status: {
                    client: "ENABLED",
                    category: "NONE",
                    tag: "NONE",
                },
            },
            {
                id: 2,
                name: "Footer",
                key: "footer",
                shortName: "Footer",
                description: "Im Footer können weitere Links zu wichtigen Seiten gesetzt werden.",
                status: {
                    client: "ENABLED",
                    category: "NONE",
                    tag: "NONE",
                },
            },
        ]);
    }

    if (req.url === "/overview/20") {
        res.json([
            {
                id: 1,
                name: "Header",
                key: "header",
                shortName: "Header",
                description:
                    "Der Header ist eine Navigation für den Nutzer und kann ihn z.B. über featured und action Links durch die Seite leiten.",
                status: {
                    client: "ENABLED",
                    category: "NONE",
                    tag: "NONE",
                },
            },
            {
                id: 2,
                name: "Footer",
                key: "footer",
                shortName: "Footer",
                description: "Im Footer können weitere Links zu wichtigen Seiten gesetzt werden.",
                status: {
                    client: "ENABLED",
                    category: "NONE",
                    tag: "NONE",
                },
            },
        ]);
    }

    next();
};
