<template>
  <div>
    <Header />
    <div class="login">
      <h1>Se connecter</h1>
      <form>
        <ul>
          <li>
            <input type="email" v-model="email" placeholder="Email" size="50" required aria-label="Email de connection">
          </li>
          <li>
            <input type="password" v-model="password" placeholder="Password" size="50" required aria-label="Mot de passe de connection">
          </li>
        </ul>  
      </form>
      <button @click="login()" type="submit" aria-label="Se connecter">Se connecter</button>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from "../components/Header";
import Footer from "../components/Footer";

export default {
  name: 'login',
  components: {
    Header,
    Footer
  },

  data() {
    return {
      email: '',
      password: '',
    }
  }
}
</script>

<style scoped>

h1 {
    margin: 30px 0 50px 0;
    width: 50%;
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

button {
  margin-top: 30px;
  padding: 5px 30px ;
  border: 2px solid #fd2d01;
  border-radius: 20px;
  background: #ffd7d7;
  font-size: 1rem;
  cursor: pointer;
}

input {
  font-size: 1.2rem;
}

.login {
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