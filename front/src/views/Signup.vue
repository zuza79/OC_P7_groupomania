<template>
  <div>
    <Header />
    <div class="signup">
      <h1>Inscription</h1>
      <h2>Nous sommes ravis de vous accueillir chez Groupomania.</h2>
      <p>Veillez saisir les informations demander et outiliser votre email professionel par example: "jean.dupont@groupomania.com"</p>
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
      image:'',
    }
  },
methods: {
  // message confir/err
        signupMessage(message){
            this.message = message;
        },
  //create new user
    signup() {
      let data = {
          nom: this.nom,
          prenom: this.prenom,
          email: this.email,
          password: this.password,
          image: this.image
      }
      
      const regexText = /^[a-zA-Z-\s]+$/;
      const regexEmail = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/; 
      const regexPassword = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{3,50}$/;

      if (this.nom === "") {
          alert("Veuillez remplir votre nom");
      } else if (regexText.test(this.nom) === false) {
          alert("Veuillez vérifier que l'écriture de votre nom soit uniquement en lettre");}
      
      if (this.prenom === "") {
          alert("Veuillez remplir votre prénom");
      } else if (regexText.test(this.prenom) === false) {
          alert("Veuillez vérifier que l'écriture de votre prénom soit uniquement en lettre");}

      if (this.email === "") {
          alert("Veuillez remplir votre adresse email");
      } else if (regexEmail.test(this.email) === false) {
          alert("Veuillez écrire une adresse email valide");}

      if (this.password === "") {
          alert("Veuillez remplir votre mot de passe");
      } else if (regexPassword.test(this.password) === false) {
          alert("Veuillez vérifier l'écriture de votre mot de passe, il doit contenir au moins une majuscule, une minuscule ainsi qu'un chiffre");
      }else if ((regexText.test(this.nom) === true) && regexText.test(this.prenom) === true && regexEmail.test(this.email) === true && regexPassword.test(this.password) === true ) {

          axios.post("http://localhost:3000/api/auth/signup", data, {
             // method: "POST",
              headers: {
             // 'Accept': 'application/json',
              'Content-Type': 'application/json'
              }
          })

              .then(() => this.signupMessage('OK'))
                .catch(() => this.signupMessage('erreur'))
        }
    }
    }
}
</script>


<style scoped>
form{
    width: 80%;
    
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
  margin-bottom: 30px;
  
}

input {
  font-size: 1.2rem;
  text-align: center;
}

/*
.btnSave{
    background-color: rgb(105, 206, 105);
}
*/
.signup {
  display: flex;
  flex-direction: column;
  align-items: center;
}
footer{
  padding: 0;
}

::placeholder {
  text-align: center;
  }


/*------------ desktop-----------------*/
/*@media screen and (min-width: 950px) {

  h1{
    width:  25%;
  }

}
*/






</style>