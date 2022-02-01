<template>
  <div>
    <Header />
    <body>
    <h1>Bienvenue chez GROUPOMAN</h1>
    <h2>Réseau social de notre entreprise</h2> 
    
    <nav class="routerLink">
    <router-link to="/signup" class="link" aria-label="Inscription">Inscription</router-link>
    <router-link to="/login" class="link" aria-label="Connection">Connection</router-link>
    </nav>
    </body>     
    <Footer />
  </div>
</template>

<script>
import Header from "../components/Header";
import Footer from "../components/Footer";

export default {
  name: 'Home',
  components: {
    Header,
    Footer
  }
                
}

</script>

<style scoped>
body{
  margin-bottom: 100px;
}

h2 {
  color: black;
  font-size: 1.2rem;
  padding: 0px;
  margin-bottom: 50px;
  }
.tab{
  display: flex;
  justify-content: center;
}
.routerLink{
  padding-top: 50px;
}
.link {
  height: 20px;
  color: black;
  font-weight: bolder;
  margin: 10px;
  padding : 10px 10px 10px 10px;
  font-size: 1.2rem;
  text-decoration: none;
  background: gray;
    border: 1px solid black;
    border-radius: 20px;
}

.link:hover {
  color: black;

}
.nav {
  padding: 20px 5vw;
  font-size: 1vw;
}

.nav a {
  font-weight: bold;
  color: #000000;
}

.nav a.router-link-exact-active {
  color: black;
}



</style>