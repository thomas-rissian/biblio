<template>
  <background :title="this.categories.name" :url="'/categories/'+this.categories.id" :item="this.categories">
    <Simple :text='this.bookCategories.length' :field="'Livres '" type="list" :items = "this.bookCategories" url="/books/replace"></Simple>
  </background>
</template>

<script>
import { getBooksByCategory} from '@/services/api/book.js';
import { getCategoryById} from '@/services/api/categorie.js';

import Simple from "@/components/modals/detail/simple.vue";
import Background from "@/components/modals/detail/backgroundInfo.vue";

export default {
  components: {Background, Simple},
  data() {
    return {
      bookCategories: [],
      categories:null,
      books: [],
    };
  },
  async created() {
    this.categories = await getCategoryById(this.$route.params.id);
    this.bookCategories = await getBooksByCategory(this.categories.id);
  },
};
</script>

<style scoped>
@import '@/assets/styles/global.css';

</style>
