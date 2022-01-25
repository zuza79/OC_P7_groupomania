<template>
  <div>
    <Header />
    
    <h1>Bienvenue chez GROUPOGRAM le réseau social de notre l'entreprise <strong>GROUPOMANIA</strong></h1>
       
    <Footer />
  </div>
</template>

<script>
import Header from "../components/Header";
import Footer from "../components/Footer";

export default {
  name: 'home',
  components: {
    Header,
    Footer
  },
}

</script>

<style scoped>
h1 {
  color: #71b6ad;
  padding: 70px 0 50px 0;
  font-size: 20px;
}
@media screen and (max-width:768px) {
}
</style>