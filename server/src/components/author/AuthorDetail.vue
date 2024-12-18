<template>
  <div class="container">
    <!-- Détail de l'auteur -->
    <div v-if="author" class="card detail-card">
      <h1 class="detail-title">{{ author.name }}</h1>
      <div class="author-info">
        <p><strong>Biographie:</strong> {{ author.biography || 'Non spécifiée' }}</p>
        <p><strong>Date de Naissance:</strong> {{ formattedBirthDate }}</p>
        <p v-if="author.deathDate"><strong>Date de Mort:</strong> {{ formattedDeathDate }}</p>
        <p><strong>Livres Écrits:</strong></p>
        <ul>
          <li v-for="book in booksByAuthor" :key="book.id" @click="bookLink(book.id)">
            {{book.title}}
          </li>
        </ul>
        <ul>
          <li v-for="book in books" :key="book.id">
            <router-link :to="`/books/${book.id}`">{{ book.title }}</router-link>
          </li>
        </ul>
      </div>

      <button @click="editAuthor" class="edit-button">Modifier l'Auteur</button>
    </div>
  </div>
</template>

<script>
import { getAuthorById } from '@/services/api/author';
import { getBooks, getBooksByAuthor} from '@/services/api/book';

export default {
  data() {
    return {
      author: null,
      books: [],
      booksByAuthor: [],
    };
  },
  async created() {
    const authorId = this.$route.params.id;

    // Récupérer les détails de l'auteur
    this.author = await getAuthorById(authorId);

    // Récupérer les livres écrits par l'auteur
    this.books = await getBooks().then((allBooks) =>
        allBooks.filter((book) => book.authorId === authorId)
    );
    this.booksByAuthor = await getBooksByAuthor(this.author.id);
  },
  computed: {
    // Formater la date de naissance
    formattedBirthDate() {
      return this.author && this.author.birthDate
          ? new Date(this.author.birthDate).toLocaleDateString()
          : 'Non spécifiée';
    },
    formattedDeathDate() {
      return this.author && this.author.deathDate
          ? new Date(this.author.deathDate).toLocaleDateString()
          : 'Non spécifiée';
    },
  },
  methods: {
    getBooksByAuthor,
    // Rediriger vers la page de modification de l'auteur
    editAuthor() {
      this.$router.push(`/authors/${this.author.id}/edit`);
    },
    bookLink(id){
      this.$router.push(`/books/${id}`);
    }
  },
};
</script>

<style scoped>
@import '@/assets/styles/global.css';

</style>
