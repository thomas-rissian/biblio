<template>
  <List :deleteObject ="deleteBook" :route ="'books'" :getItems = "getBooksByAuthor" :title="this.title"/>
</template>
<script>
import { getBooksByAuthor, deleteBook } from '@/services/api/book';
import { getAuthorById } from '@/services/api/author.js';
import List from '@/components/modals/List.vue';

export default {
  name: 'BookAuthorsList',
  components: {
    List,
  },
  data() {
    return {
     title:"",
    };
  },
  async created() {
    const author = await getAuthorById(this.$route.params.id) || "";
    this.title = `Livre de ${author.name}`;
  },
  methods: {
    getBooksByAuthor(){
      return getBooksByAuthor(this.$route.params.id);
    },
    deleteBook,
  },
};
</script>
