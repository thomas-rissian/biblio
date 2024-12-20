
<script>
import * as sea from "node:sea";
import Background from "@/components/modals/background.vue";
import ListItem from "@/components/modals/listItem.vue";
import SearchBar from "@/components/modals/search.vue";

export default {
  components: {ListItem, Background,SearchBar},
  data() {
    return {
      items: [],
      itemsBackup: [],
      count: 0,
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
      required: true,
      default:""
    },
    detail:{
      default:true,
    }
  },
  async created() {
    this.items = await this.getItems();
    this.itemsBackup = this.items;
    this.count = this.items.length;
  },
  methods: {
    updateFilteredItems(items) {
      this.items = items;
    },
    createItem() {
      this.$router.push(`/${this.route}/create`);
    },

  },
};
</script>

<template>
  <Background :item="this.items" :title="title">
      <p>Nombre : {{count}}</p>
      <div class="addButton">
        <button @click="createItem">Ajouter</button>
      </div>
    <SearchBar :items-backup="this.itemsBackup" @filtered-items="updateFilteredItems"></SearchBar>
    <listItem :items="this.items" :url="this.route" :detail = "this.detail"></listItem>

  </Background>
</template>

<style scoped>
@import '@/assets/styles/global.css';
</style>