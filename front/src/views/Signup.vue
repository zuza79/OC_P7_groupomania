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
  },
methods: {
    signup() {
      const data = {
          nom: this.nom,
          prenom: this.prenom,
          email: this.email,
          password: this.password
      };

      const regexText = /^[a-zA-Z-\s]+$/;
      const regexEmail = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/; // eslint-disable-line
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

          fetch("http://localhost:8080/api/auth/signup", {
              method: "POST",
              headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          })
          .then(response => {
            if(response.ok) {
              return response.json()
            } else {
              return response.text()
              .then((text) => {
                throw new Error(text)}
              )
            }
          })  
          .then(() => {
              alert("Votre inscription est bien prise en compte");
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
    width: 50%;
}
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