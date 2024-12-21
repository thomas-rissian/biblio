import { createRouter, createWebHistory } from 'vue-router';

// Importer les routes spécifiques des livres, auteurs et catégories
import bookRoutes from './book.js';
import authorRoutes from './author.js';
import categoryRoutes from './categories.js';
import statistiqueRoutes from './statistique.js';



// Créer une instance du routeur
const router = createRouter({
    history: createWebHistory(),
    routes: [
        ...bookRoutes,
        ...authorRoutes,
        ...categoryRoutes,
        ...statistiqueRoutes,
    ],
});

export default router;
