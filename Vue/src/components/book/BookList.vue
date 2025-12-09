<template>
  <List :deleteObject ="deleteBook" :route ="'books'" :getItems = "getBooks" :title="'Livre'"/>
</template>
<script>
import { getBooks, deleteBook } from '@/services/api/book';
import List from '@/components/modals/List.vue';

export default {
  name: 'BookList',
  components: {
    List,
  },
  methods: {
    getBooks,
    deleteBook,
  },
};
</script>
