<template>
    <div>
        <HeaderProfile />
            <section>
                <h1>Modification de message</h1>
                <p>Vous pouvez modifier le text et image de votre message</p>
                <form>
                    <ul>
                        <li>
                            <label for="title"  aria-label="Titre">Titre</label>
                            <input class="title" type="text" v-model="post.title" required aria-label="Titre" disabled size="50" >
                        </li>
                        <li>
                            <label for="message" aria-label="Message">Message</label>
                            <textarea v-model="post.content" placeholder="Afficher le message..." rows="10" cols="60" required aria-label="Message du post"></textarea>
                        </li>
                        
                        <li v-if="post.image">
                            <img :src="post.image" alt="Image du post" class="file" width="200px" height="200px">
                        </li>
                        <li> 
                            <label v-if="!post.image " for="file" class="button" aria-label="Choisir une photo pour ce post">Modifier image</label>
                            <button v-else @click="deletefile()" class="label-file btnDelete" aria-label="Supprimer cette photo du post"> Supprimer image</button>    
                            <input type="file" accept=".jpeg, .jpg, .png, .webp, .gif" v-on:change="uploadFile" id="file" class="input-file" aria-label="Image du post">
                       </li>
                        
                    </ul>
                </form>
                <button @click="modifyPost()" class="btnSave" aria-label="Modifier ce post"><i class="fas fa-edit"></i> Enregistrer</button>
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
    name: 'modifypost',
    components: {
        HeaderProfile,
        Footer
    },
    data () {
        return {
            id_param: this.$route.params.id,
            post: [],
            preview: null,
             button : false
        }
    },
    methods: {
         show: function () {
            return this.button = true;
        },
        // FILE UPLOAD
        uploadFile(event) {
            this.image = event.target.files[0]
        },

         User() {
            this.id = localStorage.getItem("Id")
            this.role = localStorage.getItem("role")
             },

//GET POST
        getOnePost() {
            const token = localStorage.getItem("token")
            const fileField = document.querySelector('input[type="file"]');
                                                // ${post.id}                  
            axios.get (`http://localhost:3000/api/posts/${this.id_param}`, {
                   
                    headers: {
                        'authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                        'Cross-Origin-Resource-Policy': 'same-site',
                    }
            })
             .then((res) => {
                console.log(res.data);
                this.posts = res.data;
                this.post.title = res.data.title;
                this.post.image = fileField.files[0];
               
            })
            .catch(() => console.log('Impossible de récupérer les posts !'))
        },
//MODIFY POST
        modifyPost() {
            const token = localStorage.getItem("token")
            const fileField = document.querySelector('input[type="file"]');
            
            if (confirm("Voulez-vous vraiment modifier ce post?") === true);
            
            if (this.post.title === "")
                alert("Veuillez remplir le titre");

            if (this.post.content === "")
                alert("Veuillez remplir votre message");
            if (this.post.image === null && this.post.title != "" && this.post.content != "") {
               
                let data = new FormData()
                data.append('image', '')
                data.append('content', this.post.content)

                axios.put(`http://localhost:3000/api/posts/${this.id_param}`, data,  {
                   
                    headers: {
                        'authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    body: data
                    
                })
                    .then((res) => {
                        alert("Modification de message sans image réusi")
                console.log("modification ok");
                this.posts = res.data
                //this.$router.push(`/post/${this.id_param}`);
                })
                   
                .catch(() =>{ 
                alert("Vous n'avez pas autorisation de modifier ce message!!")
                console.log('Vous n avez pas autorisation de modifier!!')
        
          } )
                    
            } else if (this.post.title != "" && this.post.content != "") {

                let data = new FormData()
                data.append('image', fileField.files[0])
                data.append('content', this.post.content)

                axios.put(`http://localhost:3000/api/posts/${this.id_param}`, data ,{
                    
                    headers: {
                        'authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    body: data
                })
                .then((res) => {
                      console.log(res.data);
                this.posts = res.data;
                this.post.content = res.data.content;
                this.post.image = res.data.image;
                this.post.createdAt = res.data.createdAt;
                this.post.updatedAt = res.data.updatedAt;
                        alert("Modification de message avec image réusi")
                console.log("modification ok");
                this.posts = res.data
                //this.$router.push(`/post/${this.id_param}`);
                })
                   
                .catch(() =>{ 
                alert("Vous n'avez pas autorisation de modifier ce message!!")
                console.log('Vous n avez pas autorisation de modifier!!')
        
          } )}
        },
    //UPLOAD POST
        uploadFile(e) {
            if (e.target.files) {
                let reader = new FileReader()
                reader.onload = (event) => {
                    this.preview = event.target.result
                    this.post.image = event.target.result
                }
                reader.readAsDataURL(e.target.files[0])
            }
        },
        deletefile() {
            this.post.image = null;
        }
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