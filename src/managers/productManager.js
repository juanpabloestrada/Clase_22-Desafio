import knex from 'knex'
import config from '../../knexfile.js'
const db = knex(config.development)

class ProductManager {
  getAll = async() => { // Reads all the products from the database and returns them as an array of objects.
    try {
      return await db('products').select('*')
    }
    catch (err) {
      console.log(err)
    }
  }
  save = async(productToSave) => { // Saves with automatic id assignment, and returns the ids in an array.
    try {
      let savedProduct = await db('products').insert(productToSave)
      return savedProduct.id
    }
    catch (err) {
      console.log(err)
    }
  }
  getById = async(id) => {
    try {
      return await db('products').where('id', id).select('*')
    }
    catch (err) {
      console.log(err)
    }
  }
  deleteById = async(id) => { // Deletes the product with the given id and returns nothing.
    try {
      await db('products').where('id', id).del()
    }
    catch(err) {
      console.log(err)
    }
  }
  deleteAll = async() => { // Deletes all the products and returns nothing.
    try {
      await db('products').del()
    } catch (err) {
      console.log(err)
    }
  }
  update = async(product) => { // Updates the product with the given id and returns nothing.
    try {
      await db('products').where('id', product.id).update(product)
    }
    catch(err) {
      console.log(err)
    }
  }
}

export default ProductManager
