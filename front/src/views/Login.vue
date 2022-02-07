<template>
  <div>
    <Header />
    <div class="login">
      <h1>Connection</h1>
      <p>Veuillez saisir votre email de chez Groupomania et votre mot de pass.
      <form>
        <ul>
          <li>
            <input type="email" v-model="email" placeholder="jean.dupont@groupomania.com" size="50" required aria-label="Email de connection">
          </li>
          <li>
            <input type="password" v-model="password" placeholder="Pass2word" size="50" required aria-label="Mot de passe de connection">
          </li>
        </ul>  
      </form>
      <div class="alert alert-danger" v-if="loginFailure">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Email ou mot de passe incorrect
      </div>
      <button @click.prevent="login()" type="submit" aria-label="Se connecter" class="btnSave">Valider</button>
    </div>
    <Footer />
  </div>
</template>

<script>
import axios from 'axios'
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
      loginFailure: false
    }
  },
methods: {
    login() {
      let data = {
          email: this.email,
          password: this.password
      };

      axios.post("http://localhost:3000/api/auth/login", {user: data})
       
      
     .then((res) => {
                    localStorage.setItem('userId', parseInt(res.data.userId));
                    localStorage.setItem('token', res.data.token);
                    this.$router.push('/allposts')
                })
                .catch((err) => {
                    console.log("erreur : " + err);
                    this.loginFailure = true;
                })  
        
   /*   .then((value) => {
        const token = JSON.stringify(value.token);
        const userId = JSON.stringify(value.userId);
        const role = JSON.stringify(value.role);
        localStorage.setItem("userToken", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("role", role);
        this.$router.push("/allposts");
      })
      .catch((err) => {
                    console.log("erreur : " + err);
                    this.loginFailure = true;
                })
       */          
    }
  }
 
}
</script>

<style scoped>

form{
    width: 80%;
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
  text-align: center;
}

.login {
  display: flex;
  flex-direction: column;
  align-items: center;
}

::placeholder {
  text-align: center;
}
.alert{
  color:red;
  font-weight: bolder;
}
/*------------ desktop-----------------*/
@media screen and (min-width: 950px) {

  h1{
    width:  25%;
  }
}

</style>