<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    detail: {
      type: Boolean,
      default: true,
    },
    deleteObject: {
      type: Function,
      required: true,
    },
  },
  methods: {
    detailItem(id) {
      if (this.detail) {
        this.$router.push(`/${this.url}/${id}`);
      }
    },
    async deleteItem(id) {
      await this.deleteObject(id);
      this.$emit('newItems', this.items.filter((item) => item.id !== id));
    },
    editItem(id) {
      this.$router.push(`/${this.url}/${id}/edit`);
    },
  },
};
</script>

<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <p @click="detailItem(item.id)">{{ item.name || item.title }}</p>
      <div class="btnConfig">
        <button @click="editItem(item.id)">Editer</button>
        <button @click="deleteItem(item.id)">Supprimer</button>
      </div>
    </li>
  </ul>
</template>

<style scoped>
@import '@/assets/styles/global.css';
</style>
