const http = require('http');
const PORT = 40000;
const router = require('./src/route/router');

const server = http.createServer(router);

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
