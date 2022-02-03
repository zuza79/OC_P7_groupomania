<template>
    <div>
        <HeaderProfile />
        
            <section>
                <h1>Modification de commentaire</h1>
                <table>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Titre du post</th>
                        <th>Commentaire</th>
                        <th>Modération</th>
                    </tr>
                    <tr v-bind:key="index" v-for="(comment, index) in filterList">
                        <td><input type="text" v-model="comment.user.nom" required aria-label="Nom de l'auteur du commentaire"></td>
                        <td><input type="text" v-model="comment.user.prenom" required aria-label="Prénom de l'auteur du commentaire"></td>
                        <td><input type="text" v-model="comment.post.title" required aria-label="Titre du post"></td>
                        <td><textarea type="text" v-model="comment.content" rows="3" cols="50" required aria-label="Commentaire"></textarea></td>
                        <td>
                            <button @click="modifyComments(index)" aria-label="Modifier ce commentaire" v-if="comment.modify === false" class="btnSave"><i class="fas fa-check"></i></button>
                            <button @click="deleteComments(index)" aria-label="Supprimer ce commentaire" class="btnDelete"><i class="fas fa-times"></i></button>
                        </td>
                        
                    </tr>
                </table>
                
            </section>
            <div>
            <router-link :to="`/post/${this.id_param}`" class="btnDelete" aria-label="Retour au post"><i class="fas fa-comment-slash"></i> Annuler</router-link>
            </div>
            <div>
            <router-link to="/allposts" aria-label="Retour ver Le Flash Actu Groupomania"><i class="fas fa-home home"></i></router-link>
            </div>
        <Footer />
    </div>
</template>

<script>
import axios from 'axios';
import HeaderProfile from "../components/HeaderProfile";

import Footer from "../components/Footer";

export default {
    name: 'modifycomment',
    components: {
        HeaderProfile,
       
        Footer
    },
    data () {
        return {
           
             comments: [],
            preview: null 
           
            
        }
    },
     methods : {
        getComments() {
            const token = JSON.parse(localStorage.getItem("userToken"))

            axios.get (`http://localhost:3000/api/comments/`, {
                    method: "GET",
                    headers: {
                        'authorization': `Bearer ${token}`
                    }
            })
            
            .then (response => response.json())
            .then (data => (this.comments = data))
            .catch(alert)
        },
        modifyComments(index) {
            const token = JSON.parse(localStorage.getItem("userToken"))

            if (confirm("Voulez-vous vraiment valider ce commentaire") === true) {
                let data = {
                    moderate: true
                }
                
                axios.put(`http://localhost:3000/api/comments/${this.id_param}`, {
                    method: "PUT",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data) 
                })
                .then((response) => response.json())
                .then(data => (this.data))
                .then(() => {
                    this.$router.go()
                })
                .catch(alert)
            }
        },
        deleteComments(index) {
            const token = JSON.parse(localStorage.getItem("userToken"))

            if (confirm("Voulez-vous vraiment supprimer ce commentaire") === true) {

                axios.delete(`http://localhost:3000/api/comments/${this.id_param}`, {
                    method: "DELETE",
                    headers: {
                        'authorization': `Bearer ${token}`
                    },
                    body : JSON.stringify(this.data)
                })
                .then(response => response.json())
                .then(() => {
                    this.$router.go()
                })
                .catch(alert)
            }
        }
    },
    mounted(){
        this.getComments()
    }
}
</script>

<style scoped>

label {
    font-size: 16px;
    color:rgb(5, 5, 100);
}
table {
    width: 90%;
    height: 20px;
    margin: 5px auto 15px auto;
    font-size: 14px;
    background: #b4c4d6;
    border: 1px solid black;
    border-radius: 20px;
    
}

form{
   width: 80% ; 
   margin: auto;
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
    
    height: 30px;
    font-size: 1.5rem;
}

textarea {
    font-size: 1.2rem;
}

.input-file {
    display: none;
}

.lien {
    text-decoration: none;
    color: #000000;
}

img {
    width: 70%;
    border-radius: 30px;
    margin: auto;
}
.btnDelete{
    margin-top: 20px;
}
.btnSave{
    margin-top:0;
    margin-bottom: 10px;
}


</style>