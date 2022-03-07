<template>
    <div>
        <HeaderProfile />
            
            <section>
                <h1><i class="far fa-edit"></i><br>Rédiger votre message</h1>
                <form>
                    <ul>
                        <li>
                            <input type="text" v-model="title" placeholder="Titre" size="50" required aria-label="Titre du post">
                        </li>
                        
                        <li>
                            <textarea v-model="content" placeholder="Rédiger votre message..." rows="10" cols="60" required aria-label="Message du post"></textarea>
                        </li>
                        <li v-if="image">
                            <img :src="image" alt="Image du post" class="file">
                        </li>
                        <li>
                            <input type="file" accept=".jpeg, .jpg, .png, .webp, .gif" v-on:change="uploadFile" id="file" class="input-file" aria-label="Image du post">
                            <label v-if="!image" for="file" class="label-file" aria-label="Choisir une photo pour ce post"></label>
                            <button v-else @click="deletefile()" class="label-file btnDelete" aria-label="Supprimer cette photo du post"><i class="far fa-trash-alt"></i> Supprimer image</button>
                        </li>
                       

                    </ul>
                </form>
                <button @click="createPost()" class="btnSave" aria-label="Créer ce post">Publier</button>
                <div>
                 <router-link to="/allposts" aria-label="Retour vers Le Flash Actu Groupomania"><i class="fas fa-home home"></i></router-link>
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
    name: 'NewPost',
    components: {
        HeaderProfile,
        Footer
    },
    data() {
        return {
           post: [],
            title: '',
            content: '',
            image: '',
            contentType: 'text',
            preview: null,
            
        }
    },
    methods: {
        // FILE UPLOAD
        uploadFile(event) {
            this.image = event.target.files[0]
        },
        //CREATE POST
   createPost() {
         
        const Id = JSON.parse(localStorage.getItem("userId"))
        const fileField = document.querySelector('input[type="file"]');
        const token = (localStorage.getItem("token"))

            if (this.title === '')
                alert("Veuillez remplir le titre")
            if (this.content === '')
                alert("Veuillez remplir le contenu du message")
           if (this.image === '' && this.title != '' && this.content != ''){ 
                
                let data = new FormData()
                data.append('title', this.title)
                data.append('content', this.content)
                data.append('image', "");
                data.append('userId', Id)

                         axios.post("http://localhost:3000/api/posts/new", data, {
                    
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'authorization': `Bearer ${token}`
                    },
                 
                body: data
                })
                .then(() => {
                     alert("Message  sans image publier")
                            console.log('ok')
                    
                })
                
                .catch((err) => console.log(err))
            } else if (this.title != '' && this.content != '') {

                var fileName = document.getElementById("file").value
                var idxDot = fileName.lastIndexOf(".") + 1;
                var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
                
                if (extFile === "jpg" || extFile === "jpeg" || extFile === "png" || extFile === "webp" ||extFile === "gif"){
                    let data = new FormData()
                    data.append('filename', fileName)
                     data.append('image', this.image);
                     data.append('image', fileField.files[0])
                     //formData.append('image', this.post.image, this.post.image.name);
                   data.append('title', this.title);
                    data.append('content', this.content);
                    data.append('userId',Id);
     
                    axios.post("http://localhost:3000/api/posts/new", data, {
                        
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        'authorization': `Bearer ${token}`
                        },
                        body: data
                        
                    })
                    .then((res) => {
                    alert("Message publier")
                console.log(res.data);
                this.posts = res.data
            })
                
            .catch(() => console.log('Impossible de récupérer information !'))
        
                } else {
                    alert("Uniquement les fichiers jpg, jpeg, png, webp et gif sont acceptés!");
                }
            }
        },
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
    },
    
     mounted(){
        this.getAllPosts()
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
@media screen and (max-width:1024px){
.btnDelete{
    width: 50%;
    margin: 0 auto 0 auto;
}

}
@media screen and (max-width:768px){
.btnDelete{
    width: 50%;
    margin: 0 auto 0 auto;
}
}


</style>