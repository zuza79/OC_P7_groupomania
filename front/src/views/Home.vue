<template>
  <div>
    <Header />
    <h1>Bienvenue chez GROUPOMAN</h1>
    <h2>Réseau social de notre entreprise</h2> 
    
    <router-link to="/signup" class="link" aria-label="Inscription">Inscription</router-link>
    <router-link to="/login" class="link" aria-label="Connection">Connection</router-link>
          
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
h1 {
  color: black;
  font-size: 2rem;
}
.tab{
  display: flex;
  justify-content: center;
}

.link {
  color: blue;
  font-weight: bolder;
  margin: 10px;
  font-size: 1.2rem;
  text-decoration: none;
  background: #ffd7d7;
    border: 2px solid #fd2d01;
    border-radius: 20px;
}

.link:hover {
  color: #fd2d01;

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
  color: #fd2d01;
}

@media screen and (max-width:1024px) {
   .link {
    padding: 0 30px;
  }
}

@media screen and (max-width:768px) {
  .link {
    padding: 0 30px;
    font-size: 15px;
  }
}

</style>