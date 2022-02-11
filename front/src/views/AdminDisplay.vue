<template>
    <div>
        <HeaderProfile />
        <AdminHeader />
        <div id = "admin">
            <nav class="menu">  
                <router-link to="/admin/users" aria-label="Administration des utilisateurs" class="menuLink">Utilisateurs</router-link> 
                <router-link to="/admin/posts" aria-label="Administration des messages" class="menuLink">Messages</router-link>
                <router-link to="/admin/comments" aria-label="Administration des commentaires" class="menuLink">Commentaires</router-link>
            </nav>
        </div>
     <Footer />   
    </div>
    
</template>

<script>
import axios from 'axios';

import HeaderProfile from "../components/HeaderProfile";
import AdminHeader from "../components/AdminHeader";
import Footer from "../components/Footer";


export default {
    name: 'AdminDisplay',
    components: {
        HeaderProfile,
        AdminHeader,
        Footer
    },
    
     
} 
</script>

<style scoped>
h1, .nav, #admin{
    margin: 0 auto 0 auto;
    padding: 0;
}
.menu{
    margin: 5px;
  display: flex;
    flex-direction: column;
    justify-content: center;  
    margin: 15px auto 15px auto;
}
.menuLink{
    
    width: 25%;
    margin: 10px auto 30px auto ;
    
    padding: 10px ;
    text-decoration: none;
    color: black;
    font-size: 14px;
    font-weight: bolder;
  background: gray;
    border: 1px solid black;
    border-radius: 20px;
}
.title{
    color:rgb(5, 5, 100);
    font-weight: bolder;
    font-size: 18px;
    margin-top: 20px;
}
.search {
    margin: 10px auto 10px auto;
    font-size: 14px;
    text-align: center;
    width: 80%;
    height: 30px;
    border: 2px solid black;
    border-radius: 15px;
}
::placeholder {
    text-align: center;
    font-size: 14px;
}
table {
    width: 90%;
    height: 20px;
    margin: 5px auto 15px auto;
    font-size: 14px;
    background: #b4c4d6;
    border: 1px solid black;
    border-radius: 20px;
    
}

input,
textarea {
    font-size: 1vw;
}




</style>