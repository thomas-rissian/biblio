<template>
  <div class="container">
    <div class="card">
      <h1 class="form-title">Authors</h1>
      <button @click="createAuthor">Add New Author</button>
      <ul>
        <li v-for="author in authors" :key="author.id" >
          <p @click="detailAuthor(author.id)">{{ author.name }}</p>
          <div class ="btnConfig">
            <button @click="editAuthor(author.id)">Edit</button>
            <button @click="deleteAuthor(author.id)">Delete</button>
          </div>

        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getAuthors, deleteAuthor } from '@/services/api/author';

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
    async deleteAuthor(id) {
      await deleteAuthor(id);
      this.authors = this.authors.filter((author) => author.id !== id);
    },
    detailAuthor(id){
      this.$router.push(`/authors/${id}`);
    },
    editAuthor(id) {
      this.$router.push(`/authors/${id}/edit`);
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