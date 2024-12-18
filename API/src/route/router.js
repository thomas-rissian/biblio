const bookRoutes = require('./bookRouter');
const authorRoutes = require('./authorRouter');
const categoryRoutes = require('./categoryRouter');

// Fusionner toutes les route
const allRoutes = [...bookRoutes, ...authorRoutes, ...categoryRoutes];

const router = async (req, res) => {
    const { url, method } = req;
    // Parcours des route pour trouver une correspondance
    for (const route of allRoutes) {
        const match = url.match(route.pattern);
        if (match && method === route.method) {
            return route.handler(req, res, match);
        }
    }
    // Si aucune route ne correspond
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
};

module.exports = router;

