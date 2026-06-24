import { Router } from 'express';
import {
  listListings, createListing, getListing, updateListing,
  deleteListing, toggleFavorite, myFavorites,
} from '../controllers/listings.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);
router.get('/me/favorites', myFavorites);
router.get('/', listListings);
router.post('/', createListing);
router.get('/:id', getListing);
router.patch('/:id', updateListing);
router.delete('/:id', deleteListing);
router.post('/:id/favorite', toggleFavorite);
export default router;
