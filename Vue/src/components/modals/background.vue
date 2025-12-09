<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      required: true,
    }
  }
}
</script>

<template>
  <div class="container">
    <!-- Détail du livre -->
    <div v-if="item" class="card ">
      <h1 class="detail-title">{{ title }}</h1>
      <div class="book-info">
        <slot></slot>
      </div>
    </div>

  </div>
</template>

<style scoped>
@import '@/assets/styles/global.css';
</style>