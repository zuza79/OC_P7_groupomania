<template>
    <div>
        <HeaderProfile />
            <section>
                <h1>Modification de commentaire</h1>
                <p>Vous pouvez modifier votre commentaire</p>
                <form>
                    <ul>
                        
                        <li>
                            <label for="commentaire" aria-label="Commentaire">Commentaire</label>
                            <textarea v-model="comment.content" placeholder="Vous pouvez modifier le commentaire..." rows="10" cols="60" required aria-label="Message du post"></textarea>
                        </li>
                                                                                                
                    </ul>
                </form>
                <button @click="modifyComment()" class="btnSave" aria-label="Modifier ce commentaire"><i class="fas fa-edit"></i> Enregistrer</button>
            </section>
            <div>
            <router-link :to="`/post/${id_param}`" class="btnDelete" aria-label="Retour au fil d'actualité"><i class="fas fa-comment-slash"></i> Annuler</router-link>
            </div>
            <div>
            <router-link to="/allposts" aria-label="Retour ver Le Flash Actu Groupomania"><i class="fas fa-home home"></i></router-link>
            </div>
        <Footer />
    </div>
</template>

<script>
import axios from 'axios';
import HeaderProfile from "../components/HeaderProfile";
import Footer from "../components/Footer";

export default {
    name: 'modifycomment',
    components: {
        HeaderProfile,
        Footer
    },
    data () {
        return {
            id_param: this.$route.params.id,
            post: [],
            comment: [],
            preview: null,
             button : false
        }
    },
    methods: {
         show: function () {
            return this.button = true;
        },
        

         User() {
            this.id = localStorage.getItem("Id")
            this.role = localStorage.getItem("role")
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
                
            .catch(() => console.log('Impossible de récupérer les posts !'))
       }
        },
    },
    mounted () {
        this.getOnePost()
    }
}
</script>

<style scoped>


label {
    font-size: 16px;
    color:rgb(5, 5, 100);
}
.title{
    
    width: 60%;
    height: 30px;
    text-align: center ;
    font-size: 20px;
    font-weight: bolder;

}
form{
   width: 80% ; 
   margin: auto;
}
ul {
    
    
    list-style: none;
    padding: 0;
}

li {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  margin-bottom: 30px;
}

input {
    
    height: 30px;
    font-size: 1.5rem;
    text-align: center;
    margin: 0 auto 0 auto;
}

textarea {
    font-size: 1.2rem;
}

.input-file {
    display: none;
}

.lien {
    text-decoration: none;
    color: #000000;
}

img {
    width: 70%;
    border-radius: 30px;
    margin: auto;
}
.btnDelete{
    margin-top: 20px;
}
.btnSave{
    margin-top:0;
    margin-bottom: 10px;
}
/*
@media screen and (max-width:1024px) {

    h1 {
        font-size: 1.5rem;
    }

    input {
        font-size: 1rem;
    }

    textarea {
        font-size: 1rem;
    }
}

@media screen and (max-width:768px) {

    h1 {
        font-size: 1.2rem;
    }

    input {
        font-size: 0.8rem;
    }

    textarea {
        font-size: 0.6rem;
    }

    img {
    height: 200px;
    }
}
*/
</style>