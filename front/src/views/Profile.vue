<template>
    <div>
        <HeaderProfile />
        <div>
            <h1>Mon profil</h1>
           <p>Voir tout les publications??????</p>
           
                            
        <!--user info nom, prenom, email -->
            <form>
                <ul>
                    <li>
                        <input type="text" v-model="user.nom" placeholder="Nom" size="50" required aria-label="Nom de l'utilisateur">
                    </li>
                    <li>
                        <input type="text" v-model="user.prenom" placeholder="Prenom" size="50" required aria-label="Prénom de l'utilisateur">
                    </li>
                    <li>
                        <input type="email" v-model="user.email" placeholder="Email" size="50" required aria-label="Email de l'utilisateur">
                    </li>
                    </ul>
            </form>
            <nav class="modify" >

                <!--modify image -->
                    <div class="modifyImage" id="modifyImage">
                        <img v-if="user.image" :src="user.image" alt="Photo de profil" class="file" width="150px" height="150px" border-radius="15px">
                        <label v-if="!user.image" for="file" class="label-file" aria-label="Inserer votre photo de profil" ><i class="fas fa-upload"></i><br>Inserer <br>votre photo de profil</label>
                        <button v-else @click="deletefile()" class="label-file btnDelete" aria-label="Supprimer la photo de profil"> <i class="far fa-trash-alt"></i> Supprimer</button>
                        <input type="file" accept="image/jpeg, image/jpg, image/png, image/webp" v-on:change="uploadFile" id="file" class="input-file" aria-label="Photo de profil">
                    </div>
                <!--modify password -->
                    <div class="modifyPassword">
                        <button v-on:click="show" class="button">Modifier<br> mot de passe</button>
                        <li v-if="button">
                            <input v-model="oldPassword" type="text" placeholder="Ancien mot de passe" size="30" class="password">
                            <input v-model="newPassword" type="text" placeholder="Nouveau mot de passe" size="30" class="password">
                            <input v-model="confirmNewPassword" type="text" placeholder="Confirmer le mot de passe" size="30" class="password">
                            <button @click.prevent="modifyPassword()" class="btnSave"><i class="fas fa-edit"></i>Enregistrer nouveau mot de passe</button>
                        </li>
                    </div>
            </nav>

                <div class="submit">
                    <button @click="modifyUser()" class="btnSave" aria-label="Modifier le compte de cet utilisateur"><i class="fas fa-edit"></i> Enregistrer</button>
                    <button @click="deleteUser()" class="espacement btnDelete" aria-label="Supprimer le compte de cet utilisateur"><i class="far fa-trash-alt"></i> Supprimer le compte</button>
                </div>
            
        </div>
        <router-link to="/allposts" aria-label="Retour ver Le Flash Actu Groupomania"><i class="fas fa-home home"></i></router-link>
        <Footer />
    </div>
</template>

<script> 
import axios from 'axios'
import HeaderProfile from "../components/HeaderProfile";
import Footer from "../components/Footer";

