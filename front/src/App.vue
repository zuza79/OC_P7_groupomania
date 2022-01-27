<template>
  <section class="app">
    <router-view></router-view>
  </section>
</template>

<style>
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 0 10vw 0 10vw;
  text-align: center;
  color: #000000;
}

@media screen and (max-width:1024px) {
  .app {
    padding: 0;
  }
}
</style>
