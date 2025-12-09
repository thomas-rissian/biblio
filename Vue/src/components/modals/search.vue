<script>
import ListItem from "@/components/modals/listItem.vue";
import Background from "@/components/modals/background.vue";
import * as sea from "node:sea";

export default {
  props: {
    itemsBackup:{
      type: Array,
      required: true
    }
  },
  components: {ListItem, Background},
  methods:{
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
          if (search.key === "author" && search.value) {
            if (item.author && !item.author.name.toLowerCase().includes(search.value.toLowerCase())) {
              match = false;
              break;
            }
          }else if (search.key === "categories" && search.value) {
            if (item.categories && item.categories.length > 0) {
              let categoryMatch = false;

              for (const category of item.categories) {
                if (category.name && category.name.toLowerCase().includes(search.value.toLowerCase())) {
                  categoryMatch = true;
                  break;
                }
              }
              if (!categoryMatch) {
                match = false;
                break;
              }
            }
          }else if(search.key.toLowerCase().includes("date") && search.value) {
            const itemDate = new Date(item[search.key]);
            if(!itemDate.toLocaleString().includes(search.value.toLowerCase())) {
              match = false;
              break;
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

      this.$emit('filtered-items', filteredItems);
    }
  }

}
</script>

<template>
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
</template>

<style scoped>
@import '@/assets/styles/global.css';

</style>