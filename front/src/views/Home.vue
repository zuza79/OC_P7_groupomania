<template>
  <div>
    <Header />
    <h1>Bienvenue sur le Groupoman le reseau social de notre entreprise <strong>Groupomania</strong></h1>
    
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
  color: #fd2d01;
  padding: 70px 0 50px 0;
  font-size: 2rem;
}

h3 {
  color: #fd2d01;
}

h4{
  margin-top: 50px;
  color: #fd2d01;
  font-size: 1.2rem;
}

.tab{
  display: flex;
  justify-content: center;
}



@media screen and (max-width:768px) {

  
}
</style>