<script>
import Background from "@/components/modals/background.vue";

export default {
  components: {Background},
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
    },

  },
  methods: {
    edit(){
      this.$router.push(this.url);
    }
  }
}
</script>

<template>
  <Background :item="this.item" :title="this.title">

      <div class="book-info">
      <slot></slot>
      </div>

      <button @click="edit" class="edit-button">Modifier</button>
  </Background>
</template>

<style scoped>
@import '@/assets/styles/global.css';
</style>