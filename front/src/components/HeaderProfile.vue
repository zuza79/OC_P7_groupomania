<template>
    <header class="nav">
        <a href="/"><img class="imgLogo" src="../assets/images/logoMono.png" alt="Logo Groupomania" /></a>
        <nav>
            <router-link class="link" to="/profile"  aria-label="Profil">Mon profil</router-link>
            <router-link class="link" to="/allposts" aria-label="Retour ver Le Flash Actu Groupomania"><i class="fas fa-home home"></i></router-link>
            <router-link class="link" to="/" @click="disconnectUser()">Déconnexion</router-link>
        </nav>

    </header>
</template>


<script>

export default {
name: 'HeaderProfile',
data () {
	return {
		role:''
	}
},
methods: {
  
	disconnectUser() {
		localStorage.clear();
		this.$router.push("/")
	},
	roleUser() {
		this.role = JSON.parse(localStorage.getItem("role"))
	}
},

mounted(){
    this.roleUser()
}
}   
</script>


<style scoped>

header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
nav{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.imgProfile {
     object-fit: cover;
     width: 100%;
     height: 100%;
     clip-path: circle();
     border-radius: 50%;
 }

.imgLogo {
  width: 60%;
  display: block;
 padding-top: 10px;
 margin-left: auto;
 margin-right: auto;
  object-fit: cover;
  background-size: cover;
}

.link {
  padding-left: 30px;
  font-size: 1.1rem;
  text-decoration: none;
  cursor: pointer;
}

.link:hover {
  color: black;

}
.nav {
  padding: 20px 5vw;
  font-size: 1vw;

}

.nav a {
  font-weight: bold;
  color: #000000;

}

.nav a.router-link-exact-active {
  color: black;
}

i {
    font-size: 1.5rem;
}
.fa-home
{
    width: 50px;
    height: 50px;
    position: relative;
    border-radius: 100%;
    background: gray;
    cursor: pointer; 
    text-align: center;
     color: white;   
    display: flex;
    justify-content: center; 
    margin: auto;
    align-items: center;
    }
</style>