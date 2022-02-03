<template>
    <header class="nav">
        <img id="logo" src="../assets/images/logoMono.png" alt="Logo Groupomania" />
        <nav>
            <router-link to="/admin/users" v-if="role === 0" aria-label="Administration"><i class="fas fa-user-lock link"></i></router-link>
            <router-link to="/moderate/posts" v-else-if="role === 1" aria-label="Administration"><i class="fas fa-user-lock link"></i></router-link>
            <router-link class="link" to="/profile" aria-label="Profil">Mon profil</router-link>
            <router-link to="/allposts" aria-label="Retour ver Le Flash Actu Groupomania"><i class="fas fa-home home"></i></router-link>
            <a class="link disconnect" @click="disconnectUser()">Déconexion</a>
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

img {
  height: 100px;
}
#logo{
  width: 60%;
  display: block;
 padding-top: 10px;
 margin: auto;
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
@media screen and (max-width:1024px) {
  header {
    flex-direction: column;
  }

  img {
    margin-bottom: 30px;
  }

  .link {
    padding: 0 30px;
    font-size: 20px;
  }
}

@media screen and (max-width:768px) {

  header {
    flex-direction: column;
  }

  img {
    margin-bottom: 4vw;
    height: 60px;
  }

  .link {
    padding: 0 20px;
    font-size: 15px;
  }
}

</style>