import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();

router.get('/', UserController.getUsers);
router.post('/', UserController.createUser);
router.get('/:userId', UserController.getUserByUserId);
router.put('/:userId', UserController.updateUserByUserId);
router.put('/:userId/orders', UserController.addNewProductInOrder);
router.get('/:userId/orders', UserController.getAllOrdersByUserId);
router.get('/:userId/orders/total-price', UserController.getTotalPriceOfAllOrdersByUserId);

export const UserRoutes = router;
