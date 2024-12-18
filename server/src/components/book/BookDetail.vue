<template>
  <div class="container">
    <div class="card detail-card">
      <h1 class="detail-title">{{ book.title }}</h1>
      <div class="book-info">
        <p><strong>Author:</strong> {{ author.name }}</p>
        <p><strong>Categories:</strong>
          <span v-for="(category, index) in book.categories" :key="category.id">
            {{ category.name }}
            <span v-if="index < book.categories.length - 1">, </span>
          </span>

        </p>
      </div>
      <button @click="editBook" class="edit-button">Edit Book</button>
    </div>
  </div>
</template>

<script>
import { getBookById } from '@/services/api/book';
import { getAuthors } from '@/services/api/author';
import { getCategories } from '@/services/api/categorie';
export default {
  data() {
    return {
      book: null,
      author: null,
      categories: [],
    };
  },
  async created() {
    const bookId = this.$route.params.id;
    this.book = await getBookById(bookId);

    // Récupérer l'auteur du livre
    this.author = await getAuthors().then((authors) => authors.find((author) => author.id === this.book.authorId));

    // Récupérer les catégories du livre
    this.categories = await getCategories().then((categories) =>
        categories.filter((category) => this.book.categoryIds.includes(category.id))
    );
  },
  methods: {
    editBook() {
      this.$router.push(`/books/${this.book.id}/edit`); // Redirection vers la page de modification
    },
  },
};
</script>

<style scoped>
@import '@/assets/styles/global.css';

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.card {
  padding: 20px;
  max-width: 600px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.detail-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.book-info {
  font-size: 18px;
  margin-bottom: 20px;
}

.edit-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-button:hover {
  background-color: #45a049;
}
</style>