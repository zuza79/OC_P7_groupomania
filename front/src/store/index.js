import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
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
  mutations: {
    async getUser(state){
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('userToken');
      const role = localStorage.getItem('role');
      await axios.get(`http://localhost:3000/api/users/profile/${userId}`, {
        headers: {
          'authorization': `Bearer ${token}`
        }
      }).then(res => {
        console.log(res.data);
        state.currentUser.id = res.data.id;
        state.currentUser.nom = res.data.nom;
        state.currentUser.prenom = res.data.prenom;
        state.currentUser.email = res.data.email;
        state.currentUser.image = res.data.image;
        state.currentUser.role = res.data.role;
        console.log(state.currentUser);
      }).catch(err => console.log(err))
    }, 
  },
  actions: {   
    
  },
  modules: {
  }
})
