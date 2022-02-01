<template>
    <div>
        <HeaderProfile />
        <AdminHeader />
        <div id = "admin">
            <nav class="menu">   
                <a class="menuLink" href="#AncreUsers">Utilisateurs</a>
                <a class="menuLink" href="#AncrePosts">Posts</a>
                <a class="menuLink" href="#AncreComments">Commentaires</a>
            </nav>  
            
        <div class = "users">
            <div class="title">Utilisateurs</div>  
            <article class="adminBloc" id="AncreUsers">
                <div>
                    <input v-model="search" class="search" type="search" placeholder="Rechercher un utilisateur par nom ..." size=40 aria-label=" Barre de recherche d'un utilisateur par nom">
                </div>
                <table>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                        <th>Rôle</th>
                        <th>Image de profil</th>
                    </tr>
                    <tr v-bind:key="index" v-for="(user, index) in filterList">
                        <td><input type="text" v-model="user.nom" required aria-label="Nom"></td>
                        <td><input type="text" v-model="user.prenom" required aria-label="Prénom"></td>
                        <td><input type="text" v-model="user.email" required class="email" aria-label="Email"></td>
                        <td>
                            <select v-model="user.role" name="role" id="role-select">
                                <option value="0">Admin</option>
                                <option value="1">Modérateur</option>
                                <option value="2">Utilisateur</option>
                            </select>
                        </td>
                        <td><img v-if="user.image" :src="user.image" alt="photo de profil"></td>
                        <button @click="modifyUser(index)" aria-label="Modifier cet utilisateur"><i class="fas fa-edit"></i></button>
                        <button @click="deleteUser(index)" aria-label="Supprimer cet utilisateur"><i class="far fa-trash-alt"></i></button>
                    </tr>
                </table>
                <router-link to="/allposts" aria-label="Retour ver Le Flash Actu Groupomania"><i class="fas fa-home home"></i></router-link>
        </article>
        </div>

        <div class ="posts">
            <div class="title">Posts</div>
            <article class="adminBloc" id="AncrePosts">
                <table>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Titre du post</th>
                        <th>Message du post</th>
                        <th>Image du post</th>
                    </tr>
                    <tr v-bind:key="index" v-for="(post, index) in posts">
                        <td><input type="text" v-model="post.user.nom" required aria-label="Nom de l'auteur du post"></td>
                        <td><input type="text" v-model="post.user.prenom" required aria-label="Prénom de l'auteur du post"></td>
                        <td><input type="text" v-model="post.title" required aria-label="Titre du post"></td>
                        <td><textarea type="text" v-model="post.content" required aria-label="Message du post"></textarea></td>
                        <td><img v-if="post.image" :src="post.image" alt="Image du post"></td>
                        <button @click="deletePost(index)" aria-label="Supprimer ce post"><i class="far fa-trash-alt"></i></button>
                    </tr>
                </table>
                <router-link to="/allposts" aria-label="Retour ver Le Flash Actu Groupomania"><i class="fas fa-home home"></i></router-link>
            </article>
        </div>

            <div class="comments">
                <div class="title">Commentaires</div>
            <article class="adminBloc" id="AncreComments">
                <table>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Titre du post</th>
                        <th>Commentaire</th>
                    </tr>
                    <tr v-bind:key="index" v-for="(comment, index) in comments">
                        <td><input type="text" v-model="comment.user.nom" required aria-label="Nom de l'auteur du commentaire"></td>
                        <td><input type="text" v-model="comment.user.prenom" required aria-label="Prénom de l'auteur du commentaire"></td>
                        <td><input type="text" v-model="comment.post.title" required aria-label="Titre du post"></td>
                        <td><textarea type="text" v-model="comment.content" rows="3" cols="50" required aria-label="Commentaire"></textarea></td>
                        <button @click="deleteComments(index)" aria-label="Supprimer ce commentaire"><i class="far fa-trash-alt"></i></button>
                    </tr>
                </table>
                <router-link to="/allposts" aria-label="Retour ver Le Flash Actu Groupomania"><i class="fas fa-home home"></i></router-link>
            </article>
            </div>
        </div>

        <Footer />
    </div>
</template>

<script>
import axios from 'axios';

import HeaderProfile from "../components/HeaderProfile";
import AdminHeader from "../components/AdminHeader";
import Footer from "../components/Footer";


