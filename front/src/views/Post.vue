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
            image: '',
            preview: null
        }
    },
    methods : {
// create post
            createPost() {
           // const Id = JSON.parse(localStorage.getItem("userId"))
          //const token = JSON.parse(localStorage.getItem("token"))
           const userId = this.$route.params.id;
           const token = localStorage.getItem('token');
           const fileField = document.querySelector('input[type="file"]');
         

            if (this.titre === '')
                alert("Veuillez remplir le titre")
            if (this.contenu === '')
                alert("Veuillez remplir le contenu du message")
            if (this.image === '' && this.titre != '' && this.contenu != '') {
                let data = new FormData()
                data.append('title', this.titre)
                data.append('content', this.contenu)
                data.append('id', this.user_id) //userId

                axios.post("http://localhost:3000/api/posts", {
                   
                   headers: {
                   'authorization': `Bearer ${token}`
                   },
                  // body: data
                })
                .then((response) => {
                    return response.json();
                })
                .then(() => {
                    localStorage.setItem('userId', parseInt(res.data.userId));
                    localStorage.setItem('token', res.data.token);
                    this.$router.push("/allposts");
                })
                .catch(alert)

            } else if (this.titre != '' && this.contenu != '') {
                 var fileName = document.getElementById("file").value
                var idxDot = fileName.lastIndexOf(".") + 1;
                var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
               
                if (extFile === "jpg" || extFile === "jpeg" || extFile === "png" || extFile === "webp" ||extFile === "gif"){
               let data = new FormData()
                data.append('image', fileField.files[0])
                data.append('title', this.titre)
                data.append('content', this.contenu)
                data.append('id', userId)

           
                axios.post("http://localhost:3000/api/posts", {
                    headers: {
                        'authorization': `Bearer ${token}`
                        },
                })
                .then((response) => response.json())
                .then(() => {
                    this.$router.push("/allposts");
                })
                .catch(alert)
                } else {
                    alert("Uniquement les fichiers jpg, jpeg, png, webp et gif sont acceptés!");
                }
            }
        },
    //upload file
        uploadFile(e) {
            if (e.target.files) {
                let reader = new FileReader()
                reader.onload = (event) => {
                    this.preview = event.target.result
                    this.image = event.target.result
                }
                reader.readAsDataURL(e.target.files[0])
            }
        },
        deletefile() {
            this.image = '';
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