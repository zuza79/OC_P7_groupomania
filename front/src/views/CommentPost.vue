<template>
    <div>
        <HeaderProfile />
            <section>
                <div class="header">
                    <div>
                        <h2>{{ post.title }}</h2>
                    </div>
                    <div>
                        <div class="info">
                            <p>
                                Publier par 
                                <b>{{ post.user.nom }} 
                                <span v-if="post.user.role != 0">{{ post.user.prenom }} </span></b>     
                                <img class="photo-profil" v-if="post.user.image" :src="post.user.image" alt="photo de profil">
                                <img class="photo-profil" v-else src="../assets/images/avatar.jpg" alt="photo de profil"><br>
                                le <b>{{ dateFormat(post.created_date) }}</b>
                                à <b>{{ hourFormat(post.created_date) }}</b><br>
                            </p>
                            <p v-if="post.created_date != post.updated_date">
                                Modification 
                                le <b>{{ dateFormat(post.updated_date) }}</b>
                                à <b>{{ hourFormat(post.updated_date) }}</b>
                            </p>
                        </div>
                    </div>
                </div>

                <div class="content">
                    <p class="modif">
                    <button @click="modifyPost()" v-if="post.userId === id" class="btnSave" aria-label="Modifier ce post"><i class="fas fa-edit"></i> Modifier</button>
                    <button @click="deletePost()" v-if="post.userId === id || role === 0" class="btnDelete" aria-label="Supprimer ce post"><i class="far fa-trash-alt"></i> Supprimer</button>
                    </p>
                    <hr v-if="post.userId === id || role === 0">
                    <img v-if="post.image" :src="post.image" alt="Image du post">
                    <p>{{ post.content }}</p>
                </div>

                <button v-if="comments.length != 0 && displaycomments === false " v-on:click="show" class="comment-button" aria-label="Voir commentaire">Voir {{ comments.length }} commentaire<span v-if="comments.length >= 2">s</span></button>
                <article v-if="displaycomments">
                    <div v-bind:key="index" v-for="(comment, index) in comments" class="comment">
                        <div>
                            <p class="info">
                                Publication par 
                                <b>{{ comment.user.nom }} 
                                <span v-if="comment.user.role != 0">{{ comment.user.prenom }} </span></b> 
                                <img class="photo-profil" v-if="comment.user.image" :src="comment.user.image" alt="photo de profil">
                                <img class="photo-profil" v-else src="../assets/images/avatar.jpg" alt="photo de profil"><br>
                                le <b>{{ dateFormat(comment.date) }}</b>
                                à <b>{{ hourFormat(comment.date) }}</b>
                            </p>
                            <p>
                                <button v-if="comment.userId === id || role === 0" @click="deleteComment(index)" class="btnDelete" aria-label="Supprimer ce commentaire"><i class="far fa-trash-alt"></i></button>
                            </p>
                        </div>                        
                        <hr>
                        <p class="comment-content">{{ comment.content }}</p>
                    </div>
                    <button v-on:click="hide" class="comment-button" aria-label="Cacher commentaire">Cacher le<span v-if="comments.length >= 2">s</span> commentaire<span v-if="comments.length >= 2">s</span></button>
                </article>

                <button v-if="displayCreateComment === false" v-on:click="show2" class="button" aria-label="Ecrire un commentaire"><i class="far fa-edit"></i><br>Rédigér un commentaire</button>
                <article v-if="displayCreateComment" class="createcomment">
                    <textarea v-model="commentaire" placeholder="Rédiger votre commentaire..." cols="60" rows="5" aria-label="Message du commentaire"></textarea>
                    <button @click="createComment()" class="btnSave" aria-label="Envoyer le commentaire">Envoyer</button>
                    <button v-on:click="hide2" class="btnDelete" aria-label="Annuler le commentaire"><i class="fas fa-comment-slash"></i>  Annuler</button>
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
            id_param: this.$route.params.id,
            post: {
                content:'',
                created_date:'',
                updated_date:'',
                id:'',
                image:'',
                title:'',
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
            this.id = JSON.parse(localStorage.getItem("userId"))
            this.role = JSON.parse(localStorage.getItem("role"))

        },

      /* headers: {
           
           'authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}`
                } ,
    */
      //display post  
        getOnePost() {
            

            axios.get (`http://localhost:3000/api/posts/${this.id_param}`, { post : data})
           
            .then (response => response.json())
            .then (data => (this.post = data))
            .catch(alert)
        },
     // display comments   
        
          /*
           headers: {'authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}`
           },
*/
        getPostComments() {    //route :post_id'
            axios.get (`http://localhost:3000/api/comments/${this.id_param}`, { comment : data})
                   
            
            
            .then (response => response.json())
            .then (data => (this.comments = data))
            .catch(alert)
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

        //delete post
        /*
         headers: {
           
           'authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}`
                } ,
                */
        deletePost () {
           

            if (confirm("Voulez-vous vraiment supprimer le post") === true) {

                axios.delete(`http://localhost:3000/api/posts/${this.id_param}`, {
                   
                })
                .then(response => response.json())
                .then(() => { 
                    alert("La suppression du post est bien prise en compte")
                    this.$router.push("/allposts") })
                .catch(alert)
            }
        },
        modifyPost () {
            this.$router.push(`/modifypost/${this.id_param}`)
        },

        //create comment
       /*  headers: {'authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}`
           },
           */
        createComment () {
            if( this.commentaire === ""){
                alert('Veuillez remplir votre commentaire')

            } else {
                const Id = JSON.parse(localStorage.getItem("userId"));
                const token = JSON.parse(localStorage.getItem("token"))
                
                let data = {
                    content: this.commentaire,
                    post_id: this.id_param,
                    userId: Id
                }

                axios.post("http://localhost:3000/api/comments", { data : post})
                    
                
                .then((response) => {
                    return response.json();
                })
                .then(() => {
                    this.$router.go()
                })
                .catch(alert)
            }
        },

        //delete comment

        /*
         headers: {'authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}`
           },
           */
        deleteComment (index) {
            

            if (confirm("Voulez-vous vraiment supprimer ce commentaire") === true) {

                axios.delete(`http://localhost:3000/api/comments/${this.comments[index].id}`, {data:post })
                .then(response => response.json())
                .then(() => { 
                    alert("La suppression du commentaire est bien prise en compte")
                    this.$router.go() })
                .catch(alert)
            }
        }
    },
    mounted(){
        this.User()
        this.getPost ()
        this.getPostComments ()
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
    background: #146cbe;
    border: 2px solid #486ce0;
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
    width: 80%;
    display: flex;
    flex-direction: column;
}

.buttonenvoyer,
.buttonannuler {
    margin: 10px 0 10px 0;
    padding: 5px 30px ;
    border: 2px solid black;
    border-radius: 10px;
    background: gray;
    font-size: 1rem;
    cursor: pointer;
}

.buttonannuler{
    margin-bottom: 40px;
}

.button-comment {
    margin: 10px 0 0 0;
    padding: 5px 5px ;
     border: 2px solid black;
    border-radius: 10px;
    background: gray;
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
     border: 2px solid black;
    border-radius: 10px;
    background: gray;
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
    border-radius: 30px;
}


/*
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
*/
</style>