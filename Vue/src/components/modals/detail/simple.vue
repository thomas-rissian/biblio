<script>
export default {
  props: {
    field:{
      type: String,
      required: true
    },
    text:{
      type: String,
      required: true
    },
    url:{
      type: String,
      default:null,
    },
    type:{
      default: null,
    },
    items:{
      default: null,
      type: Array,
    }
  },
  methods: {
    click(newUrl = null) {
      if (newUrl) {
        this.$router.push(newUrl);
      }else if(this.url){
        this.$router.push(this.url);
      }
    },
  },
  computed:{
    formattedDate() {
      return this.text ? new Date(this.text).toLocaleDateString() : 'Non spécifiée';
    },
  },

};
</script>

<template>
  <p>
    <strong>{{ field }}:</strong>
    <a
        v-if="type === 'base'"
        @click="click()"
        href="javascript:void(0)"
        class="clickMe"
    >
      {{ text }}
    </a>
    <span v-else-if="type === 'date'">{{formattedDate}}</span>
    <span v-else-if="type === 'listInline'" v-for="(item, index) in text" :key="item.id">
            <a class="clickMe" @click="click(this.url+item.id)">{{ item.name || item.title}}</a>
            <span v-if="index < text.length - 1">, </span>
          </span>
    <span v-else>{{ text }}</span>

    <ul v-if ="items !== null && type==='list'">

      <li v-for="item in items" :key="item.id" @click="click(this.url.replace('replace', item.id))">
        {{item.title || item.name}}
      </li>
    </ul>
  </p>
</template>

<style scoped>
@import '@/assets/styles/global.css';
</style>