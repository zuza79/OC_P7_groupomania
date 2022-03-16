<template>
  <section id="app">
    <router-view></router-view>
  </section>
</template>

<style>
body{
  margin: 0px;
  background-color: rgba(207, 203, 203, 0.877);
}
section{
  margin:0px;
}
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000000;
  background: rgba(207, 203, 203, 0.877);
}
h1 {
    width: 70%;
    font-size: 40px;
    margin: 0 auto 20px auto;
    color: rgb(5, 5, 100);
}

h2{
  font-size: 20px;
   margin: 0 auto 20px auto;
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
.btnSave{
    background-color: rgb(105, 206, 105);
    font-weight: bolder;
    font-size: 15px;
    margin: 20px 0 10px 0;
    padding: 5px 30px ;
    border-radius: 10px;
    text-decoration: none;
    color: #000000;
    cursor: pointer;
}
.btnDelete{
    background-color: indianred;
    font-weight: bolder;
    font-size: 15px;
    margin: 20px 0 10px 0;
    padding: 5px 30px ;
    border-radius: 10px;
    text-decoration: none;
    color: #000000;
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
     color: white;   
    display: flex;
    justify-content: center; 
    margin: 20px auto 0 auto;
    align-items: center;
    }

    .fa-turn-down-left
    {
    width: 100px;
    height: 50px;
    position: relative;
    border-radius: 20px;
    background: gray;
    cursor: pointer; 
    text-align: center;
     color: white;   
    display: flex;
    justify-content: center; 
    margin: 20px auto 0 auto;
    align-items: center;
    }

@media screen and (max-width:1024px) {
  .app {
    padding: 0;
  }
}
</style>
