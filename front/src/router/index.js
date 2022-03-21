//rempl par createApp import Vue from 'vue'
//import { createApp } from 'vue'
//import VueRouter from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Signup from '../views/Signup.vue'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'
import Allposts from '../views/Allposts.vue'
import Post from '../views/Post.vue'
import NewPost from '../views/NewPost.vue'
import ModifyPost from '../views/ModifyPost.vue'

//Vue.use(VueRouter)  idem ligne45 main.js
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  
  {
    path: '/allposts',
    name: 'Allposts',
    component: Allposts
  },
  {
    path: '/post/:id',
    name: 'Post',
    component: Post
  },
  
 {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/postnew',
    name: 'NewPost',
    component: NewPost
  },
  
  {
    path: '/postmodify/:id',
    name: 'ModifyPost',
    component: ModifyPost
  }, 
  ]

/*const router = new VueRouter({
  routes
})
*/
const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router
