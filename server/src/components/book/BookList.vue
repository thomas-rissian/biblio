<template>
  <div class="container">
    <div class="card">
      <h1 class="form-title">Books</h1>
      <button @click="createBook">Add New Book</button>
      <ul>
        <li v-for="book in books" :key="book.id" @click="viewDetails(book.id)">
          <p>{{ book.title }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { getBooks, deleteBook } from '@/services/api/book';

export default {
  data() {
    return {
      books: [],
    };
  },
  async created() {
    this.books = await getBooks();
  },
  methods: {
    viewDetails(id) {
      this.$router.push(`/books/${id}`);
    },
    createBook() {
      this.$router.push('/books/create');
    },
  },
};
</script>

<style scoped>
@import '@/assets/styles/global.css';
</style>