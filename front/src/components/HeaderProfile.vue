<template>
    <header class="nav">
        <img id="logo" src="../assets/images/logoMono.png" alt="Logo Groupomania" />
        <nav>
            
            <router-link class="link" to="/profile" :href="$router.resolve({name: 'profile', params: { id: userId}}).href" aria-label="Profil">Mon profil</router-link>
            
          <!-- <router-link class="link"  :to="{name: 'profile', params: { id: userId }}"><img class="imgProfile" :src="user.image" alt="`Photo de profil`" aria-label="Profil">Mon profil </router-link>
           -->
            
            <router-link to="/allposts" aria-label="Retour ver Le Flash Actu Groupomania"><i class="fas fa-home home"></i></router-link>
            <router-link to="/login" class="link disconnect" @click="disconnectUser()"  >Déconexion</router-link>
        </nav>

    </header>
</template>


<script>

export default {
name: 'HeaderProfile',
props: ['userId'],              //'photo',
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