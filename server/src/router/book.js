import { createRouter, createWebHistory } from 'vue-router';
import BookList from '@/components/book/BookList.vue';
import BookForm from '@/components/book/BookForm.vue';
import BookDetail from '@/components/book/BookDetail.vue';
import BookCategoriesList from "@/components/book/BookCategoriesList.vue";
import BookAuthorsList from "@/components/book/BookAuthorsList.vue";

const bookRoutes = [
    {
        path: '/books',
        name: 'book-list',
        component: BookList, // Vue pour afficher la liste des livres
    },
    {
        path: '/books/create',
        name: 'create-book',
        component: BookForm, // Vue pour créer un livre
    },
    {
        path: '/books/:id',
        name: 'book-detail',
        component: BookDetail, // Vue pour afficher les détails d'un livre
        props: true,
    },
    {
        path: '/books/:id/edit',
        name: 'edit-book',
        component: BookForm, // Vue pour modifier un livre
        props: true,
    },
    {
        path: '/books/categories/:id/',
        name: 'categories-book',
        component: BookCategoriesList, // Vue pour modifier un livre
        props: true,
    },
    {
        path: '/books/authors/:id/',
        name: 'authors-book',
        component: BookAuthorsList, // Vue pour modifier un livre
        props: true,
    },
];

export default bookRoutes;
