
<template>
  <footer>
    
      <div class="contact">
        <i class="far fa-envelope"></i>
        <a href="contact: administrateur@groupomania.com" aria-label="Envoyer mail à l'administrateur" > Aide et contact</a>
      </div>  
    
    <div class="copyright">
      <p>2022 ©Groupomania ©Groupoman by ZuzanaTC </p>
    </div>
  </footer>
</template>

<style scoped>
ul {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0;
    list-style: none;
    
}


a {
  font-size: 1.2rem;
  color: #000000;
  text-decoration: none;
}

a:hover {
  color: #fd2d01;
}

img {
    height: 150px;
}

.copyright{
  font-size: 1rem;
}
.contact{
  padding-top: 50px;
  padding-bottom: 50px;
}

@media screen and (max-width:768px) {
  a {
    font-size: 0.7rem;
  }

  ul {
    margin: 0
  }
  
  li {
    width: 150px;
  }

  img {
    height: 15vw;
  }

  .copyright{
  font-size: 0.8rem;
  }
}

</style>

