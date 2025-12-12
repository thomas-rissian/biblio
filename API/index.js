import express from 'express';
import bookRouter from './src/route/bookRouter.js';
import authorRouter from './src/route/authorRouter.js';
import categoryRouter from './src/route/categoryRouter.js';
import { prisma } from './lib/prisma.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Mount routers
app.use('/api/v1/books', bookRouter);
app.use('/api/v1/authors', authorRouter);
app.use('/api/v1/categories', categoryRouter);

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Internal Server Error' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {});
  console.log(`Server is running on port http://localhost:${PORT}`);
}

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  if (server) {
    server.close();
  }
  process.exit(0);
});

export default app;
