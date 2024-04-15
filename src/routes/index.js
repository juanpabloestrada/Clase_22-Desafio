import { Router } from 'express'
import ProductManager from '../managers/productManager.js'
import { uploader } from '../utils/uploader.js'
import faker from 'faker'

const router = Router()
const productService = new ProductManager()
const { commerce, image } = faker

router
  .route('/api')
    .get(
      async (req, res) => {
        let products = await productService.getAll()
        res.send({ products })
      }
    )
    .post(
      uploader.single('file'),
      async (req, res) => {
        let newProduct = req.body
        newProduct.thumbnail = req.file.filename
        if (!req.file) return res.status(500).json({ status: 'error', error: 'Could not upload file' })
        if (!newProduct.title || !newProduct.price) return res.status(400).send({ status: 'error', error: 'Product name and price are required' })
        const savedProductId = await productService.save(newProduct)
        const savedProduct = await productService.getById(savedProductId)
        const io = req.app.get('socketio')
        io.emit('fetchProducts')
        io.emit('newProduct')
        res.send({ status: 'success', message: `Product added with id: ${savedProductId}`, product: savedProduct })
      }
    )
router
  .route('/api/products-test')
      .get(
        (req, res) => {
          let testProducts = []
          for (let i = 0; i < 5; i++) {
            testProducts.push({
              title: commerce.productName(),
              price: commerce.price(),
              image: image.image()
            })
          }
          res.send(testProducts)
        }
      )

export default router