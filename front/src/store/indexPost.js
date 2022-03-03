import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: {
      id: '',
      title: '',
      content: '',
      like: '',
      dislike: '',
   
    },
  },
  mutations: {
    async getOnePost(state){
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const id_param = this.post.id;
      await axios.get(`http://localhost:3000/api/posts/${id_param}`, {
        headers: {
          'authorization': `Bearer ${token}`
        }
      })
  
       .then(res => {
        //console.log("indexPost  " +res.data);

        state.currentPost.id = res.data.id;
        state.currentPost.title = res.data.title;
        state.currentPost.content = res.data.content;
        state.currentPost.like = res.data.like;
        state.currentPost.dislike = res.data.dislike;
    
        
      //  console.log("index state currentPost  "+state.currentPost);
      }).catch(err => console.log(err))
    }, 
  },
  actions: {   
    
  },
  modules: {
  }
})
