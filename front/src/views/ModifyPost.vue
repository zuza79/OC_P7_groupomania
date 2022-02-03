<template>
    <div>
        <HeaderProfile />
            <section>
                <h1>Modification de message</h1>
                <form>
                    <ul>
                        <li>
                            <label for="titre"  aria-label="Titre">Titre</label>
                            <input type="text" v-model="post.title" placeholder="Titre" size="50" required aria-label="Titre du post">
                        </li>
                        <li>
                            <label for="message" aria-label="Message">Message</label>
                            <textarea v-model="post.content" placeholder="Afficher le message..." rows="10" cols="60" required aria-label="Message du post"></textarea>
                        </li>
                        <li v-if="post.image">
                            <img :src="post.image" alt="Image du post" class="file">
                        </li>
                        <li>
                            <label v-if="!post.image " for="file" class="button" aria-label="Choisir une photo pour ce post">Modifier image</label>
                            <button v-else @click="deletefile()" class="label-file btnDelete" aria-label="Supprimer cette photo du post"> Supprimer image</button>
                            
                            <input type="file" accept="image/jpeg, image/jpg, image/png, image/webp" v-on:change="uploadFile" id="file" class="input-file" aria-label="Image du post">
                        </li>
                        
                    </ul>
                </form>
                <button @click="modifyPost()" class="btnSave" aria-label="Modifier ce post"><i class="fas fa-edit"></i> Enregistrer</button>
            </section>
            <div>
            <router-link :to="`/post/${this.id_param}`" class="btnDelete" aria-label="Retour au fil d'actualité"><i class="fas fa-comment-slash"></i> Annuler</router-link>
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
            preview: null
        }
    },
    methods: {
        getPost() {
            const token = JSON.parse(localStorage.getItem("userToken"))

            axios.get (`http://localhost:3000/api/posts/${this.id_param}`, {
                    method: "GET",
                    headers: {
                        'authorization': `Bearer ${token}`
                    }
            })
            .then (response => response.json())
            .then (data => (this.post = data))
            .catch(alert)
        },
        modifyPost() {
            const fileField = document.querySelector('input[type="file"]');
            const token = JSON.parse(localStorage.getItem("userToken"))

            if (this.post.title === "")
                alert("Veuillez remplir le titre");

            if (this.post.content === "")
                alert("Veuillez remplir votre message");
            if (this.post.image === null && this.post.title != "" && this.post.content != "") {
                let data = new FormData()
                data.append('title', this.post.title)
                data.append('content', this.post.content)

                axios.put(`http://localhost:3000/api/posts/${this.id_param}`, {
                    method: "PUT",
                    headers: {
                        'authorization': `Bearer ${token}`
                    },
                    body: data
                })
                    .then(response => response.json())
                    .then(data => (this.post = data))
                    .then(() => {
                        this.$router.push(`/post/${this.id_param}`);
                    })
                .catch(alert)

            } else if (this.post.title != "" && this.post.content != "") {

                let data = new FormData()
                data.append('image', fileField.files[0])
                data.append('title', this.post.title)
                data.append('content', this.post.content)

                axios.put(`http://localhost:3000/api/posts/${this.id_param}`, {
                    method: "PUT",
                    headers: {
                        'authorization': `Bearer ${token}`
                    },
                    body: data
                })
                .then((response) => response.json())
                .then(() => {
                    this.$router.push(`/post/${this.id_param}`);
                })
                .catch(alert)
            }
        },
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
        this.getPost()
    }
}
</script>

<style scoped>


label {
    font-size: 16px;
    color:rgb(5, 5, 100);
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