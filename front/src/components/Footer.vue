<!-- à faire @media -->
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
footer{
   width: 70%;
   margin: 20px auto;
  padding-top: 20px;
  padding-bottom: 30px;
}
ul {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0;
    list-style: none;
}
a, p {
  font-size: 12px;
  color: #000000;
  text-decoration: none;
}
a:hover {
  color:black;
}
img {
    height: 150px;
}
.copyright{
  font-size: 1rem;
}
.contact{
  margin-top: 0px;
  padding-top: 0px;
  padding-bottom: 00px;
}

/*------------ desktop----------------
@media screen and (min-width: 950px) {
.contact{
  padding-top: 20px;
  padding-bottom: 20px;
}
.copyright{
  padding-bottom: 0;
}
}
-*/
</style>

