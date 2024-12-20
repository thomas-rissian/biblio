
<script>
import * as sea from "node:sea";

export default {
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
    }
  },
  async created() {
    this.items = await this.getItems();
    console.log(this.items);
    this.itemsBackup = this.items;
    this.count = this.items.length;
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
    validateField() {
      const filteredItems = [];
      const searchInputs = Object.keys(this.itemsBackup[0])
          .filter(key => !key.toLowerCase().includes('id')) // Exclure les champs contenant "Id"
          .map((key) => {
            const input = document.getElementById(key);
            return { key, value: input ? input.value : "" };
          });

      for (const item of this.itemsBackup) {
        let match = true;
        for (const search of searchInputs) {
          // Vérification pour le champ 'author' avec le nom de l'auteur
          if (search.key === "author" && search.value) {
            if (item.author && !item.author.name.toLowerCase().includes(search.value.toLowerCase())) {
              match = false;
              break;
            }
          }else if (search.key === "categories" && search.value) {
            // Vérifie si l'élément a des catégories
            if (item.categories && item.categories.length > 0) {
              let categoryMatch = false;

              // Vérifie chaque catégorie pour voir si l'une d'elles contient la valeur recherchée
              for (const category of item.categories) {
                if (category.name && category.name.toLowerCase().includes(search.value.toLowerCase())) {
                  categoryMatch = true;
                  break;  // Si une catégorie correspond, on arrête la boucle
                }
              }

              // Si aucune catégorie ne correspond, on marque comme non correspondant
              if (!categoryMatch) {
                match = false;
                break;
              }
            }
          }
          else if (search.value && item[search.key] && !item[search.key].toString().toLowerCase().includes(search.value.toLowerCase())) {
            match = false;
            break;
          }
        }
        if (match) {
          filteredItems.push(item);
        }
      }

      this.items = filteredItems;
    }
  },
};
</script>

<template>
  <div class="container">
    <div class="card">
      <h1 class="form-title">{{title}}</h1>
      <p>Nombre : {{count}}</p>
      <div class="addButton">
        <button @click="createItem">Ajouter</button>
      </div>
      <div class="search-bar">
        <div v-if="this.itemsBackup.length > 0" v-for="item in Object.keys(this.itemsBackup[0])" :key="item" class="search">
          <template v-if="!item.toLowerCase().includes('id')">
            <label :for="item">{{ item }}</label>
            <input
                type="text"
                :id="item"
                @input="validateField"
            />
          </template>
        </div>
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