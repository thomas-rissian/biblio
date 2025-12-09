<template>
  <div class="category-statistics">
    <Stat :datas="datas" url="categories" title="Nombre de Livre par Catégories"/>
  </div>
</template>

<script>
import Stat from '@/components/modals/statistique/stat.vue';
import { countBookCategories } from '@/services/api/categorie.js';

export default {
  components: {
    Stat
  },
  data() {
    return {
      datas: []
    };
  },
  async created() {
    try {
      this.datas = await countBookCategories();
    } catch (error) {
      // error handled - keep user-friendly behavior
    }
  }
};
</script>

<style scoped>
</style>
