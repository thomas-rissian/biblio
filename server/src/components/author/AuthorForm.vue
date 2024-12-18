<template>
  <div class="container">
    <div class="card form-card">
      <h1>{{ author.id ? 'Modification Auteur' : 'Création Auteur' }}</h1>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Nom de l'Auteur</label>
          <input
              type="text"
              id="name"
              v-model="author.name"
              @input="validateField"
              placeholder="Entrez le nom de l'auteur"
          />
          <div v-if="formErrors.name" class="error-message">
            {{ formErrors.name }}
          </div>
        </div>

        <div class="form-group">
          <label for="birthDate">Date de Naissance</label>
          <input
              type="date"
              id="birthDate"
              v-model="author.birthDate"
              @input="validateField"
          />
          <div v-if="formErrors.birthDate" class="error-message">
            {{ formErrors.birthDate }}
          </div>
        </div>

        <div class="form-group">
          <label for="deathDate">Date de Décès</label>
          <input
              type="date"
              id="deathDate"
              v-model="author.deathDate"
              @input="validateField"
          />
          <div v-if="formErrors.deathDate" class="error-message">
            {{ formErrors.deathDate }}
          </div>
        </div>

        <div class="form-group">
          <label for="biography">Biographie</label>
          <textarea
              id="biography"
              v-model="author.biography"
              @input="validateField"
              placeholder="Écrivez une courte biographie"
          ></textarea>
          <div v-if="formErrors.biography" class="error-message">
            {{ formErrors.biography }}
          </div>
        </div>

        <div v-if="formErrors.global && formErrors.global.length > 0" class="error-message">
          <ul>
            <li v-for="(error, index) in formErrors.global" :key="index">{{ error }}</li>
          </ul>
        </div>

        <button type="submit" :disabled="!isFormValid">Enregistrer l'Auteur</button>
      </form>
    </div>
  </div>
</template>

<script>
import { Author } from '@/model/Author';
import { getAuthorById, createAuthor, updateAuthor } from '@/services/api/author';

export default {
  data() {
    return {
      author: {
        name: '',
        birthDate: null,
        deathDate: null,
        biography: '',
      },
      formErrors: {},  // Utilisation d'un objet pour les erreurs de chaque champ
    };
  },
  async created() {
    if (this.$route.params.id) {
      const author = await getAuthorById(this.$route.params.id);
      this.author = author;
    }
  },
  computed: {
    isFormValid() {
      return !Object.values(this.formErrors).some(error => error); // Vérifie qu'il n'y a pas d'erreurs
    },
  },
  methods: {
    // Valider tous les champs à la fois
    validateField() {
      const authorModel = new Author(this.author);
      const errors = authorModel.validate(this.author.id !== undefined);

      // Réinitialiser les erreurs
      this.formErrors = {};

      // Remplir formErrors avec les erreurs de validation
      errors.forEach(error => {
        const [field, message] = Object.entries(error)[0];
        this.formErrors[field] = message;
      });
    },

    async handleSubmit() {
      // Valider tous les champs avant la soumission
      this.validateField();

      // Si des erreurs existent, ne pas envoyer le formulaire
      if (Object.values(this.formErrors).some(error => error)) {
        return;
      }

      try {
        if (this.$route.params.id) {
          await updateAuthor(this.$route.params.id, this.author);
        } else {
          await createAuthor(this.author);
        }
        this.$router.push('/authors');
      } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'auteur:", error);
        this.formErrors.global = ['Une erreur s\'est produite lors de l\'enregistrement de l\'auteur.'];
      }
    },
  },
};
</script>

<style scoped>
@import '@/assets/styles/global.css';

</style>
