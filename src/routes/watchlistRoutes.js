import express from 'express'
import { addToWatchlist, removeFromWatchlist } from '../controllers/watchlistController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)

router.post('/', addToWatchlist)
// router.put('/:id', updateItemFromWatchlist)
router.delete('/:id', removeFromWatchlist)

export default router