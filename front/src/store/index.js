//import Vue from 'vue'
import { createStore } from 'vuex'
//import Vuex from 'vuex'

import axios from 'axios'

//Vue.use(Vuex)

//export default new Vuex.Store({
  export default createStore({ 
  state: {
    currentUser: {
      id: '',
      nom: '',
      prenom: '',
      email: '',
      image: '',
    role : ''
    },
  },
  methods : {
    async getUser(state){
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      //const res = await axios.get
       await axios.get(`http://localhost:3000/api/auth/profile/${userId}`, {
        headers: {
          'authorization': `Bearer ${token}`
        }
      })
  
       .then(res => {
        state.currentUser.id = res.data.id;
        state.currentUser.nom = res.data.nom;
        state.currentUser.prenom = res.data.prenom;
        state.currentUser.email = res.data.email;
        state.currentUser.image = res.data.image;

      }).catch(err => console.log(err))
    }, 
  
  actions: {   
  } 
  },
  modules: {
  }
})
