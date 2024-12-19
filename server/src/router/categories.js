import { createRouter, createWebHistory } from 'vue-router';
import CategoryList from '@/components/categories/CategoryList.vue';
import CategoryForm from '@/components/categories/CategoryForm.vue';

const categoryRoutes = [
    {
        path: '/categories',
        name: 'category-list',
        component: CategoryList, // Vue pour afficher la liste des catégories
    },
    {
        path: '/categories/create',
        name: 'create-category',
        component: CategoryForm, // Vue pour créer une catégorie
    },
    {
        path: '/categories/:id/edit',
        name: 'edit-category',
        component: CategoryForm, // Vue pour modifier une catégorie
        props: true,
    },
    {
        path: '/categories/:id/delete',
        name: 'delete-category',
        component: CategoryForm,
        props: true,
    },
];

export default categoryRoutes;