export default {
    name: 'AdminDisplay',
    components: {
        HeaderProfile,
        AdminHeader,
        Footer
    },
    
    data () {
        return {
            users: [],
            search: '',
            posts: [],
            comments: []
        }
    },
    computed : {
        filterList() {
            return this.users.filter((user) =>{
                return user.nom.toLowerCase().includes(this.search.toLowerCase());
            })
        }
    },
    //////USER
    methods : {
        //*display user
        getUsers() {
            const token = JSON.parse(localStorage.getItem("userToken"))

            axios.get('http://localhost:3000/api/auth/', {
                method: "GET",
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
            
            .then(response => response.json())
            .then(data => (this.users = data))
            .catch(alert)
        },
        //delete user
        deleteUser(index) {
            const token = JSON.parse(localStorage.getItem("userToken"))

            if (confirm("Voulez-vous vraiment supprimer cet utilisateur???") === true) {

                axios.get(`http://localhost:3000/api/posts/${this.filterList[index].id}/posts`, {
                    method: "GET",
                    headers: {
                        'authorization': `Bearer ${token}`
                    },
                })
                .then(response => response.json())
                .then(data => (this.posts = data))
                .then (() => {
                    let publication = this.posts

                    for ( let i = 0 ; i < publication.length ; i++) {
                        if (publication[i].image) {
                    /**delete post */
                            axios.delete(`http://localhost:3000/api/posts/${publication[i].id}`, {
                                method: "DELETE",
                                headers: {
                                    'authorization': `Bearer ${token}`
                                },
                            })
                            .then(response => response.json())
                            .catch(alert)
                        }
                    }
                })
                .then(() => {
            //delete filter user
                    fetch(`http://localhost:3000/api/auth/${this.filterList[index].id}`, {
                        method: "DELETE",
                        headers: {
                            'authorization': `Bearer ${token}`
                        }
                    })
                    .then(response => response.json())
                    .then(() => { 
                        this.$router.go()
                        })
                    .catch(alert)
                })
                .catch(alert)
            }
        },
//modify user
        modifyUser(index) {
            const token = JSON.parse(localStorage.getItem("userToken"))

            if (confirm("Voulez-vous vraiment modifier cet utilisateur") === true) {
                

                axios.put(`http://localhost:3000/api/auth/admin/${this.filterList[index].id}`, {
                    method: "PUT",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${token}`
                    },
                    body : JSON.stringify(this.filterList[index])
                })
                .then(response => response.json())
                .then(data => (this.filterList[index] = data))
                .then(() => { 
                    this.$router.go()
                })
                .catch(alert)
            }
        }
    },
    

/////POSTS
    //display posts
        getPosts() {
            const token = JSON.parse(localStorage.getItem("userToken"))

            fetch('http://localhost:3000/api/posts/', {
                method: "GET",
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
            
            .then(response => response.json())
            .then(data => (this.posts = data))
            .catch(alert)
        },
    //delete post
        deletePost(index) {
            const token = JSON.parse(localStorage.getItem("userToken"))

            if (confirm("Voulez-vous vraiment supprimer le post") === true) {

                fetch(`http://localhost:3000/api/posts/${this.posts[index].id}`, {
                    method: "DELETE",
                    headers: {
                        'authorization': `Bearer ${token}`
                    },
                    body : JSON.stringify(this.posts[index])
                })
                .then(response => response.json())
                .then(data => (this.posts[index] = data))
                .then(() => {
                    this.$router.go()
                })
                .catch(alert)
            }
        },

//// COMMENTS
    //display comments
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
    //delete comments
        deleteComments(index) {
            const token = JSON.parse(localStorage.getItem("userToken"))

            if (confirm("Voulez-vous vraiment supprimer le commentaire") === true) {

                axios.delete(`http://localhost:3000/api/comments/${this.comments[index].id}`, {
                    method: "DELETE",
                    headers: {
                        'authorization': `Bearer ${token}`
                    },
                    body : JSON.stringify(this.comments[index])
                })
                .then(response => response.json())
                .then(data => (this.comments[index] = data))
                .then(() => {
                    this.$router.go()
                })
                .catch(alert)
            }
        },
    
    mounted(){
        this.getUsers()
        this.getPosts()
        this.getComments()
    }
}

</script>

<style scoped>
.menu{
    margin: 5px;
  display: flex;
    flex-direction: row;
    justify-content: space-between;  
}
.menuLink{
    
    width: 25%;
    margin-top: 10px;
    margin-bottom: 30px;
    padding: 10px ;
    text-decoration: none;
    color: black;
    font-size: 14px;
    font-weight: bolder;
  background: gray;
    border: 1px solid black;
    border-radius: 20px;
}
.title{
    color:rgb(58, 69, 218);
    font-weight: bolder;
    font-size: 18px;
    margin-top: 20px;
}
.search {
    margin-bottom: 10px;
    margin-top: 10px;
    width: 80%;
    height: 30px;
    border: 2px solid black;
    border-radius: 15px;
}
::placeholder {
    text-align: center;
    font-size: 14px;
}
table {
    width: 90%;
    height: 20px;
    margin: 5px auto 15px auto;
    font-size: 14px;
    background: #66c4e0;
    border: 1px solid black;
    border-radius: 20px;
    
}

.button{
    margin: 10px 0 30px 0;
    padding: 5px 3vw ;
    border: 2px solid black;
    border-radius: 10px;
    background: #ffd7d7;
    font-size: 1vw;
    cursor: pointer;
    text-decoration: none;
    color: #000000;
}

button {
    margin-top: 10px;
    padding: 5px 5px ;
    border: 2px solid black;
    border-radius: 10px;
    background: #ffd7d7;
    font-size: 1vw;
    cursor: pointer;
    text-decoration: none;
    color: #000000;
}

input,
textarea {
    font-size: 1vw;
}

.fa-home
{
    width: 50px;
    height: 50px;
    position: relative;
    border-radius: 100%;
    background: gray;
    
    cursor: pointer; 
    
     text-align: center;
     color: green;   
     
    }


</style>