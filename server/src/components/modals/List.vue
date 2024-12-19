
<script>
export default {
  data() {
    return {
      items: [],
    };
  },
  props: {
    deleteObject:{
      type: Function,
      required: true
    },
    route:{
      type: String,
      required: true,
      default:""
    },
    getItems:{
      type: Function,
      required: true
    },
    title:{
      type: String,
      required: true,
      default:""
    }
  },
  async created() {
    this.items = await this.getItems();
  },
  methods: {
    detailItem(id) {
      this.$router.push(`/${this.route}/${id}`);
    },
    async deleteItem(id) {
      await this.deleteObject(id);
      this.items = this.items.filter((item) => item.id !== id);
    },
    editItem(id) {
      this.$router.push(`/${this.route}/${id}/edit`);
    },
    createItem() {
      this.$router.push(`/${this.route}/create`);
    },
  },
};
</script>

<template>
  <div class="container">
    <div class="card">
      <h1 class="form-title">{{title}}</h1>
      <div>
        <button @click="createItem">Ajouter</button>
      </div>
      <ul>
        <li v-for="item in items" :key="item.id" >
          <p @click="detailItem(item.id)">{{ item.name || item.title }}</p>
          <div class ="btnConfig">
            <button @click="editItem(item.id)">Editer</button>
            <button @click="deleteItem(item.id)">Supprimer</button>
          </div>

        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/styles/global.css';
</style>