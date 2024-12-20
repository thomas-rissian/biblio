<template>
  <div class="container">
    <!-- Détail du livre -->
    <div v-if="book" class="card detail-card">
      <h1 class="detail-title">{{ book.title }}</h1>
      <div class="book-info">
        <p><strong>Auteur:</strong > <a class="clickMe" @click="click('/books/authors/'+author.id)">{{ author.name }}</a></p>
        <p><strong>Catégories:</strong>
          <span v-for="(category, index) in book.categories" :key="category.id">
            <a class="clickMe" @click="click('/books/categories/'+category.id)">{{ category.name }}</a>
            <span v-if="index < book.categories.length - 1">, </span>
          </span>
        </p>
        <p><strong>Description:</strong> {{ book.description }}</p>
        <p><strong>Date de publication:</strong> {{ formattedPublicationDate }}</p>
      </div>
      <button @click="editBook" class="edit-button">Modifier le Livre</button>
    </div>

    <!-- Formulaire de création ou modification du livre -->
    <div v-else class="card form-card">
      <h1>{{ book.id ? 'Modification du Livre' : 'Création du Livre' }}</h1>
      <form @submit.prevent="handleSubmit">
        <!-- Titre -->
        <div class="form-group">
          <label for="title">Titre du Livre</label>
          <input
              type="text"
              id="title"
              v-model="book.title"
              placeholder="Entrez le titre du livre"
          />
        </div>

        <!-- Auteur -->
        <div class="form-group">
          <label for="authorId">Auteur</label>
          <select v-model="book.authorId" required>
            <option disabled value="">Sélectionnez un auteur</option>
            <option v-for="author in authors" :key="author.id" :value="author.id">{{ author.name }}</option>
          </select>
        </div>

        <!-- Catégories -->
        <div class="form-group">
          <label>Catégories</label>
          <div v-for="category in categories" :key="category.id">
            <input
                type="checkbox"
                :id="`category-${category.id}`"
                :value="category.id"
                v-model="book.categoryIds"
            />
            <label :for="`category-${category.id}`">{{ category.name }}</label>
          </div>
        </div>

        <!-- Description -->
        <div class="form-group">
          <label for="description">Description</label>
          <textarea
              id="description"
              v-model="book.description"
              placeholder="Entrez la description du livre"
          ></textarea>
        </div>

        <!-- Date de publication -->
        <div class="form-group">
          <label for="publicationDate">Date de Publication</label>
          <input
              type="date"
              id="publicationDate"
              v-model="book.publicationDate"
          />
        </div>

        <button type="submit">Enregistrer le Livre</button>
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
      book: null,
      author: null,
      authors: [],
      categories: [],
    };
  },
  async created() {
    const bookId = this.$route.params.id;
    if (bookId) {
      // Récupérer le livre par son ID
      this.book = await getBookById(bookId);

      // Récupérer l'auteur du livre
      this.author = await getAuthors().then((authors) => authors.find((author) => author.id === this.book.authorId));

      // Récupérer les catégories du livre
      this.categories = await getCategories().then((categories) =>
          categories.filter((category) => this.book.categoryIds.includes(category.id))
      );
    }

    // Récupérer la liste des auteurs et catégories pour le formulaire
    this.authors = await getAuthors();
    this.categories = await getCategories();
  },
  computed: {
    // Formater la date de publication
    formattedPublicationDate() {
      return this.book && this.book.publicationDate ? new Date(this.book.publicationDate).toLocaleDateString() : 'Non spécifiée';
    },
  },
  methods: {
    click(route){
      this.$router.push(route);
    },
    // Gérer la soumission du formulaire
    async handleSubmit() {
      if (this.book.id) {
        await updateBook(this.book.id, this.book);
      } else {
        await createBook(this.book);
      }
      this.$router.push('/books');
    },
    // Gérer la modification du livre
    editBook() {
      this.$router.push(`/books/${this.book.id}/edit`);
    },
  },
};
</script>

<style scoped>
@import '@/assets/styles/global.css';



</style>
