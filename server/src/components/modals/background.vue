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
    },
    url:{
      type: String,
      required: true,
    }
  },
  methods: {
    edit(){
      this.$router.push(this.url);
    }
  }
}
</script>

<template>
  <div class="container">
    <!-- Détail du livre -->
    <div v-if="item" class="card detail-card">
      <h1 class="detail-title">{{ title }}</h1>
      <div class="book-info">
      <slot></slot>
      </div>
      <button @click="edit" class="edit-button">Modifier</button>
    </div>

  </div>
</template>

<style scoped>
@import '@/assets/styles/global.css';
</style>