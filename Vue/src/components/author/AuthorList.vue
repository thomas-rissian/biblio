<template>
  <List :deleteObject ="deleteAuthor" :route ="'authors'" :getItems = "getAuthors" :title="'Auteur'"/>
</template>
<script>
import List from '@/components/modals/List.vue';
import { getAuthors, deleteAuthor } from '@/services/api/author';

export default {
  name: 'BookList',
  components: {
    List,
  },
  methods: {
    getAuthors,
    deleteAuthor,
  },
};
</script>
