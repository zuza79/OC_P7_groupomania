<template>
    <div>
        <HeaderProfile />
        <div>
            <h1>Mon profil</h1>
              
        <!--USER INFO - NOM, PRENOM, EMAIL -->
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
<!--IMAGE -->
    <div class="button modifyImage btnModifyImg" >   
        <img v-if="user.image" :src="user.image" alt="Photo de profil" class="file" width="150px" height="150px" border-radius="15px">
        <label v-if="!user.image" for="file" class="label-file btnModifyImg" aria-label="Inserer votre photo de profil" ><i class="fas fa-upload"></i><br>Inserer <br>votre photo de profil</label>
        <button v-else @click="deletefile()" class="label-file btnDelete" aria-label="Supprimer la photo de profil"> <i class="far fa-trash-alt"></i></button>
        <input type="file" accept="image/jpeg, image/jpg, image/png, image/webp" v-on:change="uploadFile" id="file" class="input-file" aria-label="Photo de profil">
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
            posts: [],
            user: {
                id: '',
                nom: '',
                prenom: '',
                email: '',
                image:''
            },
            preview: null,

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
        show2: function () {
            return this.displayPostsUser = true;
        },
        hide2: function () {
            return this.displayPostsUser = false;
        },
        User() {
            this.id = localStorage.getItem("Id")
            this.role = localStorage.getItem("role")

        },
    //GET ONE USER
        getOneUser() {
            const Id = JSON.parse(localStorage.getItem("userId"))
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
      })
      .catch(() =>{ 
                alert("Vous n'avez pas autorisation de supprimer ce message!!")
                console.log('Vous n avez pas autorisation de supprimer ce message!!')
        
          } )
    },

//MODIFY USER
        modifyUser() {
            const token = localStorage.getItem('token');
            const Id = localStorage.getItem("userId")
                       
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
                           'authorization': `Bearer ${token}`,
                           'Accept': 'application/json',               
                           'Content-Type': 'multipart/form-data',
                        },
                })
                .then((res) => {
                   this.user = res.data;
                   alert("Votre modification est bien prise en compte")
                    this.$router.push("/profile");
                })
               .catch((err) => console.log(err))
        
            } else if ((regexText.test(this.user.nom) === true) && regexText.test(this.user.prenom) === true && regexEmail.test(this.user.email) === true && this.user.image != null) {
                let data = new FormData()
                data.append('nom', this.user.nom)
                data.append('prenom', this.user.prenom)
                data.append('email', this.user.email)
                data.append('image', this.image)
                data.append('image', fileField.files[0])

                axios.put(`http://localhost:3000/api/auth/profile/${Id}`, data,{
                   
                        headers: {
                            'authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                        body: data
                })
                 .then(() => {
                    alert("Profil modifier")
                    console.log("profil modifier");
                    this.$router.push("/profile");
            })
           .catch(error => console.log(error))
            }},
    //DELETE USER
        deleteUser() {
            const Id = localStorage.getItem("userId")
            if (confirm("Voulez-vous vraiment supprimer le compte?") == true) {
            const token = localStorage.getItem('token');

                axios.delete(`http://localhost:3000/api/auth/profile/${Id}`, {
                   
                    headers: {
                        'authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                })

                .then(() => {
                    alert ("compte supprimmer")
                    console.log("compte supprimer");
                
                     let pub = this.posts

                    for ( let i = 0 ; i < pub.length ; i++) {
                        if (pub[i].image) {
                        axios.delete(`http://localhost:3000/api/posts/${pub[i].id}`, {
                           
                            headers: {
                                'authorization': `Bearer ${token}`,
                                'Content-Type': 'multipart/form-data',
                            },
                        })
                            .then(() => {
                                alert("les posts suprimer")
                                console.log("les posts supprimer")
                                .then(this.$router.push("/"))
                            })
                            .catch(alert ("impossilbe supprimer les posts"))
                        }
                    }
                })
                .then(() => {
                   
                    axios.delete(`http://localhost:3000/api/auth/profile/${Id}`, {
                       
                        headers: {
                        'Accept': 'application/json',
                        'authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
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
        
       
    mounted() {
        this.getOneUser()
    }}
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
    border: 2px solid black;
    border-radius: 100px;
    margin: auto;
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
    min-width: 220px;
    width: 40%;
    margin: 30px auto 15px auto;
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