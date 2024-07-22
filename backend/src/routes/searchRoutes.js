import express from 'express';
const router = express.Router();
import * as searchController from '../controllers/searchController.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';


router.use(express.json());

router.get('/', searchController.searchProducts);
router.get('/category', searchController.searchProductsByCategory);
router.get('/category/sort', searchController.searchProductsByCategoryAndSort);
router.get('/category/sort/price', searchController.searchProductsByCategoryAndSortPrice);
router.get('/category/sort/price/asc', searchController.searchProductsByCategoryAndSortPriceAsc);
router.get('/category/sort/price/desc', searchController.searchProductsByCategoryAndSortPriceDesc);
router.get('/category/sort/price/asc/:id', searchController.searchProductsByCategoryAndSortPriceAscId);
router.get('/category/sort/price/desc/:id', searchController.searchProductsByCategoryAndSortPriceDescId);
router.get('/category/sort/price/asc/:id/:q', searchController.searchProductsByCategoryAndSortPriceAscIdQ);
router.get('/category/sort/price/desc/:id/:q', searchController.searchProductsByCategoryAndSortPriceDescIdQ);
router.get('/category/sort/price/asc/:id/:q/:category', searchController.searchProductsByCategoryAndSortPriceAscIdQCategory);
router.get('/category/sort/price/desc/:id/:q/:category', searchController.searchProductsByCategoryAndSortPriceDescIdQCategory);
router.get('/category/sort/price/asc/:id/:q/:category/:sort', searchController.searchProductsByCategoryAndSortPriceAscIdQCategorySort);
router.get('/category/sort/price/desc/:id/:q/:category/:sort', searchController.searchProductsByCategoryAndSortPriceDescIdQCategorySort);
router.get('/category/sort/price/asc/:id/:q/:category/:sort/:minPrice', searchController.searchProductsByCategoryAndSortPriceAscIdQCategorySortMinPrice);
router.get('/category/sort/price/desc/:id/:q/:category/:sort/:minPrice', searchController.searchProductsByCategoryAndSortPriceDescIdQCategorySortMinPrice);
router.get('/category/sort/price/asc/:id/:q/:category/:sort/:minPrice/:maxPrice', searchController.searchProductsByCategoryAndSortPriceAscIdQCategorySortMinPriceMaxPrice);
router.get('/category/sort/price/desc/:id/:q/:category/:sort/:minPrice/:maxPrice', searchController.searchProductsByCategoryAndSortPriceDescIdQCategorySortMinPriceMaxPrice);

export default router;