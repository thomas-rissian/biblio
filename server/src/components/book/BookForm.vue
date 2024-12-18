<template>
  <div class="container">
    <div class="card form-card">
      <h1>{{ book.id ? 'Edit Book' : 'Create Book' }}</h1>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title">Title</label>
          <input
              type="text"
              id="title"
              v-model="book.title"
              required
              placeholder="Enter book title"
          />
        </div>
        <div class="form-group">
          <label for="author">Author</label>
          <select v-model="book.authorId" required>
            <option disabled value="">Select an author</option>
            <option v-for="author in authors" :key="author.id" :value="author.id">
              {{ author.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Categories</label>
          <div v-for="category in categories" :key="category.id">
            <input
                type="checkbox"
                :id="`category-${category.id}`"
                :value="category.id"
                v-model="book.categoryIds"
            />
            <label :for="`category-${category.id}`">{{ category.name }}</label>
          </div>
          <div v-if="!isCategoryValid" class="error-message">
            You must select at least one category.
          </div>
        </div>
        <button type="submit" :disabled="!isFormValid">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import { getBookById, createBook, updateBook } from '@/services/api/book';
import { getAuthors } from '@/services/api/author';
import { getCategories } from '@/services/api/categorie';

export default {
  data() {
    return {
      book: {
        title: '',
        authorId: null,
        categoryIds: [], // multiple categories selected by their IDs
      },
      authors: [],
      categories: [],
      formTitle: 'Create New Book',
    };
  },
  async created() {
    this.authors = await getAuthors();
    this.categories = await getCategories();

    // Si un ID de livre est passé dans l'URL, chargez les détails pour modification
    if (this.$route.params.id) {
      this.formTitle = 'Edit Book';
      const book = await getBookById(this.$route.params.id);
      this.book = book;

      // Initialiser les catégories sélectionnées pour modification
      this.book.categoryIds = book.categories.map(category => category.id);
    }
  },
  computed: {
    isCategoryValid() {
      return this.book.categoryIds.length > 0;
    },
    isFormValid() {
      return this.book.title && this.book.authorId && this.isCategoryValid;
    }
  },
  methods: {
    async handleSubmit() {
      if (this.$route.params.id) {
        // Si un livre est trouvé, mettez à jour
        await updateBook(this.$route.params.id, this.book);
      } else {
        // Si c'est un nouveau livre, créez-le
        await createBook(this.book);
      }
      this.$router.push('/books'); // Redirige vers la liste des livres
    },
  },
};
</script>

<style scoped>
@import '@/assets/styles/global.css';
</style>
