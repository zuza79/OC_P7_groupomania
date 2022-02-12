<template>
    <div>
         <HeaderProfile />
            <!--users -->   
        <h1>Utilisateurs</h1>
            <article >
                <div>
                    <input v-model="search" class="search" type="search" placeholder="Rechercher par NOM " size=40 aria-label=" Barre de recherche d'un utilisateur avec son Nom">
                </div>
                <table>
                    <tr>
                        <th>Modification MDP</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                        <th>Rôle</th>
                        <th>Photo de profil</th>
                    </tr>
                    <tr v-bind:key="index" v-for="(user, index) in filterList">
                        <td>
                            <button @click="modifyPassword(index)" aria-label="Modifier le mot de passe de ce utilisateur"><i class="fas fa-edit"></i></button>
                        </td>
                        <td><input type="text" v-model="user.nom" required aria-label="Nom"></td>
                        <td><input type="text" v-model="user.prenom" required aria-label="Prénom"></td>
                        <td><input type="text" v-model="user.email" required class="email" aria-label="Email"></td>
                        <td>
                            <select v-model="user.role" name="role" id="role-select" aria-label="Role">
                                <option value="0" aria-label="Role administrateur">Admin</option>
                                <option value="1" aria-label="Role Utilisateur">Utilisateur</option>
                            </select>
                        </td>
                        <td><img v-if="user.image" :src="user.image" alt="photo de profil"></td>
                        <button @click="modifyUser(index)" aria-label="Modifier cet utilisateur" class="btnSave"><i class="fas fa-edit"></i></button>
                        <button @click="deleteUser(index)" aria-label="Supprimer cet utilisateur" class="btnDelete"><i class="far fa-trash-alt"></i></button>
                    </tr>
                </table>
                 <router-link to="/admin" aria-label="Retour vers administration"><i class="fa-solid fa-turn-down-left">Menu</i></router-link>
        </article>
        
        <Footer />
   </div>
</template>

<script>
import axios from 'axios';
import HeaderProfile from "../components/HeaderProfile";
import Footer from "../components/Footer";

export default {
    name: 'AdminUsers',
    components: {
         HeaderProfile,
        Footer
    },
    data () {
        return {
            users: [],
            search: '',
            posts: []
        }
    },
    computed : {
        filterList() {
            return this.users.filter((user) =>{
                return user.nom.toLowerCase().includes(this.search.toLowerCase());
            })
        }
    },
    methods : {
    //GET ALL USERS
        getAllUsers() {
            const token = JSON.parse(localStorage.getItem("userToken"))

            axios.get('http://localhost:3000/api/auth/', {
               
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
            
            .then(response => response.json())
            .then(data => (this.users = data))
            .catch(alert)
        },

//DELETE USER
        deleteUser(index) {
            localStorage.setItem('userId', parseInt(res.data.userId));
            localStorage.setItem('token', res.data.token);

            if (confirm("Voulez-vous vraiment supprimer cet utilisateur") === true) {

                axios.get(`http://localhost:3000/api/posts/${this.filterList[index].id}/posts`, {
                    
                    headers: {
                        'authorization': `Bearer ${token}`
                    },
                })
                .then(response => response.json())
                .then(data => (this.posts = data))
                .then (() => {
                    let publication = this.posts

                    for ( let i = 0 ; i < publication.length ; i++) {
                        if (publication[i].image) {
                            axios.delete(`http://localhost:3000/api/posts/${publication[i].id}`, {
                               
                                headers: {
                                    'authorization': `Bearer ${token}`
                                },
                            })
                            .then(response => response.json())
                            .catch(error => console.log(error))
                        }
                    }
                })
                .then(() => {
                    axios.delete(`http://localhost:3000/api/auth/${this.filterList[index].id}`, {
                        headers: {
                            'authorization': `Bearer ${token}`
                        }
                    })
                    .then(response => response.json())
                    .then(() => { 
                        this.$router.go()
                        })
                    .catch(error => console.log(error))
                })
                .catch(error => console.log(error))
            }
        },
//MODIFY USER
        modifyUser(index) {
            localStorage.setItem('userId', parseInt(res.data.userId));
                    localStorage.setItem('token', res.data.token);

            if (confirm("Voulez-vous vraiment modifier cet utilisateur") === true) {
                

                axios.put(`http://localhost:3000/api/auth/admin/${this.filterList[index].id}`, {
                  
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${token}`
                    },
                    body : JSON.stringify(this.filterList[index])
                })
                .then(response => response.json())
                .then(data => (this.filterList[index] = data))
                .then(() => { 
                    this.$router.go()
                })
                .catch(error => console.log(error))
            }
        },

//MODIFY PASSWORD
        modifyPassword(index) {
            this.$router.push(`/modifyPassword/${this.filterList[index].id}`)
        }
    },
    mounted(){
        this.getAllUsers()
    }
}
</script>

<style scoped>
table {
    width: 80%;
    height: 25px;
    margin: 0 auto 0 auto;
    font-size: 1vw;
    background: white;
    border: 2px solid gray;
    border-radius: 20px;
    
}
.search {
    margin-bottom: 30px;
    border: 2px solid gray;
    font-size: 15px;
    text-align: center;
}

input {
    font-size: 15px;
}

hr {
    background-color: gray;
}

img {
    width: 50px;
    height: 50px;
    border: 2px solid gray;
    border-radius: 30px;
}
tr {
    font-size: 12px;
}

select {
    background-color: white;
}


</style>