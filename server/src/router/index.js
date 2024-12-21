import { createRouter, createWebHistory } from 'vue-router';

// Importer les routes spécifiques des livres, auteurs et catégories
import bookRoutes from './book.js';
import authorRoutes from './author.js';
import categoryRoutes from './categories.js';
import statistiqueRoutes from './statistique.js';
import Home from "@/components/home.vue";



// Créer une instance du routeur
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        ...bookRoutes,
        ...authorRoutes,
        ...categoryRoutes,
        ...statistiqueRoutes,
        {
            path: '/:pathMatch(.*)*',
            redirect: '/'
        }

    ],
});

export default router;
