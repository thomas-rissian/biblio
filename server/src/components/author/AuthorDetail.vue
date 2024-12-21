<template>
  <background :title="author.name" :url="'/authors/'+this.author.id" :item="author">
    <Simple :text='author.biography' field="Biographie"></Simple>
    <Simple :text='author.birthDate' field="Date de Naissance" type="date"></Simple>
    <Simple :text='author.deathDate' field="Date de décès" type="date"></Simple>
    <Simple :text='this.books.length' :field="'Livres Écrits'" type="list" :items = "books" url="/books/replace"></Simple>
  </background>
</template>

<script>
import { getAuthorById } from '@/services/api/author';
import {  getBooksByAuthor} from '@/services/api/book';
import Simple from "@/components/modals/detail/simple.vue";
import Background from "@/components/modals/detail/backgroundInfo.vue";
export default {
  components: {Background, Simple},
  data() {
    return {
      author: null,
      books: [],
    };
  },
  async created() {
    const authorId = this.$route.params.id;
    this.author = await getAuthorById(authorId);
    this.books = await getBooksByAuthor(authorId);
  },
  methods: {
    getBooksByAuthor,
  },
};
</script>

<style scoped>
@import '@/assets/styles/global.css';

</style>
