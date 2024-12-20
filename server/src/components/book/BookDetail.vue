<template>
  <background :title="book.title" :url="'/books/'+this.book.id+'/edit'" :item="book"type="base">
    <Simple :url="'/authors/'+this.author.id" :text='author.name' field="Auteur"type="base"></Simple>
    <Simple :text='book.categories' url="/books/categories/" field="Catégories" type="listInline"></Simple>
    <Simple :text='book.description' field="Description" type="base"></Simple>
    <Simple :text='book.publicationDate' field="Date de publication" type="date"></Simple>
  </background>
</template>

<script>
import { getBookById } from '@/services/api/book';
import Simple from "@/components/modals/detail/simple.vue";
import Background from "@/components/modals/detail/backgroundInfo.vue";

export default {
  components: {Background, Simple},
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
      this.book = await getBookById(bookId);

      this.author = this.book.author;
    }
  },

};
</script>

<style scoped>
@import '@/assets/styles/global.css';

</style>
