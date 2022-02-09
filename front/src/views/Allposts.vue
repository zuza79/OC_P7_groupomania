<template>
    <div>
        <HeaderProfile />
        <h1>Le Flash Actu Groupomania</h1>   
         <!--posts zero -->
        <article v-if="posts.length == 0">
            <p>Oups! Aucune publication pour instant!</p>
        </article>
         <!--create post -->
        <button @click="post()" class="button" ><h2><i class="far fa-edit"></i><br>Rédiger nouveau message</h2></button>
         <!--search -->
        <div>
            <input v-model="search" class="search" type="search" placeholder="Rechercher une publication par auteur ..." size=50 aria-label="Barre de recherche par utilisateur">
        </div>
         <!--posts -->
         <article v-if="posts.length == 0">
            <p>Oups! Aucune publication pour instant!</p>
        </article>
         <article v-else v-bind:key="index" v-for="(post, index) in filterList">
            <router-link :to="`/post/${post.id}`" class="article">
                <div class="header">
                    <div>
                        <h2>{{ post.title }}</h2>
                        <p class="info">
                            Publier par 
                            <b>{{ post.user.nom }} 
                            <span v-if="post.user.role != 0">{{ post.user.prenom }} </span></b>
                            <!--<img class="photo-profil" v-if="post.user.image" :src="post.user.image" alt="photo de profil">
                            <img class="photo-profil" v-else src="../assets/images/photo-profil.jpg" alt="photo de profil"><br>
                            -->
                            le <b>{{ dateFormat(post.created_date) }}</b>
                            à <b>{{ hourFormat(post.created_date) }}</b>

                        </p>
                        <p v-if="post.created_date != post.updated_date"  class="info">
                            Modification
                            le <b>{{ dateFormat(post.updated_date) }}</b>
                            à <b>{{ hourFormat(post.updated_date) }}</b>
                        </p>
                    </div>
                </div>
                <div class="content">
                    <p class="message"></p><br>
                    <img class="image" v-if="post.image" :src="post.image" :alt="post.title">
                    <p class="text">{{ post.content }}</p>
                </div>
                
            </router-link>
        </article>
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
        
        getPosts() {
            const token = JSON.parse(localStorage.getItem("userToken"))

            axios.get('http://localhost:3000/api/posts/')
                
            
            .then(response => response.json())
            .then(data => (this.posts = data))
            .catch(error => console.log(error))
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
        this.getPosts()
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

.photo-profil {
    width: 50px;
    height: 50px;
    border: 2px solid black;
    border-radius: 30px;
}

.text {
    font-size: 14px;
}



</style>