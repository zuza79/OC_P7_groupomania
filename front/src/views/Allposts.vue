<template>
    <div>
        <HeaderProfile />
        <h1>Le Flash Actu Groupomania</h1>   
         <!--actualization -->
         <div class="getAllPosts">
        <button @click="getAllPosts()" class="btnSave" ><i class="fas fa-redo"></i></button>
        
         </div>
        <article v-if="post in posts">
            <p>Oups! Aucune publication pour instant!</p>
        </article>
         <!--create post -->
        <router-link to="/postnew" aria-label="Ouvertir de creation d'un message">
        <button  class="button" >
            <h2><i class="far fa-edit"></i><br>Rédiger nouveau message</h2>
            </button>
            </router-link>
        
        <table>
                    <tr class = "card cardPost" v-bind:key="index" v-for="(post, index) in posts">
                        
                        <td><input type="text" v-model="post.title" required aria-label="Titre" disabled></td>
                        <td><textarea class="tdHeight" type="text" v-model="post.content" required aria-label="Message" disabled></textarea></td>
                        <td><img v-if="post.image" :src="post.image" alt="Image"></td>
                  
                        <td class="icone">
                            <router-link :to="`/post/${post.id}`" :href="$router.resolve({name: 'Post', params: { id: post.id}}).href" aria-label="Afficher le message">
                            <button class="btnIconeSave" ><i class="far fa-edit"></i></button>
                            </router-link>
                            <button @click="deletePost(index)" class="btnIconeDelete" aria-label="Supprimer ce message"><i class="far fa-trash-alt"></i></button>
                        </td>
                        <td class="info">
                            <p>
                                Posté par 
                                <b>{{ post.User.nom }}</b>
                                le <b>{{ dateFormat(post.createdAt) }}</b>
                                à <b>{{ hourFormat(post.createdAt) }}</b><br>
                            </p>
                            <p v-if="post.createdAt != post.updatedAt">
                                Modifié 
                                le <b>{{ dateFormat(post.updatedAt) }}</b>
                                à <b>{{ hourFormat(post.updatedAt) }}</b>
                            </p>
                        </td>
                    
                    </tr>
                </table>
         <!--posts -->
         <article v-if="posts.length == 0">
            <p>Oups! Aucune publication pour instant!</p>
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
    props: ['post.id'],
    components: {
        HeaderProfile,
        Footer
    },
    data () {
        return {
            id_param: this.$route.params.id,
            props: ['post.id'],
            posts: [],
            users: [],
           // image : image,
            
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
        //GET ALL POSTS
        getAllPosts() {
            const token = localStorage.getItem("token")

            axios.get('http://localhost:3000/api/posts/', {
                
             headers: {
                    'authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                    //'Access-Control-Allow-Origin': *,
                    },
                   
                })    
             .then((res) => {
                console.log(res.data);
                this.posts = res.data;
                this.users = res.data;
            })
                
            .catch(() => console.log('Impossible de récupérer les posts !'))
        },
        //DATE 
        dateFormat (createdDate) {
            const date = new Date(createdDate)
            const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'};
            return date.toLocaleDateString('fr-FR', options);
        },
        hourFormat (createdHour) {
            const hour = new Date(createdHour)
            const options = { hour: 'numeric', minute:'numeric', second:'numeric'};
            return hour.toLocaleTimeString('fr-FR', options);
        },
        //DELETE POST
        deletePost (index) {
            const token = localStorage.getItem("token")

            if (confirm("Voulez-vous vraiment supprimer votre message?") === true) {

                axios.delete(`http://localhost:3000/api/posts/${this.posts[index].id}`, {
                   
                    headers: {
                        'authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                })
                .then(() => {
                    alert("Message supprimer")
                    console.log("message supprimer");
                //   this.$router.push("/allposts");
                
              // this.posts = res.data
            })
                
            .catch(() =>{ 
                alert("Vous n'avez pas autorisation de supprimer ce message!!")
                console.log('Vous n avez pas autorisation de supprimer ce message!!')
            //    this.$router.push("/allposts");
            //alert("Vous disposer pas des doit de supprimer ce message, c'est que le auter ou administrateur");



     } )}
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
    font-size: 15px;
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
td{
    margin-top:10px;
}
.tdHeight{
    height:100px;
}

.header,
.content {
    width: 40%;
    background: #ffd7d7;
    border: 2px solid black;
}
.cardPost{
    width: 90%;
    margin: 10px auto 10px auto;
    display: flex;
    flex-direction: column;
    border: 2px solid black;
    border-radius: 15px;
}
table{
    margin: 0 auto 0 auto ;
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
img {
    width: 80%;
    height: 80%;

    border-radius: 30px;
}
.icone{
    display: flex;
    justify-content: space-between;
}
.btnIconeSave, .btnIconeDelete, .btnSave{
    width: 30px ;
    height: 30px ;
    margin: 5px;
    padding: 0px;
    border-radius: 10px;
}

.btnIconeDelete{
    background-color: indianred;
}

.btnIconeSave{
    background-color: rgb(31, 216, 216);
}
.text {
    font-size: 14px;
}
@media screen and (max-width:1024px){
table {
    width: 100%;
}
textarea{
    width: 90%
}
.icone{
    justify-content: space-evenly;
}
}
@media screen and (max-width:768px){
table {
    width: 100%;
}
textarea{
    width: 90%
}
.icone{
    justify-content: space-evenly;
}
}


</style>