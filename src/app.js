import express from 'express'
import __dirname from './__dirname.js'
import indexRouter from './routes/index.js'
import { Server } from 'socket.io'
import { normalize, schema } from 'normalizr'

// Schema definition for chat normalization:
const author = new schema.Entity('authors', {}, {idAttribute: "email"})
const message = new schema.Entity('messages', {
  author: author
}, {idAttribute: "_id"})
const chat = new schema.Entity('chats', {
  chats: [message]
})

//Mongoose implementation for chats persistance:
import mongoose from 'mongoose'
import chatsService from './models/Chats.js'
const connection = mongoose.connect('mongodb+srv://coderuser:34838536@cluster0.t6ufdcy.mongodb.net/desafioClase22?retryWrites=true&w=majority', error => {
  if (error) {
    console.log(error)
  } else {
    console.log('Atlas DB connected')
  }
})

// import ChatManager from './managers/chatManager.js'
// import ProductManager from './managers/productManager.js'
// const productsService = new ProductManager()
// productsService.deleteAll()
// const chatsService = new ChatManager()
// chatsService.deleteAll()

const app = express()
const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT)
})
const io = new Server(server)

app.set('socketio', io)


io.on('connection', async (socket) => {
  console.log('a user connected')
  socket.emit('fetchProducts')
  socket.emit('log', normalize({ id: 1, chats: await chatsService.find({}) }, chat)) // Reemplazamos con el metodo de mongoose y normalizamos los chats
  socket.broadcast.emit('newUser', socket.id)
  socket.on('message', async (data) => {
    await chatsService.create(data) // Reemplazamos con el metodo de mongoose
    io.emit('log', normalize({ id: 1, chats: await chatsService.find({}) }, chat)) // Reemplazamos con el metodo de mongoose y normalizamos los chats
  })
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use('/', indexRouter);