export default {
    name: 'Profile',
    components: {
        HeaderProfile,
        Footer
    },
    data() {
        return {
            user: {
                id: '',
                nom: '',
                prenom: '',
                email: '',
                image:''
            },
            preview: null,
            posts: [],
            oldPassword:'',
            newPassword:'',
            confirmNewPassword:'',
            button : false
        }
    },
    mounted () {
        this.getOneUser();
    },
    methods: {
        show: function () {
            return this.button = true;
        },
        //get one user
        getOneUser() {
            const Id = JSON.parse(localStorage.getItem("userId"))
            const userId = this.$route.params.id;
      const token = localStorage.getItem('token');
          
           axios.get(`http://localhost:3000/api/auth/profile/${Id}`, {
        headers: {
          'authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
            }).then(res => {
        this.user.id = res.data.id;
        this.user.nom = res.data.nom;
        this.user.prenom = res.data.prenom;
        this.user.email = res.data.email;
        this.user.image = res.data.image;
      }).catch(err => console.log("erreur get user " +err))
    },
    //modify user
        modifyUser() {
            const Id = JSON.parse(localStorage.getItem("userId"))
            const userId = this.$route.params.id;
            const token = localStorage.getItem('token');
            const fileField = document.querySelector('input[type="file"]');

            const regexText = /^[a-zA-Z-\s]+$/;
            const regexEmail = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/; 
           

            if (this.user.nom === "") {
                alert("Veuillez remplir votre nom");
            } else if (regexText.test(this.user.nom) === false) {
                alert("Veuillez vérifier que l'écriture de votre nom soit uniquement en lettre");}

            if (this.user.prenom === "") {
                alert("Veuillez remplir votre prénom");
            } else if (regexText.test(this.user.prenom) === false) {
                alert("Veuillez vérifier que l'écriture de votre prénom soit uniquement en lettre");}

            if (this.user.email === "") {
                alert("Veuillez remplir votre adresse email");
            } else if (regexEmail.test(this.user.email) === false) {
                alert("Veuillez écrire une adresse email valide");
            } else if ((regexText.test(this.user.nom) === true) && regexText.test(this.user.prenom) === true && regexEmail.test(this.user.email) === true && this.user.image === null) {
            
                axios.put(`http://localhost:3000/api/auth/profile/${Id}`, {
                   
                        headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(this.user)
                })
                .then(response => response.json())
                .then(data => (this.user = data))
                .then(() => {
                    alert("Votre modification est bien prise en compte")
                    this.$router.go();
                })
                .catch(error => console.log(error))
        
            } else if ((regexText.test(this.user.nom) === true) && regexText.test(this.user.prenom) === true && regexEmail.test(this.user.email) === true && this.user.image != null) {
                let data = new FormData()
                data.append('nom', this.user.nom)
                data.append('prenom', this.user.prenom)
                //data.append('email', this.user.email)
                data.append('image', this.image)
                data.append('image', fileField.files[0])


                axios.put(`http://localhost:3000/api/auth/profile/${Id}`, data,{
                   
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        'authorization': `Bearer ${token}`
                        },
                        body: data
                })
                 .then(() => {
                    alert("Profil modifier")
                console.log("profil modifier");
                 this.$router.push("/profile");
                
            })
                
            .catch(() => console.log('Impossible de récupérer les informations !'))
            }
        },
        //delete user
        deleteUser() {
            const Id = JSON.parse(localStorage.getItem("userId"))
            if (confirm("Voulez-vous vraiment supprimer le compte?") == true) {
                const userId = this.$route.params.id;
      const token = localStorage.getItem('token');
//delete user
                axios.delete(`http://localhost:3000/api/auth/profile/${Id}`, {
                   
                    headers: {
                        'authorization': `Bearer ${token}`
                    },
                })

                .then(() => {
                    alert ("compte supprimmer")
                    console.log("compte supprimer");
                
                     let pub = this.posts

                    for ( let i = 0 ; i < pub.length ; i++) {
                        if (pub[i].image) {
                        axios.deletePost(`http://localhost:3000/api/posts/${pub[i].id}`, {
                           
                            headers: {
                                'authorization': `Bearer ${token}`,
                                'Content-Type': 'multipart/form-data',
                            },
                        })
                            .then(() => {
                                alert("les posts suprimer")
                                console.log("les posts supprimer")
                            })
                            .catch(alert ("impossilbe supprimer les posts"))
                        }
                    }
                })
                .then(() => {
                    //delete user
                    axios.deleteUser(`http://localhost:3000/api/auth/profile/${Id}`, {
                       
                        headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${token}`
                        }
                    })
                        .then(response => response.json())
                        .then(() => { 
                            alert("La suppression du compte est bien prise en compte")
                            localStorage.clear();
                        })
                        .then(this.$router.push("/"))
                })
                .catch(alert)
            }
        },
        uploadFile(e) {
            if (e.target.files) {
                let reader = new FileReader()
                reader.onload = (event) => {
                    this.preview = event.target.result
                    this.user.image = event.target.result
                }
                reader.readAsDataURL(e.target.files[0])
            }
        },
        deletefile() {
            this.user.image = '';
        },
        
        //modify password
        modifyPassword() {
            const Id = JSON.parse(localStorage.getItem("userId"))
     const userId = this.$route.params.id;
      const token = localStorage.getItem('token');
            const regexPassword = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{3,50}$/;


            if (this.oldPassword === '')
                alert("Veuillez remplir votre ancien mot de passe")
            
            if (this.newPassword === '')
                alert("Veuillez remplir votre nouveau mot de passe")

            if (this.confirmNewPassword === '')
                alert("Veuillez remplir votre confirmation de mot de passe")

            if (regexPassword.test(this.newPassword) === false){
                alert("Le nouveau mot de passe doit avoir une longueur de 3 à 50 caractères avec au moins un chiffre, une minuscule, une majuscule !!!")
            } else if (this.confirmNewPassword === this.newPassword) {

				let data = {
                    oldPassword: this.oldPassword,
					password : this.newPassword
				}

				axios.put(`http://localhost:3000/api/auth/profile/${Id}`, data, {
                   
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                    },
                   // body: data
				})
                .then(() => {
                    alert("Le nouveau mot de passe enregistrer")
                console.log("Le nouveau mot de passe enregistrer");
                // this.$router.push("/allposts");
                
            })
                
            .catch(() => console.log('Impossible de récupérer les informations !'))
     
			} else {
				alert("Le nouveau mot de passe enregistrer")
			}
        },
    mounted() {
        this.getOneUser()
    }
}

}
</script>

<style scoped>


form{
    width: 100%;
    margin: auto;
}

ul {
    display: flex;
    flex-direction: column;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;

}

label {
    font-size: 15px;
}

li {
    display: flex;
    margin-top: 7px;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

input {
    width: 70%;
    font-size: 1.2rem;
    text-align: center;
}
.modify{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 10px 0 10px;
    margin: auto;
    width: 70%;
}
.file {
    width: 200px;
    height: 200px;
    margin-top: 10px;
    border: 2px solid black;
    border-radius: 100px;
}

.input-file {
    display: none;
}

.button,#modifyImage {
    margin: 20px 0 0 0;
    padding: 5px 30px ;
    border: 2px solid black;
    border-radius: 10px;
    text-decoration: none;
    color: #000000;
    background: gray;
    font-size: 15px;
    cursor: pointer;
}

.espacement {
    margin-left: 10px;
}

.submit {
    margin-bottom: 30px;
}

.password {
    margin-top: 5px;
}



    

</style>