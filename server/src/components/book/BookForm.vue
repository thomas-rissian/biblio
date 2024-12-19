<template>
  <div class="container">
    <div class="card form-card">
      <h1>{{ book.id ? 'Modification Livre' : 'Création Livre' }}</h1>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title">Titre du Livre</label>
          <input
              type="text"
              id="title"
              v-model="book.title"
              @input="validateField"
              placeholder="Entrez le titre du livre"
          />
          <div v-if="formErrors.title" class="error-message">
            {{ formErrors.title }}
          </div>
        </div>

        <div class="form-group">
          <label for="authorId">Auteur</label>
          <select v-model="book.authorId" @change="validateField" required>
            <option disabled value="">Sélectionnez un auteur</option>
            <option v-for="author in authors" :key="author.id" :value="author.id">{{ author.name }}</option>
          </select>
          <div v-if="formErrors.author" class="error-message">
            {{ formErrors.author }}
          </div>
        </div>

        <div class="form-group">
          <label>Catégories</label>
          <div v-for="category in categories" :key="category.id">
            <input
                type="checkbox"
                :id="`category-${category.id}`"
                :value="category.id"
                v-model="book.categoryIds"
                @change="validateField"
            />
            <label :for="`category-${category.id}`">{{ category.name }}</label>
          </div>
          <div v-if="formErrors.categories" class="error-message">
            {{ formErrors.categories }}
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
              id="description"
              v-model="book.description"
              @input="validateField"
              placeholder="Entrez la description du livre"
          ></textarea>
          <div v-if="formErrors.description" class="error-message">
            {{ formErrors.description }}
          </div>
        </div>

        <div class="form-group">
          <label for="publicationDate">Date de Publication</label>
          <input
              type="date"
              id="publicationDate"
              v-model="book.publicationDate"
              @input="validateField"
          />
          <div v-if="formErrors.publicationDate" class="error-message">
            {{ formErrors.publicationDate }}
          </div>
        </div>

        <div v-if="formErrors.global && formErrors.global.length > 0" class="error-message">
          <ul>
            <li v-for="(error, index) in formErrors.global" :key="index">{{ error }}</li>
          </ul>
        </div>

        <button type="submit" :disabled="!isFormValid">Enregistrer le Livre</button>
      </form>
    </div>
  </div>
</template>

<script>
import { Book } from '@/model/Book';
import { getBookById, createBook, updateBook } from '@/services/api/book';
import { getAuthors } from '@/services/api/author';
import { getCategories } from '@/services/api/categorie.js';

export default {
  data() {
    return {
      book: {
        title: '',
        authorId: null,
        categoryIds: [],
        description: '',
        publicationDate: '',
      },
      authors: [],
      categories: [],
      formErrors: {},  // Erreurs de validation pour chaque champ
    };
  },
  async created() {
    this.authors = await getAuthors();
    this.categories = await getCategories();
    if (this.$route.params.id) {
      const book = await getBookById(this.$route.params.id);
      this.book = book;
      if (this.book.publicationDate) {
        this.book.publicationDate = new Date(this.book.publicationDate).toISOString().split('T')[0];
      }
      this.book.categoryIds = book.categories.map(category => category.id);
    }
  },
  computed: {
    isFormValid() {
      return !Object.values(this.formErrors).some(error => error);
    },
  },
  methods: {
    // Valider tous les champs à la fois
    validateField() {
      const bookModel = new Book(this.book);
      const errors = bookModel.validate(this.book.id !== undefined);

      this.formErrors = {};

      errors.forEach(error => {
        const [field, message] = Object.entries(error)[0];
        this.formErrors[field] = message;
      });
    },

    async handleSubmit() {

      this.validateField();

      // Si des erreurs existent, ne pas envoyer le formulaire
      if (Object.values(this.formErrors).some(error => error)) {
        return;
      }

      try {
        if (this.$route.params.id) {
          await updateBook(this.$route.params.id, this.book);
        } else {
          await createBook(this.book);
        }
        this.$router.push('/books');
      } catch (error) {
        console.error("Erreur lors de l'enregistrement du livre:", error);
        this.formErrors.global = ['Une erreur s\'est produite lors de l\'enregistrement du livre.'];
      }
    },
  },
};
</script>

<style scoped>
@import '@/assets/styles/global.css';

</style>
