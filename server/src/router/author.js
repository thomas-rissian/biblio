import { createRouter, createWebHistory } from 'vue-router';
import AuthorList from '@/components/author/AuthorList.vue';
import AuthorForm from '@/components/author/AuthorForm.vue';
import AuthorDetail from '@/components/author/AuthorDetail.vue';

const authorRoutes = [
    {
        path: '/authors',
        name: 'author-list',
        component: AuthorList, // Vue pour afficher la liste des auteurs
    },
    {
        path: '/authors/create',
        name: 'create-author',
        component: AuthorForm, // Vue pour créer un auteur
    },
    {
        path: '/authors/:id',
        name: 'author-detail',
        component: AuthorDetail, // Vue pour afficher la liste des auteurs
    },
    {
        path: '/authors/:id/edit',
        name: 'edit-author',
        component: AuthorForm, // Vue pour modifier un auteur
        props: true,
    },
];

export default authorRoutes;
