<template>
    <div>
         <HeaderProfile />
   
        <!--posts -->
     <h1>Messagess</h1>
            <article >
                 <div>
                    <input v-model="search" class="search" type="search" placeholder="Rechercher par NOM " size=40 aria-label=" Barre de recherche d'un utilisateur avec son Nom">
                </div>
                <table>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Titre du post</th>
                        <th>Message du post</th>
                        <th>Image du post</th>
                    </tr>
                    <tr v-bind:key="index" v-for="(post, index) in posts">
                        <td><input type="text" v-model="post.user.nom" required aria-label="Nom de l'auteur du post" disabled></td>
                        <td><input type="text" v-model="post.user.prenom" required aria-label="Prénom de l'auteur du post" disabled></td>
                        <td><input type="text" v-model="post.title" required aria-label="Titre du post" disabled></td>
                        <td><textarea type="text" v-model="post.content" required aria-label="Message du post" disabled></textarea></td>
                        <td><img v-if="post.image" :src="post.image" alt="Image du post"></td>
                        <button @click="deletePost(index)" aria-label="Supprimer ce post" class="btnDelete"><i class="far fa-trash-alt"></i></button>
                    </tr>
                </table>
                <router-link to="/admin" aria-label="Retour vers administration"><i class="fa-solid fa-turn-down-left">Menu</i></router-link>
            </article>
           
        <Footer />
    </div>
</template>

<script>
import axios from 'axios';
import HeaderProfile from "../components/HeaderProfile";
import Footer from "../components/Footer";

export default {
    name: 'AdminPosts',
    components: {
         HeaderProfile,
        
        Footer
    },
    data () {
        return {
            posts: [],
        }
    },
    methods : {
//GET POSTS
        getPosts() {
            const token = JSON.parse(localStorage.getItem("userToken"))

            axios.get('http://localhost:3000/api/posts/', {
               
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
            
            .then(response => response.json())
            .then(data => (this.posts = data))
            .catch(alert)
        },
// DELETE POST
        deletePost(index) {
            const token = JSON.parse(localStorage.getItem("userToken"))

            if (confirm("Voulez-vous vraiment supprimer le post") === true) {

                axios.delete(`http://localhost:3000/api/posts/${this.posts[index].id}`, {
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
        }
    },
    mounted(){
        this.getPosts()
    }
}
</script>

<style scoped>
table {
    width: 80%;
    height: 25px;
    margin: 0 auto 0 auto;
    font-size: 1vw;
    background: white;
    border: 2px solid gray;
    border-radius: 20px;
    
}
.search {
    margin-bottom: 30px;
    border: 2px solid gray;
    font-size: 15px;
    text-align: center;
}

input {
    font-size: 15px;
}

hr {
    background-color: gray;
}


img {
    width: 80px;
    height: 80px;
    border-radius: 10px;
}

tr {
    padding-bottom: 80px;
}

@media screen and (max-width:1024px) {

    input {
    font-size: 1.5vw;
    }
}
@media screen and (max-width:768px) {

    input,
    textarea {
        width: 85vw;
        height: 5vw;
        font-size: 0.9rem;
    }

    button {
        width: 20%;
        margin: 0 0 50px 0;
        padding: 5px 10px;
    }

    i {
        font-size: 1rem;
    }

    th {
        display: none;
    }

    tr {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0;
    }

    .button {
        margin-bottom: 50px;
        font-size: 0.8rem;
    }
}

</style>