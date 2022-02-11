<template>
    <div>
         <HeaderProfile />
        
        <!--comments -->
           <h1>Commentaires</h1> 
            <article >
                <table>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Titre du post</th>
                        <th>Commentaire</th>
                    </tr>
                    <tr v-bind:key="index" v-for="(comment, index) in comments">
                        <td><input type="text" v-model="comment.user.nom" required aria-label="Nom de l'auteur du commentaire" disabled></td>
                        <td><input type="text" v-model="comment.user.prenom" required aria-label="Prénom de l'auteur du commentaire" disabled></td>
                        <td><input type="text" v-model="comment.post.title" required aria-label="Titre du post" disabled></td>
                        <td><textarea type="text" v-model="comment.content" rows="3" cols="50" required aria-label="Commentaire" disabled></textarea></td>
                        <button @click="deleteComments(index)" aria-label="Supprimer ce commentaire"><i class="fa-solid fa-turn-down-left">Menu</i></button>
                    </tr>
                </table>
                
            </article>
          
            <router-link to="/admin" aria-label="Retour vers administration"><i class="fa-solid fa-turn-down-left">Menu</i></router-link>
        <Footer />
    </div>
</template>

<script>
import axios from 'axios';
import HeaderProfile from "../components/HeaderProfile";
import Footer from "../components/Footer";

export default {
    name: 'AdminComments',
    components: {
         HeaderProfile,
       
        Footer
    },
    data () {
        return {
            comments: [],
        }
    },
    methods : {
// DISPLAY COMMENTS
        getComments() {
            const token = JSON.parse(localStorage.getItem("userToken"))

            axios.get (`http://localhost:3000/api/comments/`, {
                   
                    headers: {
                        'authorization': `Bearer ${token}`
                    }
            })
            
            .then (response => response.json())
            .then (data => (this.comments = data))
            .catch(alert)
        },

//DELETE COMMENTS
        deleteComments(index) {
            const token = JSON.parse(localStorage.getItem("userToken"))

            if (confirm("Voulez-vous vraiment supprimer le commentaire") === true) {

                fetch(`http://localhost:3000/api/comments/${this.comments[index].id}`, {
                    method: "DELETE",
                    headers: {
                        'authorization': `Bearer ${token}`
                    },
                    body : JSON.stringify(this.comments[index])
                })
                .then(response => response.json())
                .then(data => (this.comments[index] = data))
                .then(() => {
                    this.$router.go()
                })
                .catch(alert)
            }
        }
    },
    mounted(){
        this.getComments()
    }
}
</script>

<style scoped>
table {
    width: 100%;
    font-size: 1vw;
    background: white;;
    border: 2px solid gray;
    border-radius: 20px;
    margin: 0 0 30px 0;
}

.button{
    margin: 10px 0 30px 0;
    padding: 5px 3vw ;
    border: 2px solid gray;
    border-radius: 10px;
    background: #ffd7d7;
    font-size: 1vw;
    cursor: pointer;
    text-decoration: none;
    color: #000000;
}



input,
textarea {
    font-size: 1vw;
}

textarea {
    resize: none;
}

</style>