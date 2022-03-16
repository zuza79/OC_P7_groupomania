<template>
    <div>
        <HeaderProfile />
               <section>
     <article class="header">
       <!-- DISPLAY POST --> 
                    <tr class = "card" >
                        <td><input type="text" v-model="post.title" required aria-label="Titre" disabled size="50" ></td>  <!--rows="10" cols="25" -->
                        <td><textarea type="text" v-model="post.content" required aria-label="Message" disabled ></textarea></td>
                        <td><img v-if="post.image" :src="post.image" alt="Image du post"></td>
                                   
                       
                       <td class="info">
                            <p>
                               Posté par 
                                 <b>{{ post.nom }}</b>
                               <!--   <span v-if="post.User.role != 1">{{ post.User.prenom }} </span>     
                                <img class="photo-profil" v-if="post.user.image" :src="post.user.image" alt="photo de profil">
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
                        </td>
                    </tr>
                    
      
  <!-- MODIFY/DELETE POST -->  
                <div class="content">
                    <p class="modif">
                        <button @click="modifyPost()" v-if="post.userId === id" class="btnSave" aria-label="Modifier ce post"><i class="fas fa-edit"></i> Modifier publication</button>
                        <button @click="deletePost()" v-if="post.userId === id || role === 0" class="btnDelete" aria-label="Supprimer ce post"><i class="far fa-trash-alt"></i> Supprimer publication</button>
                    </p>
                </div> 
     
<!--LIKE   -->
<div>
    <Like/>
</div>
   
</article>
<!-- DISPLAY COMMENT -->
                <button v-if="displaycomments === false " v-on:click="show" @click="getPostComments()" class="btnSave" aria-label="Voir les commentaires">Afficher: {{ comments.length }} commentaires </button>
                <table class = "header " v-if="displaycomments" >
                    
                    
                    <h2>Les commentaires:</h2>
                    <!--     <article v-if="comment in comments">
                        <p>Oups! Pour instant pas de commentaire!</p>
                    </article>  -->
                    <tr class = "card displayComment" v-bind:key="index" v-for="(comment, index) in comments" >
                        <td><input type="text" v-model="comment.User.nom" required aria-label="Auteur de commentaire" disabled></td>
                        <td>le <b>{{ dateFormat(comment.createdAt) }}</b>
                             à <b>{{ hourFormat(comment.createdAt) }}</b></td>
                        <td><textarea type="text" v-model="comment.content" required aria-label="Commentaire" disabled></textarea></td>
                <!-- MODIFY/DELETE COMMENT -->  
                <div class="content displayComment">
                    <div class="modif">                                                                   <!-- v-if="post.userId === id"-->
                        <button v-if="modifyComment  ===  false " v-on:click ="show3" @click="modifyComment()"  class="btnSave" aria-label="Modifier ce commentaire"><i class="fas fa-edit"></i> Modifier commentaire</button>
                        <article v-if="modifyComment" class = "header " >
                                <textarea v-model="content" placeholder="Modifier commentaire..." cols="60" rows="5" aria-label="Modification du commentaire"></textarea>
                                <div class=btnComment>                          
                                    <button @click="modifyComment(index)" v-if="post.userId === id || role === 0" class="btnSave" aria-label="Envoyer le commentaire">Envoyer</button>
                                    <button v-on:click="hide3" class="btnDelete" aria-label="Annuler le commentaire">Annuler</button>
                                 </div>
                        </article>
                                
                        <button @click="deleteComment(index)" v-if="post.userId === id || role === 0" class="btnDelete" aria-label="Supprimer ce commentaire"><i class="far fa-trash-alt"></i> Supprimer commentaire</button>
                        <button v-on:click="hide" class="btnDelete" aria-label="Masquer les commentairs">Masquer les commentaires</button>
                    </div>
                </div>  
                    </tr>    
         </table> 
                       
<!-- CREATE COMMENT -->
                <button v-if="displayCreateComment === false" v-on:click="show2" class="btnSave" aria-label="Ecrire un commentaire"><i class="far fa-edit"></i>Commenter</button>
                <article v-if="displayCreateComment" class="createcomment">
                    <textarea v-model="content" placeholder="Faire ton commentaire..." cols="60" rows="5" aria-label="Message du commentaire"></textarea>
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
import Like from "../components/Like";
import Footer from "../components/Footer";

