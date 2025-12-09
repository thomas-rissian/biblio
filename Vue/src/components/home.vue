<script >
import {defineComponent} from "vue";
import Background from "@/components/modals/background.vue";

export default defineComponent({
  components: {Background}
})


</script>

<template>
  <background title="Accueil" :item="{}">
    <p>Bienvenue sur Biblio, votre gestionnaire de livre!</p>
    <p>Il est composé en 4 parties : </p>
    <ul>
      <li>Livres : liste des livres et permet leurs suppressions et modification et son clique permet de voir
        le détail</li>
      <li>Auteurs : liste les auteurs, permet de les modifier, supprimer et leurs selections permet de voir les livres
        de l'auteur </li>
      <li>Catégories : liste les catégories de livre disponible, permet leurs suppressions et modifcation et le clique
        permet de voir les livres de la catégories</li>
      <li>Statistique : vous verrez sous forme de graphique, le nombre de livre par catégories</li>
    </ul>
  </background>
</template>

<style scoped>
@import '@/assets/styles/global.css';

</style>