import knex from 'knex'
import config from '../../knexfile.js'
const db = knex(config.development)

export default class ChatManager {
  getAll = async() => { // Reads all the chats from the database and returns them as an array of objects.
    try {
      return await db('chats').select('*')
    }
    catch (err) {
      console.log(err)
    }
  }
  save = async(arrayOfChats) => { // Saves with automatic id assignment, and returns nothing.
    try {
      await db('chats').insert(arrayOfChats)
    }
    catch (err) {
      console.log(err)
    }
  }
  deleteAll = async() => { // Deletes all the chats and returns nothing.
    try {
      await db('chats').del()
    } catch (err) {
      console.log(err)
    }
  }
}
