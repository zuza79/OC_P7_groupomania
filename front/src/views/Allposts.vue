<template>
    <div>
        <HeaderProfile />
        <h1>Le Flash Actu Groupomania</h1>   
         <!--actualization -->
         <div class="getAllPosts">
        <button @click="getAllPosts()" class="button" ><p>Actualization</p></button>
        
         </div>
        <article v-if="post in posts">
            <p>Oups! Aucune publication pour instant!</p>
        </article>
         <!--create post -->
        <button @click="addPost()" class="button" ><h2><i class="far fa-edit"></i><br>Rédiger nouveau message</h2></button>
         <!--search -->
        <div>
            
            <input v-model="search" class="search" type="search" placeholder="Rechercher une publication par auteur ..." size=50 aria-label="Barre de recherche par utilisateur">
        </div>
        <table>
                    <tr>
                       
                        <th>Titre</th>
                        <th>Message</th>
                        <th>Image</th>
                    </tr>
                    <!-- <tr v-for="(post, index) in posts" :key="index" :post="post">{{post}}
                    -->
                     <tr v-bind:key="index" v-for="(post, index) in posts">
                        
                        <td><input type="text" v-model="post.title" required aria-label="Titre" disabled></td>
                        <td><textarea type="text" v-model="post.content" required aria-label="Message" disabled></textarea></td>
                        <td><img v-if="post.image" :src="post.image" alt="Image"></td>
                        <button @click="post" classe="btnSave" aria-label="Afficher le message"><i class="fa-solid fa-comment-dots"></i></button>
                        <button @click="deletePost(index)" class="btnDelete" aria-label="Supprimer ce message"><i class="far fa-trash-alt"></i></button>
                        
                    </tr>
                </table>
         <!--posts -->
         <article v-if="posts.length == 0">
            <p>Oups! Aucune publication pour instant!</p>
        </article>
      <!-- <post v-for="(post, index) in posts" :key="index" :post="post">{{post}}</post>-->
        <Footer />
    </div>
</template>

<script>
import axios from 'axios'
import HeaderProfile from "../components/HeaderProfile";
import Footer from "../components/Footer";

export default {
    name: 'allposts',
    components: {
        HeaderProfile,
        Footer
    },
    data () {
        return {
            posts: [],
            users: [],
            search:''
        }
    },
    computed : {
        filterList() {
            return this.posts.filter((post) =>{
                return post.user.nom.toLowerCase().includes(this.search.toLowerCase());
            })
        }
    },
    methods : {
        
        getAllPosts() {
            const token = localStorage.getItem("token")

            axios.get('http://localhost:3000/api/posts/', {
                
             headers: {
                    'authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                    },
                   
                })    
             .then((res) => {
                console.log(res.data);
                this.posts = res.data
            })
                
            .catch(() => console.log('Impossible de récupérer les posts !'))
        },
        dateFormat(createdDate) {
            const date = new Date(createdDate)
            const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'};
            return date.toLocaleDateString('fr-FR', options);
        },
        hourFormat(createdHour) {
            const hour = new Date(createdHour)
            const options = { hour: 'numeric', minute:'numeric', second:'numeric'};
            return hour.toLocaleTimeString('fr-FR', options);
        },
        post () {
            this.$router.push("/post")
        }
    },
    mounted(){
        this.getAllPosts()
    }
}
</script>

<style scoped>

h2 {
    font-size: 15px;
    margin: 0 auto 0 auto;
}

.info {
    font-size: 0.8vw;
}

.image {
    height: 15vw;
    border-radius: 30px;
}
.article {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: #000000;
}

.header,
.content {
    width: 40%;
    background: #ffd7d7;
    border: 2px solid black;
}

.header {
    border-radius: 20px 20px 0 0;
}

.content {
    margin-bottom: 30px;
    border-radius: 0 0 20px 20px;
}

.search {
    margin-bottom: 50px;
    margin-top: 50px;
    width: 80%;
    height: 30px;
    border: 2px solid black;
    border-radius: 15px;
}

::placeholder {
    text-align: center;
    font-size: 14px;
}
input {
    width: 70%;
    font-size: 1.2rem;
    text-align: center;
}

.imgProfile {
    width: 50px;
    height: 50px;
    border: 2px solid black;
    border-radius: 30px;
}

.text {
    font-size: 14px;
}



</style>