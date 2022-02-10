<template>
    <div>
        <HeaderProfile />
            
            <section>
                <h1><i class="far fa-edit"></i><br>Rédiger votre message</h1>
                <form>
                    <ul>
                        <li>
                            <input type="text" v-model="titre" placeholder="Titre" size="50" required aria-label="Titre du post">
                        </li>
                        <li>
                            <textarea v-model="contenu" placeholder="Rédiger votre message..." rows="10" cols="60" required aria-label="Message du post"></textarea>
                        </li>
                        <li v-if="image">
                            <img :src="image" alt="Image du post" class="file">
                        </li>
                        <li>
                            <label v-if="!image" for="file" class="label-file" aria-label="Choisir une photo pour ce post"></label>
                            <button v-else @click="deletefile()" class="btnDelete label-file" aria-label="Supprimer cette photo du post"><i class="far fa-trash-alt"></i> Supprimer image</button>
                            <input type="file" accept="image/jpeg, image/jpg, image/png, image/webp" v-on:change="uploadFile" id="file" class="input-file" aria-label="Image du post">
                        </li>
                        
                    </ul>
                </form>
                <button @click="createPost()" class="btnSave" aria-label="Envoyer le message">Envoyer</button>
                <div>
                <router-link to="/allposts" aria-label="Retour ver Le Flash Actu Groupomania"><i class="fas fa-home home"></i></router-link>
                </div>
            </section>
           
            
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
            titre: '',
            contenu: '',
            image: null,
            contentType: 'text',
            preview: null
        }
    },
    methods : {
// Récupération du fichier image uploadé
        onFileSelected(event) {
            this.image = event.target.files[0]
        },

        // Création d'un nouveau post
        createPost() {    
            const token = localStorage.getItem('token');
            this.content = true;    
            
            // Aucun contenu ajouté
            if(!this.content && !this.image){
                this.content = false;

            // Texte ajouté
            } else if(this.contentType === "text"){
                this.image = null
                if(!this.content){
                    this.content = false;
                } else {
                    const postText = { content: this.content }
                    axios.post('http://localhost:3000/api/posts/', postText, {
                        headers: {
                            'authorization': `Bearer ${token}`,
                        }
                    })
                        .then(res => console.log(res))
                        .catch(() => console.log('Ceci est une erreur'))
                }

            // Image ajoutée
            } else if(this.contentType === "img") {
                this.content = "";
                if (!this.image){
                    this.content = false;
                } else {
                    let formData = new FormData();
                    formData.append('image', this.image)
                    axios.post('http://localhost:3000/api/posts/', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'authorization': `Bearer ${token}`,
                        }
                    })
                        .then(() => {
                            console.log('ok')
                        })
                        .catch((err) => console.log(err))
                }
            }            
        }        
    }
}
</script>

<style scoped>
section {
    display: flex;
    flex-direction: column;
    align-items: center;
}

form{
    width: 80%;
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
    display: flex;
    flex-direction: column;
}



.buttonenvoyer,
.buttonannuler {
    margin: 10px 0 10px 0;
    padding: 5px 30px ;
    border: 2px solid #146cbe;
    border-radius: 10px;
    background: #486ce0;
    font-size: 1rem;
    cursor: pointer;
}

.buttonannuler{
    margin-bottom: 40px;
}

.button-comment {
    margin: 10px 0 0 0;
    padding: 5px 5px ;
    border: 2px solid #146cbe;
    border-radius: 10px;
    background: #486ce0;
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
    border: 2px solid #146cbe;
    border-radius: 10px;
    background: #486ce0;
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
    margin: auto;
}

.content img {
    margin-top: 10px;

}

.photo-profil {
    width: 50px;
    height: 50px;
    border: 2px solid #146cbe;
    border-radius: 30px;
}



</style>