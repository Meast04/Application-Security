import { User } from '../model/user';
import db from './db';

const getAll = async (): Promise<User[]> => {
    try {
        const userPrisma = await db.user.findMany({
            include: {
                shoppingcarts: {
                    include: {
                        items: {
                            include: {
                                item: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                id: 'asc',
            },
        });

        return userPrisma.map((userPrisma) => User.from(userPrisma));
    } catch (error) {
        console.log(error);
        throw new Error('Could not get all users');
    }
};

const getAlluserswithroleuser = async (): Promise<User[]> => {
    try {
        const userPrisma = await db.user.findMany({
            where: {
                role: 'user',
            },
            include: {
                shoppingcarts: {
                    include: {
                        items: {
                            include: {
                                item: true,
                            },
                        },
                    },
                },
            },
        });

        return userPrisma.map((userPrisma) => User.from(userPrisma));
    } catch (error) {
        console.log(error);
        throw new Error('Could not get all users with role user');
    }
};

const getByEmail = async (email: string): Promise<User | null> => {
    try {
        const userPrisma = await db.user.findUnique({
            where: {
                email,
            },
            include: {
                shoppingcarts: {
                    include: {
                        items: {
                            include: {
                                item: true,
                            },
                        },
                    },
                },
            },
        });

        if (!userPrisma) {
            return null;
        }

        return User.from(userPrisma);
    } catch (error) {
        console.log(error);
        throw new Error('Could not get user by email');
    }
};  

const createUser = async (user: User): Promise<User> => {
    try {
        const userPrisma = await db.user.create({
            data: {
                email: user.getEmail(),
                password: user.getPassword(),
            },

            include: {
                shoppingcarts: {
                    include: {
                        items: {
                            include: {
                                item: true,
                            },
                        },
                    },
                },
            },
        });

        return User.from(userPrisma);
    } catch (error) {
        console.log(error);
        throw new Error('Could not create user');
    }
};

const updateUser = async (userId: number, user: User): Promise<User> => {
    try {
        const userPrisma = await db.user.update({
            where: {
                id: userId,
            },
            data: {
                email: user.getEmail(),
                password: user.getPassword(),
                role: user.getRole(),
            },
            include: {
                shoppingcarts: {
                    include: {
                        items: {
                            include: {
                                item: true,
                            },
                        },
                    },
                },
            },
        });

        return User.from(userPrisma);
    } catch (error) {
        console.log(error);
        throw new Error('Could not update user');
    }
};

const changePassword = async (email:string, newPassword: string): Promise<User> => {
    try {
        const userPrisma = await db.user.update({
            where: {
                email: email,
            },
            data: {
                password: newPassword,
            },
            include: {
                shoppingcarts: {
                    include: {
                        items: {
                            include: {
                                item: true,
                            },
                        },
                    },
                },
            },
        });

        return User.from(userPrisma);
    } catch (error) {
        console.log(error);
        throw new Error('Could not change password');
    }
}

const deleteUser = async (userId: number): Promise<User> => {
    try {
        const shoppingCarts = await db.shoppingcart.findMany({
            where: {
                userId: userId,
            },
            include: {
                items: true,
            },
        });

        for (const cart of shoppingCarts) {
            await db.shoppingcartItems.deleteMany({
                where: {
                    shoppingcartId: cart.id,
                },
            });
        }

        await db.shoppingcart.deleteMany({
            where: {
                userId: userId,
            },
        });

        const userPrisma = await db.user.delete({
            where: {
                id: userId,
            },
            include: {
                shoppingcarts: {
                    include: {
                        items: {
                            include: {
                                item: true,
                            },
                        },
                    },
                },
            },
        });

        return User.from(userPrisma);
    } catch (error) {
        console.log(error);
        throw new Error('Could not delete user');
    }
};

const getById = async (id: number): Promise<User> => {
    try {
        const userPrisma = await db.user.findUnique({
            where: {
                id,
            },
            include: {
                shoppingcarts: {
                    include: {
                        items: {
                            include: {
                                item: true,
                            },
                        },
                    },
                },
            },
        });

        if (!userPrisma) {
            throw new Error('No user found');
        }

        return User.from(userPrisma);
    } catch (error) {
        console.log(error);
        throw new Error('Could not get user by id');
    }
};

export default {
    getAll,
    getByEmail,
    createUser,
    updateUser,
    deleteUser,
    getById,
    getAlluserswithroleuser,
    changePassword,
};
