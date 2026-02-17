import express from 'express'
import {getRegisteredUsers, register}  from '../controller/register/register.js'   
import login from '../controller/login/login.js'
import { addTodo, getTodos , deleteTodo, updateTodo } from '../controller/addTodo/addTodo.js'
import { authMiddleWare } from '../middleWares/authMiddleware/authMiddleware.js'
import getMe from '../controller/getUserProfile/getUserProfile.js'
import upload from '../middleWares/imageMiddleware/imageMiddleware.js'
import updateProfileImage from '../controller/updateProfileImage/updateProfileImage.js'


const routes = express.Router()

routes.post('/register' , upload.single('profileImage') , register)
routes.get('getRegisteredUsers' , getRegisteredUsers)
routes.post('/login' , login)
routes.get('/me' , authMiddleWare , getMe)
routes.post('/task' , authMiddleWare , addTodo)
routes.get('/tasks' , authMiddleWare , getTodos)
routes.delete('/task/:id' , authMiddleWare , deleteTodo)
routes.put('/task/:id' , authMiddleWare , updateTodo)

routes.put('/updateProfileImage' , authMiddleWare , upload.single('profileImage') , updateProfileImage);


export default routes;