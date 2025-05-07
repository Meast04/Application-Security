/**
 * @swagger
 * tags:
 *   - name: users
 *     description: Operations related to user management and authentication
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Role:
 *       type: string
 *       enum: [user, admin]
 *       description: The user's role in the system - can be either a regular user or administrator
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *           description: Unique identifier for the user
 *         email:
 *           type: string
 *           description: User's email address used for authentication and communication
 *           example: john.doe@mail.com
 *         password:
 *           type: string
 *           description: User's hashed password for authentication
 *           format: password
 *         role:
 *           $ref: '#/components/schemas/Role'
 *           description: The user's role defining their permissions and access levels
 *       required:
 *         - email
 *         - password
 *         - role
 */

import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';
import { Role, UserInput } from '../types';

const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of all users
 *     description: Retrieves a list of all users in the system. Requires administrative privileges.
 *     tags:
 *       - users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */
interface AuthenticatedRequest extends Request {
    auth: {
        role: Role;
        email: string;
    };
}

userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { role } = (req as AuthenticatedRequest).auth;
        const users = await userService.getAllUsers(role);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

/**
 * @swagger
 * /users/email/{email}:
 *   get:
 *     summary: Get user by email
 *     description: Retrieves a user by their email address. Requires administrative privileges.
 *     tags:
 *       - users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: The email address of the user to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Not Found - User does not exist
 *       500:
 *         description: Internal server error
 */
userRouter.get('/email/:email', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.params.email;
        const user = await userService.getByEmail(email);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/id/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieves a user by their unique identifier. Requires administrative privileges.
 *     tags:
 *       - users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the user to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Not Found - User does not exist
 *       500:
 *         description: Internal server error
 */
userRouter.get('/id/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const user = await userService.getById(id);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 example: john.doe@mail.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 format: password
 *               role:
 *                 $ref: '#/components/schemas/Role'
 *     responses:
 *       200:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - Invalid user data
 *       409:
 *         description: Conflict - User already exists
 *       500:
 *         description: Internal server error
 */
userRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUser = req.body as UserInput;
        const user = await userService.createUser(newUser);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Authenticate a user
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 example: john.doe@mail.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 format: password
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid credentials
 *       500:
 *         description: Internal server error
 */
userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const authResponse = await userService.authenticate({ email, password });
        res.status(200).json(authResponse);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     summary: Update a user
 *     description: Updates a user's information. Requires administrative privileges.
 *     tags:
 *       - users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - Invalid user data
 *       404:
 *         description: Not Found - User does not exist
 *       500:
 *         description: Internal server error
 */
userRouter.put('/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.userId);
        const user = req.body as UserInput;
        const updatedUser = await userService.updateUser(userId, user);
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
});



userRouter.put('/changePassword/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email} = (req as AuthenticatedRequest).auth;
        if (!email) {
            return res.status(403).json({ message: 'Email is required' });
        }
        const { oldPassword, newPassword } = req.body;
        const updatedUser = await userService.changePassword(email, oldPassword, newPassword);
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user from the system. Requires administrative privileges.
 *     tags:
 *       - users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User successfully deleted
 *       404:
 *         description: Not Found - User does not exist
 *       500:
 *         description: Internal server error
 */
userRouter.delete('/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.userId);
        await userService.deleteUser(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
});

export { userRouter };
