<template>
  <div class="container">
    <div class="card">
      <h1 class="form-title">Categories</h1>
      <button @click="createCategory">Add New Category</button>
      <ul>
        <li v-for="category in categories" :key="category.id">
          <p>{{ category.name }}</p>
          <div class ="btnConfig">
            <button @click="editCategory(category.id)">Edit</button>
            <button @click="deleteCategory(category.id)">Delete</button>
          </div>

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
    async deleteCategory(id) {
      await deleteCategory(id);
      this.categories = this.categories.filter((categorie) => categorie.id !== id);
    },
    editCategory(id) {
      this.$router.push(`/categories/${id}/edit`);
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