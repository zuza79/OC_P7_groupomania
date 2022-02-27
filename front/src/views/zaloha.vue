<template>
    <div>
        <HeaderProfile />
        
        
            <div class="like">
          <button class="btnSave" @click="likePost">
            <div><i class="fas fa-thumbs-up like"></i>{{ like }}</div>
          </button>

       <!--   <button class="btnDelete ">
            <div><i class="fas fa-thumbs-down dislike"></i>{{ dislike }}</div>
          </button>
   -->    
      </div>

 
            <section>
     <div class="header">
       <!--   <post v-for="(post, index) in posts" :key="index" :post="post">{{post}}</post>
                  <tr class = "card" v-bind:key="index" v-for="(post, index) in posts"> 
                    
                    <post v-for="post in posts" v-bind:key="post.id" :post="post"></post>-->
                    <div>
                        <h3>{{ post.title }}</h3>
                    </div>
                    <div>
                        <p>{{ post.content }}</p>
                    </div>
                
                    <div>
                        
                        <div class="info">
                            <p>
                                Posté par 
                                <b>{{ post.user.nom }} 
                                <span v-if="post.user.role != 0">{{ post.user.prenom }} </span></b>     
                               <!-- <img class="photo-profil" v-if="post.user.image" :src="post.user.image" alt="photo de profil">
                                <img class="photo-profil" v-else src="../assets/images/photo-profil.jpg" alt="photo de profil"><br>
                               -->
                                le <b>{{ dateFormat(post.created_date) }}</b>
                                à <b>{{ hourFormat(post.created_date) }}</b><br>
                            </p>
                            <p v-if="post.created_date != post.updated_date">
                                Modifié 
                                le <b>{{ dateFormat(post.updated_date) }}</b>
                                à <b>{{ hourFormat(post.updated_date) }}</b>
                            </p>
                        </div>
                    </div>
                </div>

                <div class="content">
                    <p class="modif">
                    <button @click="modifyPost()" v-if="post.userId === id" class="button" aria-label="Modifier ce post"><i class="fas fa-edit"></i> Modifier ce post</button>
                    <button @click="deletePost()" v-if="post.userId === id || role === 1" class="button espacement" aria-label="Supprimer ce post"><i class="far fa-trash-alt"></i> Supprimer ce post</button>
                    </p>
                    <hr v-if="post.userId === id || role === 1">
                    <img v-if="post.image" :src="post.image" alt="Image du post">
                    <p>{{ post.content }}</p>
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
                                <button v-if="comment.userId === id || role === 1" @click="deleteComment(index)" class="button-comment" aria-label="Supprimer ce commentaire"><i class="far fa-trash-alt"></i></button>
                            </p>
                        </div>                        
                        <hr>
                        <p class="comment-content">{{ comment.content }}</p>
                    </div>
                    <button v-on:click="hide" class="comment-button" aria-label="Cacher commentaire">Cacher le<span v-if="comments.length >= 2">s</span> commentaire<span v-if="comments.length >= 2">s</span></button>
                </article>

                <button v-if="displayCreateComment === false" v-on:click="show2" class="button" aria-label="Ecrire un commentaire">Ecrire un commentaire</button>
                <article v-if="displayCreateComment" class="createcomment">
                    <textarea v-model="commentaire" placeholder="Faire ton commentaire..." cols="60" rows="5" aria-label="Message du commentaire"></textarea>
                    <button @click="createComment()" class="btnSave" aria-label="Envoyer le commentaire">Envoyer le commentaire</button>
                    <button v-on:click="hide2" class="btnDelete" aria-label="Annuler le commentaire">Annuler le commentaire</button>
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
    components: {
        HeaderProfile,
        Footer
    },
    data () {
        return {
            posts: [],
            users: [],
            postId: this.$route.params.id,
            post: {
                title:'',
                content:'',
                created_date:'',
                updated_date:'',
                id:'',
                image:'',
                user: {},
                userId:''
            },
            comments: [],
            displaycomments: false,
            displayCreateComment: false,
            commentaire:'',
            id:'',
            role: ''
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
       
        getOnePost() {
            const token = localStorage.getItem("token")
           const postId = localStorage.getItem('postId');
           
           //  axios.get (`http://localhost:3000/api/posts/${this.posts[index].id}`, { ${post.id} + this.post.id
            axios.get (`http://localhost:3000/api/posts/{postId}`, {
              
                headers: {
                    'authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            })
            .then(() => {res => 
                                alert("message afficher")
                                console.log("message afficher")
                               this.posts = res.data
                            })
            
                
            .catch(() => console.log('erreur getOnePost !' + err))
        },
        
        getPostComments() {
            const token = localStorage.getItem("token")

            axios.get (`http://localhost:3000/api/comments/${this.postId}}`, {
                   
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

        likePost(){
            console.log(this.post);
             const token = sessionStorage.getItem('token');
            
             axios.put(`http://localhost:3000/api/posts/${this.post.id}`, {like: this.likeIncrement}, {
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
      

        deletePost () {
            const token = JSON.parse(localStorage.getItem("userToken"))

            if (confirm("Voulez-vous vraiment supprimer le post") === true) {

                axios.delete(`http://localhost:3000/api/posts/${this.id_param}`, {
                   
                    headers: {
                        'authorization': `Bearer ${token}`
                    }
                })
                .then((res) => {
                console.log(res.data);
                this.posts = res.data
            })
                
            .catch(() => console.log('Impossible de récupérer les posts !'))
        
            }
        },
        modifyPost () {
            this.$router.push(`/modifypost/${this.id_param}`)
        },

        //create comment
        createComment () {
            if( this.commentaire === ""){
                alert('Veuillez remplir votre commentaire')

            } else {
                const Id = localStorage.getItem("userId");
                const token = localStorage.getItem("token")
                
                let data = {
                    content: this.commentaire,
                    postId: this.id_param,
                    userId: Id
                }

                get.post("http://localhost:3000/api/comments/new", data, {
                   
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                    },
                    body: data                })
                .then(() => {
                                alert("commentaire fait")
                                console.log("commentaire fait")
                            })
                
            .catch(() => console.log(' erreur commentaire!'))
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
        this.getOneUser()
        this.getOnePost ()
       
       this.getComments ()
    }
}
</script>




<style scoped>
section {
    display: flex;
    flex-direction: column;
    align-items: center;
}

h1 {
    font-size: 1.5rem;
    margin: 30px 0 10px 0;
}

textarea {
    font-size: 1.2rem;
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

.content {
    margin-bottom: 30px;
}

.createcomment {
    display: flex;
    flex-direction: column;
}





.buttonannuler{
    margin-bottom: 40px;
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

}

@media screen and (max-width:768px) {

    
    .header,
    .content {
        width: 98%;
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