<template>
  <!-- DISPLAY COMMENT 
                <button v-if="displaycomments === false " v-on:click="show" @click="getPostComments()" class="btnSave" aria-label="Voir les commentaires">Afficher: {{ comments.length }} commentaires </button>
                <table class = "header " v-if="displaycomments" >
                    
                    
                    <h2>Les commentaires:</h2>
                    
    
                    <tr class = "card displayComment" v-bind:key="index" v-for="(comment, index) in comments" >
                        <td><input type="text" v-model="comment.User.nom" required aria-label="Auteur de commentaire" disabled></td>
                        <td>le <b>{{ dateFormat(comment.createdAt) }}</b>
                             à <b>{{ hourFormat(comment.createdAt) }}</b></td>
                        <td><textarea type="text" v-model="comment.content" required aria-label="Commentaire" disabled></textarea></td>
  


                <div class="content displayComment">
                    <div class="modif">                                                                  
                        <button v-if="modifyComment  ===  false " v-on:click ="show2" @click="modifyComment()"  class="btnSave" aria-label="Modifier ce commentaire"><i class="fas fa-edit"></i> Modifier commentaire</button>
                        <article v-if="modifyComment" class = "header " >
                                <textarea v-model="content" placeholder="Modifier commentaire..." cols="60" rows="5" aria-label="Modification du commentaire"></textarea>
                                <div class=btnComment>                          
                                    <button @click="modifyComment(index)" v-if="post.userId === id || role === 0" class="btnSave" aria-label="Envoyer le commentaire">Envoyer</button>
                                    <button v-on:click="hide2" class="btnDelete" aria-label="Annuler le commentaire">Annuler</button>
                                 </div>
                        </article>
                                
                        <button @click="deleteComment(index)" v-if="post.userId === id || role === 0" class="btnDelete" aria-label="Supprimer ce commentaire"><i class="far fa-trash-alt"></i> Supprimer commentaire</button>
                        <button v-on:click="hide" class="btnDelete" aria-label="Masquer les commentairs">Masquer les commentaires</button>
                    </div>
                </div>  
                    </tr>    
         </table> 
                       

                <button v-if="displayCreateComment === false" v-on:click="show" class="btnSave" aria-label="Ecrire un commentaire"><i class="far fa-edit"></i>Commenter</button>
                <article v-if="displayCreateComment" class="createcomment">
                    <textarea v-model="content" placeholder="Faire ton commentaire..." cols="60" rows="5" aria-label="Message du commentaire"></textarea>
                    <div class=btnComment>
                    <button @click="createComment()" class="btnSave" aria-label="Envoyer le commentaire">Envoyer</button>
                    <button v-on:click="hide" class="btnDelete" aria-label="Annuler le commentaire">Annuler</button>
                    </div>
                </article>
                

          
</template>

-->

<script>
import axios from "axios";
export default {
  name: "Comment",
  data() {
    return {
      likes: [],
      errorMessage: "",
      displaycomments: false,
            displayCreateComment: false,
            modifyComment: false,
            role: ''
    };
  },
  methods : {
     show: function () {
            return this.displayCreateComment = true;
        },
        hide: function () {
            return this.displayCreateComment = false;
        },
     show2: function () {
            return this.modifyComment = true;
        },
        hide2: function () {
            return this.modifyComment = false;
        },
        User() {
            this.id = localStorage.getItem("Id")
            this.role = localStorage.getItem("role")

        },   
  


  // GET COMMENT
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
                    'Content-Type': 'application/json',
                    
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
        
modifyComment(index) {
            const token = localStorage.getItem("token")
            const Id = localStorage.getItem("userId")

            if (confirm("Voulez-vous vraiment modifier commentaire") === true) {
               
               let data = { content: this.content}
                
    axios.put(`http://localhost:3000/api/comments/${this.comments[index].Id}`,data, {
                    
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'authorization': `Bearer ${token}`
                    },
                    body: data 
                })
                 .then(() => {
                                alert("commentaire modifié")
                                console.log("modify OK")
                            })
                
            .catch(() =>{
                 alert("Vous n'avez pas autorisation de modifier commentaire!!")
             console.log(' Impossible de publier commentaire!')
       } )}
        },

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


.link {
    text-decoration: none;
    color: #000000;
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