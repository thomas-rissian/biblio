<template>
  <div class="container">
    <div class="card">
      <h1 class="form-title">{{ formTitle }}</h1>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Nom de la Catégorie</label>
          <input
              type="text"
              id="name"
              v-model="category.name"
              @input="validateField"
              required
          />
          <div v-if="formErrors.name" class="error-message">
            {{ formErrors.name }}
          </div>
        </div>
        <button type="submit" :disabled="!isFormValid">Enregistrer la Catégorie</button>
      </form>
    </div>
  </div>
</template>

<script>
import {createCategory, getCategoryById, updateCategory} from '@/services/api/categorie.js';
import {Category} from '@/model/Category'; // Assurez-vous que le modèle est importé

export default {
  data() {
    return {
      category: {
        name: '',
      },
      formErrors: {}, // Objet pour stocker les erreurs de validation
      formTitle: 'Créer une Nouvelle Catégorie',
    };
  },
  async created() {
    if (this.$route.params.id) {
      this.formTitle = 'Modifier la Catégorie';
      this.category = await getCategoryById(this.$route.params.id);
    }
  },
  computed: {
    isFormValid() {
      return !Object.values(this.formErrors).some(error => error); // Si aucune erreur n'est présente
    },
  },
  methods: {
    // Valider le champ de la catégorie
      validateField() {
      const categoryModel = new Category(this.category);
      const errors = categoryModel.validate(this.category.id !== undefined);

      // Réinitialiser les erreurs
      this.formErrors = {};

      // Remplir formErrors avec les erreurs de validation
      errors.forEach(error => {
        const [field, message] = Object.entries(error)[0];
        this.formErrors[field] = message;
      });
    },

    // Soumettre le formulaire
    async handleSubmit() {
      this.validateField(); // Valider avant la soumission

      // Si des erreurs existent, ne pas soumettre le formulaire
      if (Object.values(this.formErrors).some(error => error)) {
        return;
      }

      try {
        if (this.$route.params.id) {
          await updateCategory(this.$route.params.id, this.category);
        } else {
          await createCategory(this.category);
        }
        this.$router.push('/categories');
      } catch (error) {
        this.formErrors.global = ['Une erreur s\'est produite lors de l\'enregistrement de la catégorie.'];
      }
    },
  },
};
</script>

<style scoped>
@import '@/assets/styles/global.css';

</style>
