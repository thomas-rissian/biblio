import CategoryList from '@/components/categories/CategoryList.vue';
import CategoryForm from '@/components/categories/CategoryForm.vue';
import CategoryDetail from "@/components/categories/CategoryDetail.vue";

const categoryRoutes = [
    {
        path: '/categories',
        name: 'category-list',
        component: CategoryList,
    },
    {
        path: '/categories/:id',
        name: 'category-detail',
        component: CategoryDetail,
    },
    {
        path: '/categories/create',
        name: 'create-category',
        component: CategoryForm,
    },
    {
        path: '/categories/:id/edit',
        name: 'edit-category',
        component: CategoryForm,
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
