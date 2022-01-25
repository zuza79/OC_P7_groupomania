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
  padding: 0 100px 0 100px;
  text-align: center;
  color: #71b6ad;
}
/*RESPONSIVE*/
@media screen and (max-width:1024px) {
  .app {
    padding: 0;
  }
}

@media screen and (max-width:768px){
.app {
    padding: 0;
  }
}
</style>
