<template>
  <div>
    <Header />
    <div class="signup">
      <h1>Inscription</h1>
      <h2>Nous sommes ravis de vous accueillir chez Groupomania.</h2>
          <p>Veillez saisir les informations demander et outiliser votre email professionel</p> 
          <p>par example: "jean.dupont@groupomania.com"</p>
      <form>
        <ul>
          <li>
            <input type="text" v-model="nom" placeholder="dupont" size="50" required aria-label="Nom">
          </li>
          <li>
            <input type="text" v-model="prenom" placeholder="jean" size="50" required aria-label="Prénom">
          </li>
          <li>
            <input type="email" v-model="email" placeholder="jean.dupont@groupomania.com" size="50" required aria-label="Email">
          </li>
          <li>
            <input type="password" v-model="password" placeholder="Pass2word" size="50" required aria-label="Mot de passe">
          </li>
        </ul>
      </form>   
      <button @click.prevent="signup()" type="submit" aria-label="Inscription" class="btnSave"><i class="fas fa-edit"></i> Enregistrer </button>
    </div>
    <Footer />
  </div>
</template>


<script>
import axios from 'axios'
import Header from "../components/Header";
import Footer from "../components/Footer";

export default {
name: 'Signup',
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
  },

  methods: {
    //SIGNUP
    signup() {
      const regexText = /^[a-zA-Z-\s]+$/;
      const regexEmail = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/; 
      const regexPassword = /^(?=.*\d).{4,10}$/;

      if (this.nom === "") {
                alert("Veuillez remplir votre nom");
            } else if (regexText.test(this.nom) === false) {
                alert("Veuillez vérifier que l'écriture de votre nom soit uniquement en lettre");}

            if (this.prenom === "") {
                alert("Veuillez remplir votre prénom");
            } else if (regexText.test(this.prenom) === false) {
                alert("Veuillez vérifier que l'écriture de votre prénom soit uniquement en lettre");}

            if (this.email === "") {
                alert("Veuillez remplir votre adresse email ");
            } else if (regexEmail.test(this.email) === false) {
                alert("Veuillez écrire une adresse email valide xxxxx@groupomania.com");
            } else if (regexPassword.test(this.password) === false) {
                alert("Votre mot de passe doit contenir entre 4 et 10 caractères et au moins 1 letter majuscule, 1 chiffre")
            }
      let data = {
          nom: this.nom,
          prenom: this.prenom,
          email: this.email,
          password: this.password
      };
      {   
      axios.post("http://localhost:3000/api/auth/signup", data, {
          headers: { }
                 })
           .then(() => {
              alert("Inscription accepter");
              this.$router.push("/login");
          })
          .catch(alert)
      }
    }
  }
}
</script>

<style scoped>
form{
    width: 80%;
    margin: 10px auto 10px auto;
}
h2{
color:rgb(5, 5, 100);
}
p{
  font-size: 12px;
  margin: 0;
}
ul {
list-style: none;
padding: 0;
}
li {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
   margin: 0 auto 0 auto;
 }
input {
  width: 90%;
  font-size: 1.2rem;
  text-align: center;
  margin: 15px auto 15px auto;
}
.signup {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
footer{
  padding: 0;
}
::placeholder {
  text-align: center;
  }
/*------------ desktop-----------------*/
@media screen and (min-width: 950px) {
 input {
  width: 50%;
  font-size: 1.2rem;
  text-align: center;
}
}
</style>