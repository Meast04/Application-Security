/**
 * @swagger
 * tags:
 *   - name: Shoppingcarts
 *     description: Operations for managing shopping carts
 *
 * components:
 *    schemas:
 *      ShoppingCart:
 *        type: object
 *        description: Represents a shopping cart for storing grocery items
 *        properties:
 *          id:
 *            type: integer
 *            format: int64
 *            description: Unique identifier for the shopping cart
 *            example: 1
 *          name:
 *            type: string
 *            description: Name of the shopping cart
 *            example: "Weekly Groceries"
 *            minLength: 1
 *            maxLength: 100
 *          deliveryDate:
 *            type: string
 *            format: date
 *            description: Requested delivery date for the shopping cart
 *            example: "2026-11-01"
 *          items:
 *            type: array
 *            description: List of items in the shopping cart
 *            items:
 *              $ref: '#/components/schemas/Item'
 *      ShoppingCartInput:
 *        type: object
 *        description: Input schema for creating a new shopping cart
 *        required:
 *          - name
 *          - deliveryDate
 *        properties:
 *          name:
 *            type: string
 *            description: Name of the shopping cart
 *            example: "Weekly Groceries"
 *            minLength: 1
 *            maxLength: 100
 *          deliveryDate:
 *            type: string
 *            format: date
 *            description: Requested delivery date for the shopping cart
 *            example: "2026-11-01"
 *            pattern: "^\\d{4}-\\d{2}-\\d{2}$"
 */

import express, { NextFunction, Request, Response } from 'express';
import shoppingcartService from '../service/shoppingcart.service';

const shoppingcartRouter = express.Router();

/**
 * @swagger
 * /shoppingcarts:
 *   get:
 *     summary: Get a list of all shopping carts
 *     description: Retrieve a list of all shopping carts with their items and delivery dates
 *     tags:
 *       - Shoppingcarts
 *     responses:
 *       200:
 *         description: List of shopping carts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ShoppingCart'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error occurred"
 */

shoppingcartRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shoppingcarts = shoppingcartService.getAllShoppingcarts();
        res.status(200).json(shoppingcarts);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

/**
 * @swagger
 * /shoppingcarts:
 *   post:
 *     summary: Create a new shopping cart
 *     description: Create a new shopping cart with a name and delivery date
 *     tags:
 *       - Shoppingcarts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShoppingCartInput'
 *     responses:
 *       201:
 *         description: Shopping cart created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingCart'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid shopping cart data"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error occurred"
 */

shoppingcartRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shoppingcart = shoppingcartService.createShoppingcart(req.body);
        res.status(201).json(shoppingcart);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

/**
 * @swagger
 * /shoppingcarts/addItem/{itemId}/{shoppingcartId}:
 *   post:
 *     summary: Add an item to a shopping cart
 *     description: Add a specific item to an existing shopping cart
 *     tags:
 *       - Shoppingcarts
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the item to add to the cart
 *         example: 1
 *       - in: path
 *         name: shoppingcartId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the shopping cart to add the item to
 *         example: 1
 *     responses:
 *       200:
 *         description: Item successfully added to shopping cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingCart'
 *       404:
 *         description: Shopping cart or item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Shopping cart or item not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error occurred"
 */

shoppingcartRouter.post(
    '/addItem/:itemId/:shoppingcartId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const itemId = parseInt(req.params.itemId, 10);
            const shoppingcartId = parseInt(req.params.shoppingcartId);
            const shoppingcart = shoppingcartService.addItemToShoppingcart({
                itemId,
                shoppingcartId,
            });
            res.status(200).json(shoppingcart);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
);

export { shoppingcartRouter };
