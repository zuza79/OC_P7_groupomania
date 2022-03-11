<template>
  <div class="like">
    <font-awesome-icon id="likeIcon" icon="thumbs-up" @click="createLike" />
    <p>{{ likes }}</p>
    <div class="message-erreur">{{ errorMessage }}</div>
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
  mounted() {
    const messageId = this.$route.params.id;
    axios
      .get(`http://localhost:3000/api/messages/${messageId}`)
      .then((response) => {
        this.likes = response.data.likes;
      })
      .catch((error) => {
        this.errorMessage = error.response.data.error;
      });
  },
  methods: {
    createLike() {
      const messageId = this.$route.params.id;
      const token = this.$store.state.user.token;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      axios
        .post(
          `http://localhost:3000/api/messages/${messageId}/vote/like`,
          {},
          { headers }
        )
        .then((response) => {
          if (response.data.message == "Message liked !") {
            this.likes++;
          } else if (
            response.data.message == "I no longer like this message !"
          ) {
            this.likes--;
          }
        })
        .catch((error) => {
          this.errorMessage = error.response.data.error;
          alert("unable to like message !");
        });
    },
  },
};
</script>
