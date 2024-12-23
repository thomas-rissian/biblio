<template>
  <List :deleteObject ="deleteBook" :route ="'books'" :getItems = "getBooksByAuthor" :title="this.title"/>
</template>
<script>
import {getBooksByAuthor, deleteBook, getBooksByCategory} from '@/services/api/book';
import { getCategoryById } from '@/services/api/categorie.js';
import List from '@/components/modals/List.vue';

export default {
  name: 'BookCategoriesList',
  components: {
    List,
  },
  data() {
    return {
      title:"",
    };
  },
  async created() {
    const author = await getCategoryById(this.$route.params.id) ||"";
    this.title = `Livre de ${author.name}`;
  },
  methods: {
    getBooksByAuthor(){
      return getBooksByCategory(this.$route.params.id);
    },
    deleteBook,
  },
};
</script>