export default {
    name: 'Post',
    props: [''],
    components: {
        HeaderProfile,
        Like,
        Footer
    },
    data () {
        return {
             id_param: this.$route.params.id,
            postId: this.$route.params.id,
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
                user: { },
               
                userId:''
            },
            user : {
                nom: '',
            },
            comments: [],
             id:'',
             content: '',
             userId:'',
            
             
             likes: [],
            errorMessage: "",

            displaycomments: false,
            displayCreateComment: false,
            modifyComment: false,
            role: ''
        }
    },
     computed: {
     
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
        show3: function () {
            return this.modifyComment = true;
        },
        hide3: function () {
            return this.modifyComment = false;
        },
        User() {
            this.id = localStorage.getItem("Id")
            this.role = localStorage.getItem("role")

        },

      
       // DISPLAY ONE POST
        getOnePost() {
            const token = localStorage.getItem("token")
        //    const Id = localStorage.getItem("userId")

            axios.get (`http://localhost:3000/api/posts/${this.id_param}` ,  {
              
                headers: {
                    'authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                    //'Content-Type': 'application/json',
                    //'Cross-Origin-Resource-Policy': 'same-site',
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
               this.post.user.nom = res.data.nom          
            })
            .catch(() => console.log('Impossible de récupérer les posts!'))
        },
// DISPLAY ALL COMMENTS OF POST
        getPostComments() {
            const token = localStorage.getItem("token")
             const Id = localStorage.getItem("userId")
            let data = {
                    content: this.content,
                    postId: this.id_param,
                    userId: Id
                }                  

            axios.get(`http://localhost:3000/api/comments/${this.postId}`,data,  {
                   
                    headers: {
                        'authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                        
                    }
            })
            
            .then((res) => {
                console.log(res.data);
                this.comments = res.data
                this.users = res.data

                this.comment.content = res.data.content;
                this.comment.date = res.data.date;
              //  this.comment.User.nom = res.data.nom;
            })
                
            .catch(() => console.log('Impossible de récupérer les commentaires!'))
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
        deletePost () {
            const token = localStorage.getItem("token")

            if (confirm("Voulez-vous vraiment supprimer le post") === true) {

                axios.delete(`http://localhost:3000/api/posts/${this.id_param}`, {
                   
                    headers: {
                        'authorization': `Bearer ${token}`
                    }
                })
                .then((res) => {
                alert ("Publication supprimer")
                console.log(res.data);
               // this.posts = res.data;
              //  this.$router.push("/allposts");
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

      
//CREATE COMMENT
        createComment () {
            if( this.content === ""){
                alert('Veuillez remplir votre commentaire')

            } else {
                const Id = localStorage.getItem("userId")
                const token = localStorage.getItem("token")
                
               /* let data = new FormData()
                    data.append('content',this.content)
                    data.append('postId',this.id_param)
                    data.append('userId', Id)
               */  
                 let data = {
                    content: this.content,
                    postId: this.id_param,
                    userId: Id
                }                                        // 
                axios.post("http://localhost:3000/api/comments", data, {
                   
                    headers: {
                    'authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',   
                    'Accept': 'application/json',
                    
                    
                    },
                    body: data                })
                .then(() => {
                                alert("commentaire publié")
                                console.log("commentaire OK")
                                this.$router.push("/allposts");
                            })
                
            .catch(() => console.log(' Impossible de publier commentaire!'))
       }
        },
        //MODIFY COMMENT
        

//DELETE COMMENT
        deleteComment (index) {
            const token = localStorage.getItem("token")

            if (confirm("Voulez-vous vraiment supprimer ce commentaire") === true) {

                axios.delete(`http://localhost:3000/api/comments/${this.comments[index].id}`, {
                   
                    headers: {
                        'authorization': `Bearer ${token}`
                    },
                })
                 .then((res) => {
                     alert("La suppression du commentaire est bien prise en compte")
                console.log(res.data);
                this.posts = res.data
            })
                
            .catch(() => {
                alert("Vous n'avez pas autorisation de supprimer ce commentaire!!")
                console.log('Impossible de récupérer les posts !')})
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
    width: 95%;
    display: flex;
    flex-direction: column;
    margin-top: 15px;
}
h2{
    margin-top: 15px;
}
.cardComment {
    display: flex;
    flex-direction: row;
    margin-top: 15px;
}
table{
   margin-top: 15px; 
}
input{
    width: 60%;
    height: 30px;
    margin-top: 10px;
    color: #000000;
    text-align: center ;
    font-size: 20px;
    font-weight: bolder;
}
h1 {
    font-size: 1.5rem;
    margin: 30px 0 10px 0;
}

textarea {
    width: 90%;
    height: 150px;
    font-size: 1.2rem;
    margin: 10px auto 10px auto;
}

.header,
.content {
    width: 60%;
    background:gray;
    border-radius: 20px ;
    }

.header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 20px;
}

.content {
    border-radius: 0 0 20px 20px;
}

.info {
    font-size: 13px;
}
.likeNbr{
    margin: 0;
    padding: 0;
    outline: none;
}
p {
    padding-left: 0.5em;
  }
 #likeIcon:hover {
    cursor: pointer;
    
  }
.like{
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
 }
/*align-items: center;*/
.modif {
    margin: 0;
    
}
.btnDelete{
    margin-bottom: 10px;
}
.btn{
    text-align: center;
     width: 30%;
}
.content {
    margin-bottom: 30px;
}

.createcomment {
    display: flex;
    flex-direction: column;
}

.displayComment{
    border-radius: 20px;
    margin: 10px auto 10px auto ;
    background: rgba(207, 203, 203, 0.877);
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
    width: 95%;
}

}

@media screen and (max-width:768px) {

    
    .header,
    .content {
        width: 98%;
    }
section{
    width: 95%;
    
}
    .modif{
        display: flex;
        flex-direction: column;
        align-items: center;
    }

      .button {
        width: 50%;
    }

    .createcomment {
        width: 100%;
    }

}

</style>