<template>
  <div id="app">
    <nav>
      <router-link to="/">Accueil</router-link>
      <router-link to="/books">Livres</router-link>
      <router-link to="/authors">Auteurs</router-link>
      <router-link to="/categories">Catégories</router-link>
      <router-link to="/statistiques">Statistique</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
/* Quelques styles de base */
nav {
  margin-bottom: 20px;
}
nav a {
  margin-right: 10px;
  text-decoration: none;
  color: #42b983;
}
nav a:hover {
  text-decoration: underline;
}
</style>
