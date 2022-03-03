<template>
    <div>
        <HeaderProfile />
         
   <!--     
            <div class="like">
          <button class="btnSave" @click="likePost">
            <div><i class="fas fa-thumbs-up like"></i>{{ like }}</div>
          </button>

         <button class="btnDelete ">
            <div><i class="fas fa-thumbs-down dislike"></i>{{ dislike }}</div>
          </button>
   
      </div>
   --> 
 
            <section>
     <div class="header">
       <!-- DISPLAY POST --> 
                    <tr class = "card" >
                        <td><input type="text" v-model="post.title" required aria-label="Titre" disabled size="50" ></td>  <!--rows="10" cols="25" -->
                        <td><textarea type="text" v-model="post.content" required aria-label="Message" disabled ></textarea></td>
                        <td><img v-if="post.image" :src="post.image" alt="Image du post"></td>
                    </tr>
                    


                    <div>
                        
                        <div class="info">
                            <p>
                                Posté par 
                                <b>{{ user.nom }} 
                                <span v-if="post.user.role != 1">{{ post.user.prenom }} </span></b>     
                               <!-- <img class="photo-profil" v-if="post.user.image" :src="post.user.image" alt="photo de profil">
                                <img class="photo-profil" v-else src="../assets/images/photo-profil.jpg" alt="photo de profil"><br>
                               -->
                                le <b>{{ dateFormat(post.createdAt) }}</b>
                                à <b>{{ hourFormat(post.createdAt) }}</b><br>
                            </p>
                            <p v-if="post.createdAt != post.updatedAt">
                                Modifié 
                                le <b>{{ dateFormat(post.updatedAt) }}</b>
                                à <b>{{ hourFormat(post.updatedAt) }}</b>
                            </p>
                        </div>
                    
                    </div>
                    
                </div>
                

                <div class="content">
                    <p class="modif">
                        <button @click="modifyPost()" v-if="post.userId === id" class="btnSave" aria-label="Modifier ce post"><i class="fas fa-edit"></i> Modifier ce post</button>
                        <button @click="deletePost()" v-if="post.userId === id || role === 0" class="btnDelete espacement" aria-label="Supprimer ce post"><i class="far fa-trash-alt"></i> Supprimer ce post</button>
                    </p>
                   <!-- <p>{{ post.content }}</p>
                    <hr v-if="post.userId === id || role === 0">
                    <img v-if="post.image" :src="post.image" alt="Image du post">
                   -->  
                </div>


                <button v-if="comments.length != 0 && displaycomments === false " v-on:click="show" class="comment-button" aria-label="Voir commentaire">Voir {{ comments.length }} commentaire<span v-if="comments.length >= 2">s</span></button>
                <article v-if="displaycomments">
                    <div v-bind:key="index" v-for="(comment, index) in comments" class="comment">
                        <div>
                            <p class="info">
                                Posté par 
                                <b>{{ comment.user.nom }} 
                                <span v-if="comment.user.role != 0">{{ comment.user.prenom }} </span></b> 
                               <!-- <img class="photo-profil" v-if="comment.user.image" :src="comment.user.image" alt="photo de profil">
                                <img class="photo-profil" v-else src="../assets/images/photo-profil.jpg" alt="photo de profil"><br>
                               -->
                                le <b>{{ dateFormat(comment.date) }}</b>
                                à <b>{{ hourFormat(comment.date) }}</b>
                            </p>
                            <p>
                                <button v-if="comment.userId === id || role === 0" @click="deleteComment(index)" class="button-comment" aria-label="Supprimer ce commentaire"><i class="far fa-trash-alt"></i></button>
                            </p>
                        </div>                        
                        <hr>
                        <p class="comment-content">{{ comment.content }}</p>
                    </div>
                    <button v-on:click="hide" class="comment-button" aria-label="Cacher commentaire">Cacher le<span v-if="comments.length >= 2">s</span> commentaire<span v-if="comments.length >= 2">s</span></button>
                </article>

                <button v-if="displayCreateComment === false" v-on:click="show2" class="btnSave" aria-label="Ecrire un commentaire"><i class="far fa-edit"></i>Commenter</button>
                <article v-if="displayCreateComment" class="createcomment">
                    <textarea v-model="commentaire" placeholder="Faire ton commentaire..." cols="60" rows="5" aria-label="Message du commentaire"></textarea>
                    <div class=btnComment>
                    <button @click="createComment()" class="btnSave" aria-label="Envoyer le commentaire">Envoyer</button>
                    <button v-on:click="hide2" class="btnDelete" aria-label="Annuler le commentaire">Annuler</button>
                    </div>
                </article>

            </section>
            <router-link to="/allposts" aria-label="Retour ver Le Flash Actu Groupomania"><i class="fas fa-home home"></i></router-link>
        <Footer />
    </div>
