<template>
  <List :deleteObject ="deleteCategory" :route ="'categories'" :getItems = "getCategories" :title="'Catégories'" :detail="false"/>
</template>

<script>
import {getCategories, deleteCategory, getCategoryById} from '@/services/api/categorie.js';
import List from "@/components/modals/List.vue";

export default {
  components: {List},
  methods: {
    getCategories,
    deleteCategory,

  },
};
</script>

<style scoped>
@import '@/assets/styles/global.css';
</style>