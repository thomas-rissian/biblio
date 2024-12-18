import { createRouter, createWebHistory } from 'vue-router';

// Importer les routes spécifiques des livres, auteurs et catégories
import bookRoutes from './book.js';
import authorRoutes from './author.js';
import categoryRoutes from './categories.js';

// Créer une instance du routeur
const router = createRouter({
    history: createWebHistory(),
    routes: [
        ...bookRoutes, // Ajouter les routes des livres
        ...authorRoutes, // Ajouter les routes des auteurs
        ...categoryRoutes, // Ajouter les routes des catégories
    ],
});

export default router;
