<template>

<div class="like">
        <i class="fas fa-thumbs-up like btnSave" id="likeIcon" @click="createLike" aria-label="Bouton like">
         <p>{{ likes }}</p>
        </i>
        <!-- <div class="btnDelete">{{ errorMessage }}</div>
        -->
</div>

</template>

<script>
import axios from "axios";
export default {
  name: "Like",
  data() {
    return {
      likes: [],
      errorMessage: "",
    };
  },


  // LIKE POST
      mounted() {
          const token = localStorage.getItem("token")
          const postId = this.$route.params.id; 
 
    axios.get(`http://localhost:3000/api/posts/${postId}`,{
        headers: {
                        'authorization': `Bearer ${token}`,
                        "Content-Type": "application/json",
                        //'Content-Type': 'multipart/form-data',
                    }
       })             
      .then((res) => {
        this.likes = res.data.likes;
      })
      .catch((error) => {
        this.errorMessage = error.res.data.error;
      });
  },
 methods: {
    createLike() {
        const token = localStorage.getItem("token")
      const postId = this.$route.params.id;
      
      
      axios.post(`http://localhost:3000/api/posts/${postId}/vote/like`, {
          headers: {
                        'authorization': `Bearer ${token}`,
                        //'Content-Type': 'multipart/form-data',
                        "Content-Type": "application/json",
                    }
            })
        .then((res) => {
          if (res.data.post == "Post liked !") {
            this.likes++;
          } else if (
            res.data.post == "I no longer like this post !"
          ) {
            this.likes--;
          }
        })
        .catch(() =>{ 
                alert("Vous pouvez pas faire like!!")
                console.log('err like')
        //  this.errorMessage = error.res.data.error;
          
        });
    },
},
};
    </script>

<style scoped>
 
.likeNbr{
    margin: 0;
    padding: 0;
    outline: none;
}
p {
    padding-left: 0.5em;
  }
 #likeIcon:hover {
    cursor: pointer;
    
  }
.like{
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
 align-items: center;
}
</style>