</template>

<script>
import axios from 'axios'
import HeaderProfile from "../components/HeaderProfile";
import Footer from "../components/Footer";

export default {
    name: 'Post',
    props: [''],
    components: {
        HeaderProfile,
        Footer
    },
    data () {
        return {
             id_param: this.$route.params.id,
          //  like: this.post.like,
           // dislike: this.post.dislike,

           

            props: ['post'],
            posts: [],
            users: [],
            
            post: {
                title:'',
                content:'',
                createdAt:'',
                updatedAt:'',
                id:'',
                image:'',
                user: {},
                userId:''
            },
            user : {
                nom: '',
            },
            comments: [],
            displaycomments: false,
            displayCreateComment: false,
            commentaire:'',
            id:'',
            role: ''
        }
    },
     computed: {
        likeIncrement(){
            return this.like + 1 ;
            // console.log(this.like);
        }
    },
    methods : {
       show: function () {
            return this.displaycomments = true;
        },
        hide: function () {
            return this.displaycomments = false;
        },
        show2: function () {
            return this.displayCreateComment = true;
        },
        hide2: function () {
            return this.displayCreateComment = false;
        },
        User() {
            this.id = localStorage.getItem("Id")
            this.role = localStorage.getItem("role")

        },
       // DISPLAY ONE POST
        getOnePost() {
            const token = localStorage.getItem("token")
         ///   'http://localhost:3000/api/profile/' + this.user.id,
         //'   axios.get("mon_url/"+post.id)+ 
         //axios.get('https://site.com/?foo=bar')  ${this.post.id}
                        //
            axios.get (`http://localhost:3000/api/posts/${this.id_param}` ,  {
              
                headers: {
                    'authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                    'Content-Type': 'application/json',
                    //'Accept': 'application/json',
                }
                } ).then((res) => {

                console.log(res.data);
                this.posts = res.data;
                this.users = res.data;

                this.post.title = res.data.title;
                this.post.content = res.data.content;
                this.post.image = res.data.image;
                this.post.createdAt = res.data.createdAt;
                this.post.updatedAt = res.data.updatedAt;
                this.user.nom = res.data.nom;
                
            })
                
            .catch(err => this.posts = [{title : "Impossible de récupérer les posts !"}]);
        },
// DISPLAY ALL COMMENTS OF POST
        getPostComments() {
            const token = localStorage.getItem("token")

            axios.get (`http://localhost:3000/api/comments/${this.id_param}}`, {
                   
                    headers: {
                        'authorization': `Bearer ${token}`
                    }
            })
            
            .then((res) => {
                console.log(res.data);
                this.posts = res.data
            })
                
            .catch(() => console.log('Impossible de récupérer les posts !'))
        },
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
// LIKE POST
        likePost(){
            console.log(this.post);
             const token = localStorage.getItem('token');
            
             axios.put(`http://localhost:3000/api/posts/${this.id_param}`, {like: this.likeIncrement}, {
                 headers: {
                        'authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                })
                .then(() => {
                    alert("Merci")
                    console.log("like");
                //   this.$router.push("/allposts");
                
              // this.posts = res.data
            })
                
            .catch(() =>{ 
                alert("impossible de faire like")
                console.log('problem like')
            //    this.$router.push("/allposts");
            //alert("Vous disposer pas des doit de supprimer ce message, c'est que le auter ou administrateur");



     } )
        },
      
//DELETE POST
        deletePost () {
            const token = JSON.parse(localStorage.getItem("userToken"))

            if (confirm("Voulez-vous vraiment supprimer le post") === true) {

                axios.delete(`http://localhost:3000/api/posts/${this.id_param}`, {
                   
                    headers: {
                        'authorization': `Bearer ${token}`
                    }
                })
                .then((res) => {
                alert ("Publication supprimer")
                console.log(res.data);
                this.posts = res.data
            })
                
            .catch(() =>{ 
                alert("Vous n'avez pas autorisation de supprimer ce message!!")
                console.log('Vous n avez pas autorisation de supprimer ce message!!')
        
          } )}
        },
        //MODIFY POST
        modifyPost () {
            this.$router.push(`/postmodify/${this.id_param}`)
        },

        //create comment
        createComment () {
            if( this.comment === ""){
                alert('Veuillez remplir votre commentaire')

            } else {
                const Id = localStorage.getItem("userId");
                const token = localStorage.getItem("token")
                
                let data = {
                    content: this.commentaire,
                    postId: this.id_param,
                    userId: Id
                }

                axios.post("http://localhost:3000/api/comments", data, {
                   
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                    },
                    body: data                })
                .then(() => {
                                alert("commentaire publié")
                                console.log("commentaire OK")
                            })
                
            .catch(() => console.log(' Impossible de publier commentaire!'))
       }
        },
        deleteComment (index) {
            const token = localStorage.getItem("token")

            if (confirm("Voulez-vous vraiment supprimer ce commentaire") === true) {

                axios.delete(`http://localhost:3000/api/comments/${this.comments[index].id}`, {
                   
                    headers: {
                        'authorization': `Bearer ${token}`
                    },
                })
                 .then((res) => {
                console.log(res.data);
                this.posts = res.data
            })
                
            .catch(() => console.log('Impossible de récupérer les posts !'))
       }
        },
    },
    mounted(){
        
        this.getOnePost ()
       //this.getOneUser()
       //this.getComments ()
    }
}
</script>




<style scoped>
section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto 0 auto;
}
.card {
    display: flex;
    flex-direction: column;
    margin-top: 15px;
}
input{
    width: 60%;
    height: 30px;
    text-align: center ;
    font-size: 20px;
    font-weight: bolder;
}
h1 {
    font-size: 1.5rem;
    margin: 30px 0 10px 0;
}

textarea {
    width: 80%;
    height: 150px;
    font-size: 1.2rem;
    margin: 10px auto 10px auto;
}

.header,
.content {
    width: 50%;
    background:gray;
    border: 2px solid black;
}

.header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 20px 20px 0 0;
}

