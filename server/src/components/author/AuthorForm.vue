<template>
  <div class="container">
    <div class="card">
      <h1 class="form-title">{{ formTitle }}</h1>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Author Name</label>
          <input type="text" id="name" v-model="author.name" required />
        </div>
        <button type="submit">Save Author</button>
      </form>
    </div>
  </div>
</template>
<script>
import { getAuthorById, createAuthor, updateAuthor } from '@/services/api/author';

export default {
  data() {
    return {
      authors: [],
    };
  },
  async created() {
    this.authors = await getAuthors();
  },
  methods: {
    viewDetails(id) {
      this.$router.push(`/authors/${id}`);
    },
    createAuthor() {
      this.$router.push('/authors/create');
    },
  },
};
</script>

<style scoped>
@import '@/assets/styles/global.css';
</style>