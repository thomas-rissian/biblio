<template>
  <div class="container">
    <div class="card">
      <h1 class="form-title">Categories</h1>
      <button @click="createCategory">Add New Category</button>
      <ul>
        <li v-for="category in categories" :key="category.id" @click="viewDetails(category.id)">
          <p>{{ category.name }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getCategories, deleteCategory } from '@/services/api/categorie.js';

export default {
  data() {
    return {
      categories: [],
    };
  },
  async created() {
    this.categories = await getCategories();
  },
  methods: {
    viewDetails(id) {
      this.$router.push(`/categories/${id}`);
    },
    createCategory() {
      this.$router.push('/categories/create');
    },
  },
};
</script>

<style scoped>
@import '@/assets/styles/global.css';
</style>