import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Signup from '../views/Signup.vue'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'
import Allposts from '../views/Allposts.vue'
import AdminDisplay from '../views/AdminDisplay.vue'
import AdminComments from '../views/AdminComments.vue'
import AdminPosts from '../views/AdminPosts.vue'
import AdminUsers from '../views/AdminUsers.vue'
import Post from '../views/Post.vue'
import CreatePost from '../views/CreatePost.vue'
import CommentPost from '../views/CommentPost.vue'
import ModifyPost from '../views/ModifyPost.vue'
import ModifyComment from '../views/ModifyComment.vue'


Vue.use(VueRouter)

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
    path: '/post',
    name: 'Post',
    component: Post
  },
  {
    path: '/admin',
    name: 'AdminDisplay',
    component: AdminDisplay
  },
  {
  path: '/admin/users',
  name: 'AdminUsers',
  component: AdminUsers
},
{
  path: '/admin/posts',
  name: 'AdminPosts',
  component: AdminPosts
},
{
  path: '/admin/comments',
  name: 'AdminComments',
  component: AdminComments
},
 {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/post/new',
    name: 'CreatePost',
    component: CreatePost
  },
  {
    path: '/post/comment',
    name: 'CommentPost',
    component: CommentPost
  },
  {
    path: '/post/modify',
    name: 'ModifyPost',
    component: ModifyPost
  }, 
  {
    path: '/comment/modify',
    name: 'ModifyComment',
    component: ModifyComment
  },


]

const router = new VueRouter({
  routes
})

export default router
