<template>
  <section class="app">
    <router-view></router-view>
  </section>
</template>

<style>
body{
  margin: 0px;
}
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 0 10vw 0 10vw;
  text-align: center;
  color: #000000;
  background: rgba(207, 203, 203, 0.877);
}
h1 {
    width: 70%;
    font-size: 45px;
    padding: 10px;
    margin: auto;
    color: rgb(5, 5, 100);
}
.button {
    margin: 20px 0 10px 0;
    padding: 5px 30px ;
    border: 2px solid black;
    border-radius: 10px;
    text-decoration: none;
    color: #000000;
    background: gray;
    font-size: 15px;
    cursor: pointer;
}
/* icone home - return to="/allposts" */
/*   <router-link to="/allposts" aria-label="Retour ver Le Flash Actu Groupomania"><i class="fas fa-home home"></i></router-link>  */
.fa-home
{
    width: 50px;
    height: 50px;
    position: relative;
    border-radius: 100%;
    background: gray;
    
    cursor: pointer; 
    
     text-align: center;
     color: green;   
     
    }

@media screen and (max-width:1024px) {
  .app {
    padding: 0;
  }
}
</style>
