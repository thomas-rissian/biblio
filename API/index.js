const http = require('http');
const PORT = 40000;
const router = require('./src/route/router');

const server = http.createServer((req, res) => {
    // Ajouter les en-têtes CORS
    res.setHeader('Access-Control-Allow-Origin', '*');  // Autorise toutes les origines
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');  // Méthodes autorisées
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');  // En-têtes autorisés

    // Si c'est une requête OPTIONS (pré-vol), répondre avec les en-têtes CORS et status 204
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Redirige la requête vers ton routeur
    router(req, res);
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