.content {
    border-radius: 0 0 20px 20px;
}

.info {
    font-size: 0.8rem;
}

.modif {
    margin: 0;
}
.btn{
    text-align: center;
}
.content {
    margin-bottom: 30px;
}

.createcomment {
    display: flex;
    flex-direction: column;
}

.btn{
    width: 30%;
}
.btnComment{
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    
}

.button-comment {
    margin: 10px 0 0 0;
    padding: 5px 5px ;
    border: 2px solid #fd2d01;
    border-radius: 10px;
    background: #ffd7d7;
    font-size: 1rem;
    cursor: pointer;
}

.espacement {
    margin: 5px 0 0 10px;
}

.link {
    text-decoration: none;
    color: #000000;
}

.comment-button {
    margin: 10px 0 30px 0;
    padding: 5px 30px ;
    border: 2px solid #fd2d01;
    border-radius: 10px;
    background: #ffd7d7;
    font-size: 1rem;
    cursor: pointer;
}

.comment {
    border: 2px solid #000000;
    border-radius: 20px;
    margin-bottom: 20px;
}

.comment-info,
.comment-content {
    padding: 0 30px 0 30px;
}

img {
    width: 70%;
    border-radius: 30px;
}

.content img {
    margin-top: 10px;

}

.photo-profil {
    width: 50px;
    height: 50px;
    border: 2px solid #fd2d01;
    border-radius: 30px;
}


@media screen and (max-width:1024px) {

    
    .header,
    .content {
        width: 90%;
    }
section{
    width: 80%;
}

}

@media screen and (max-width:768px) {

    
    .header,
    .content {
        width: 98%;
    }
section{
    width: 80%;
    
}
    .modif{
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .espacement{
        margin: 0;
    }

    .button {
        width: 50%;
    }

    .createcomment {
        width: 100%;
    }

}

</style>