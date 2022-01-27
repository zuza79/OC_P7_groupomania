<template>
  <div>
    <Header />
    <div class="signup">
      <h1>Inscription</h1>
      <form>
        <ul>
          <li>
            <input type="text" v-model="nom" placeholder="Nom" size="50" required aria-label="Nom">
          </li>
          <li>
            <input type="text" v-model="prenom" placeholder="Prénom" size="50" required aria-label="Prénom">
          </li>
          <li>
            <input type="email" v-model="email" placeholder="Email" size="50" required aria-label="Email">
          </li>
          <li>
            <input type="password" v-model="password" placeholder="Password" size="50" required aria-label="Mot de passe">
          </li>
        </ul>
      </form>   
      <button @click="signup()" type="submit" aria-label="S'inscrire">S'inscrire</button>
    </div>
    <Footer />
  </div>
</template>


<script>
import Header from "../components/Header";
import Footer from "../components/Footer";

export default {

  name: 'signup',
  components: {
    Header,
    Footer
  },

  data() {
    return {
      nom: '',
      prenom: '',
      email: '',
      password: '',
    }
  }
}
</script>


<style scoped>

h1 {
    width: 30%;
    font-size: 2rem;
    background: #ffd7d7;
    border: 2px solid #fd2d01;
    border-radius: 20px;
}

ul {
list-style: none;
padding: 0;
}

li {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 30px;
}

input {
  font-size: 1.2rem;
}

button {
  margin-top: 10px;
  padding: 5px 30px ;
  border: 2px solid #fd2d01;
  border-radius: 20px;
  background: #ffd7d7;
  font-size: 1rem;
  font-weight: bolder;
  cursor: pointer;
}

.signup {
  display: flex;
  flex-direction: column;
  align-items: center;
}

::placeholder {
  text-align: center;
}


@media screen and (max-width:1024px) {

    h1 {
        font-size: 1.5rem;
    }
    
    input,
    ::placeholder {
        font-size: 1rem;
    }


}

@media screen and (max-width:768px) {

    h1 {
        font-size: 1.2rem;
    }

    input,
    ::placeholder {
        font-size: 0.8rem;
    }
}

</style>