const http = require('http');
const PORT = 40000;
const router = require('./src/route/router');

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');  // Autorise toutes les origines
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');  // Méthodes autorisées
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');  // En-têtes autorisés

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    router(req, res);
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

module.exports = {
    PORT,
}