<template>
  <div class="container">
    <div class="card">
      <h1 class="form-title">{{ formTitle }}</h1>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Category Name</label>
          <input type="text" id="name" v-model="category.name" required />
        </div>
        <button type="submit">Save Category</button>
      </form>
    </div>
  </div>
</template>
<script>
import { getCategoryById, createCategory, updateCategory } from '@/services/api/categorie.js';
export default {
  data() {
    return {
      category: {
        name: '',
      },
      formTitle: 'Create New Category',
    };
  },
  async created() {
    if (this.$route.params.id) {
      this.formTitle = 'Edit Category';
      const category = await getCategoryById(this.$route.params.id);
      this.category = category;
    }
  },
  methods: {
    async handleSubmit() {
      if (this.$route.params.id) {
        await updateCategory(this.$route.params.id, this.category);
      } else {
        await createCategory(this.category);
      }
      this.$router.push('/categories');
    },
  },
};
</script>

<style scoped>
@import '@/assets/styles/global.css';
</style>