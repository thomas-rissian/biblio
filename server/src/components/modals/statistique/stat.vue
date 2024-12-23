<template>
  <div class="category-bar-chart">
    <h3 class="chart-title"><strong>Statistique : </strong>{{ title }}</h3>
    <div class="chart-container">
      <div
          v-for="data in datas"
          :key="data.id"
          class="category-item"
          @click="detail(data.id)"
      >
        <div
            class="bar"
            :style="{ height: calculateBarHeight(data.count) + 'px' }"
        ></div>
        <div class="category-count">{{ data.count }} livres</div>
        <div class="category-name">{{ data.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    datas: {
      type: Array,
      required: true,
      default: () => []
    },
    url: {
      type: String,
      required: true,
    },
    title: String,
  },
  methods: {
    // Méthode pour calculer la hauteur des barres
    calculateBarHeight(count) {
      const maxCount = Math.max(...this.datas.map(data => data.count)); // Trouver le nombre maximal
      const maxHeight = 300; // Hauteur maximale en pixels
      return (count / maxCount) * maxHeight; // Calculer la hauteur proportionnelle
    },
    detail(id) {
      this.$router.push(`/${this.url}/${id}`);
    }
  }
};
</script>

<style scoped>
@import '@/assets/styles/global.css';

</style>
