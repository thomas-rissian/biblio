<template>
  <div class="container">
    <div class="card">
      <h1 class="form-title">Books</h1>
      <button @click="createBook">Add New Book</button>
      <ul>
        <li v-for="book in books" :key="book.id" >
          <p @click="viewDetails(book.id)">{{ book.title }}</p>
          <div class ="btnConfig">
            <button @click="editBook(book.id)">Edit</button>
            <button @click="deleteBook(book.id)">Delete</button>
          </div>

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
    async deleteBook(id) {
      await deleteBook(id);
      this.books = this.books.filter((book) => book.id !== id);
    },
    editBook(id) {
      this.$router.push(`/books/${id}/edit`);
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