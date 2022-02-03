<template>
    <div class="nav">
        <h1 v-if="role === 0">Administrateur</h1>
        <h1 v-else>Administration des comptes</h1>
    </div>
</template>

<script>

export default {
name: 'AdminHeader',
data () {
	return {
		role:''
	}
},
methods: {
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
h1{
    width: 70%;
    margin-top: 10px;
    margin-bottom: 30px;
    padding: 10px ;
    text-decoration: none;
    color: rgb(5, 5, 100);
    font-size: 45px;
    font-weight: bolder;
  
}

img {
    height: 5vw;
    width: 80%;
  display: block;
 padding-top: 10px;
 margin: auto;
}

.link {
    padding: 0 5vw;
    font-size: 20px;
    text-decoration: none;
    cursor: pointer;
}

.link:hover {
    color: rgb(5, 5, 100);

}
.nav {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;
    font-size: 1rem;
}

.nav a {
    font-weight: bold;
    color: #000000;
}

.nav a.router-link-exact-active {
    color: rgb(5, 5, 100);
}

</style>