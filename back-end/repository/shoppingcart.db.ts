import { Item } from '../model/item';
import { Shoppingcart } from '../model/shoppingcart';
import db from './db';

const getAll = async (): Promise<Shoppingcart[]> => {
    try {
        const shoppingcartPrisma = await db.shoppingcart.findMany({
            orderBy: {
                id: 'asc',
            },
            include: {
                items: true,
                user: true,
            },
        });
        const shoppingcartsWithItems = await Promise.all(
            shoppingcartPrisma.map(async (cart) => {
                const withItems = await db.shoppingcart.findUnique({
                    where: {
                        id: cart.id,
                    },
                    include: {
                        items: {
                            include: {
                                item: true,
                            },
                        },
                        user: true,
                    },
                });
                return withItems;
            })
        );

        return shoppingcartsWithItems
            .map((cart) => (cart ? Shoppingcart.from(cart) : null))
            .filter((cart): cart is Shoppingcart => cart !== null);
    } catch (error) {
        console.log(error);
        throw new Error('Could not get all shoppingcarts');
    }
};

const getById = async (id: number): Promise<Shoppingcart | undefined> => {
    try {
        const shoppingcartPrisma = await db.shoppingcart.findUnique({
            where: {
                id: id,
            },
            include: {
                items: {
                    include: {
                        item: true,
                    },
                    orderBy: {
                        itemId: 'asc',
                    },
                },
                user: true,
            },
        });

        return shoppingcartPrisma ? Shoppingcart.from(shoppingcartPrisma) : undefined;
    } catch (error) {
        console.log(error);
        throw new Error('Could not get shoppingcart by id');
    }
};

const create = async (shoppingcart: Shoppingcart): Promise<Shoppingcart> => {
    try {
        const shoppingcartPrisma = await db.shoppingcart.create({
            data: {
                name: shoppingcart.getName(),
                deliveryDate: new Date(shoppingcart.getDeliveryDate()),
                user: {
                    connect: {
                        id: shoppingcart.getUser()?.getId(),
                    },
                },
            },

            include: {
                items: true,
                user: true,
            },
        });

        const shoppingcartWithItems = await db.shoppingcart.findUnique({
            where: {
                id: shoppingcartPrisma.id,
            },
            include: {
                items: {
                    include: {
                        item: true,
                    },
                },
                user: true,
            },
        });

        if (!shoppingcartWithItems) {
            throw new Error('Could not fetch created shopping cart');
        }

        return Shoppingcart.from(shoppingcartWithItems);
    } catch (error) {
        console.log(error);
        throw new Error('Could not create shoppingcart');
    }
};

const addItemToShoppingcart = async ({
    item,
    shoppingcart,
}: {
    item: Item;
    shoppingcart: Shoppingcart;
}) => {
    try {
        // Check if the item already exists in the cart
        const existingItem = await db.shoppingcartItems.findUnique({
            where: {
                shoppingcartId_itemId: {
                    shoppingcartId: shoppingcart.getId()!,
                    itemId: item.getId()!,
                },
            },
        });

        if (existingItem) {
            // If item exists, increment its quantity
            const shoppingcartPrisma = await db.shoppingcart.update({
                where: {
                    id: shoppingcart.getId(),
                },
                data: {
                    items: {
                        update: {
                            where: {
                                shoppingcartId_itemId: {
                                    shoppingcartId: shoppingcart.getId()!,
                                    itemId: item.getId()!,
                                },
                            },
                            data: {
                                quantity: existingItem.quantity + 1,
                            },
                        },
                    },
                },
                include: {
                    items: {
                        include: {
                            item: true,
                        },
                    },
                    user: true,
                },
            });

            return shoppingcartPrisma ? Shoppingcart.from(shoppingcartPrisma) : undefined;
        } else {
            // If item doesn't exist, create new relationship with quantity 1
            await db.shoppingcart.update({
                where: {
                    id: shoppingcart.getId(),
                },
                data: {
                    items: {
                        create: {
                            itemId: item.getId()!,
                            quantity: 1,
                        },
                    },
                },
                include: {
                    items: {
                        include: {
                            item: true,
                        },
                    },
                    user: true,
                },
            });

            const shoppingcartPrisma = await db.shoppingcart.findUnique({
                where: { id: shoppingcart.getId()! },
                include: {
                    items: {
                        include: {
                            item: true,
                        },
                    },
                    user: true,
                },
            });
            return shoppingcartPrisma ? Shoppingcart.from(shoppingcartPrisma) : undefined;
        }
    } catch (error) {
        console.log(error);
        throw new Error('Could not add item to shoppingcart');
    }
};

const deleteItemFromShoppingcart = async ({
    item,
    shoppingcart,
}: {
    item: Item;
    shoppingcart: Shoppingcart;
}) => {
    try {
        const shoppingcartPrisma = await db.shoppingcart.update({
            where: {
                id: shoppingcart.getId()!,
            },
            data: {
                items: {
                    delete: {
                        shoppingcartId_itemId: {
                            shoppingcartId: shoppingcart.getId()!,
                            itemId: item.getId()!,
                        },
                    },
                },
            },
            include: {
                items: {
                    include: {
                        item: true,
                    },
                },
                user: true,
            },
        });

        return shoppingcartPrisma ? Shoppingcart.from(shoppingcartPrisma) : undefined;
    } catch (error) {
        console.log(error);
        throw new Error('Could not remove item from shoppingcart');
    }
};

const removeAnItemFromShoppingcart = async ({
    item,
    shoppingcart,
}: {
    item: Item;
    shoppingcart: Shoppingcart;
}) => {
    try {
        const itemId = item.getId();
        const shoppingcartId = shoppingcart.getId();

        // Fetch the current quantity of the item in the shopping cart
        const currentItem = await db.shoppingcartItems.findUnique({
            where: {
                shoppingcartId_itemId: {
                    shoppingcartId: shoppingcartId!,
                    itemId: itemId!,
                },
            },
            select: {
                quantity: true,
            },
        });

        if (!currentItem) {
            throw new Error('Item not found in shoppingcart');
        }

        const shoppingcartPrisma = await db.shoppingcart.update({
            where: {
                id: shoppingcartId!,
            },
            data: {
                items: {
                    ...(currentItem.quantity === 1
                        ? {
                              delete: {
                                  shoppingcartId_itemId: {
                                      shoppingcartId: shoppingcartId!,
                                      itemId: itemId!,
                                  },
                              },
                          }
                        : {
                              update: {
                                  where: {
                                      shoppingcartId_itemId: {
                                          shoppingcartId: shoppingcartId!,
                                          itemId: itemId!,
                                      },
                                  },
                                  data: {
                                      quantity: {
                                          decrement: 1,
                                      },
                                  },
                              },
                          }),
                },
            },
            include: {
                items: {
                    include: {
                        item: true,
                    },
                },
                user: true,
            },
        });

        return shoppingcartPrisma ? Shoppingcart.from(shoppingcartPrisma) : undefined;
    } catch (error) {
        console.log(error);
        throw new Error('Could not remove item from shoppingcart');
    }
};

const updateItemQuantityInShoppingcart = async ({
    item,
    shoppingcart,
    quantity,
}: {
    item: Item;
    shoppingcart: Shoppingcart;
    quantity: number;
}) => {
    try {
        if (quantity <= 0) {
            const shoppingcartPrisma = await db.shoppingcart.update({
                where: { id: shoppingcart.getId()! },
                data: {
                    items: {
                        delete: {
                            shoppingcartId_itemId: {
                                shoppingcartId: shoppingcart.getId()!,
                                itemId: item.getId()!,
                            },
                        },
                    },
                },
                include: {
                    items: {
                        include: { item: true },
                        orderBy: { itemId: 'asc' },
                    },
                    user: true,
                },
            });

            return shoppingcartPrisma ? Shoppingcart.from(shoppingcartPrisma) : undefined;
        } else {
            const shoppingcartPrisma = await db.shoppingcart.update({
                where: {
                    id: shoppingcart.getId()!,
                },
                data: {
                    items: {
                        update: {
                            where: {
                                shoppingcartId_itemId: {
                                    shoppingcartId: shoppingcart.getId()!,
                                    itemId: item.getId()!,
                                },
                            },
                            data: {
                                quantity: quantity,
                            },
                        },
                    },
                },
                include: {
                    items: {
                        include: {
                            item: true,
                        },
                        orderBy: {
                            itemId: 'asc',
                        },
                    },
                    user: true,
                },
            });
            return shoppingcartPrisma ? Shoppingcart.from(shoppingcartPrisma) : undefined;
        }
    } catch (error) {
        console.log(error);
        throw new Error('Could not update item in shoppingcart');
    }
};

const deleteShoppingcart = async ({ shoppingcart }: { shoppingcart: Shoppingcart }) => {
    try {
        await db.shoppingcartItems.deleteMany({
            where: {
                shoppingcartId: shoppingcart.getId(),
            },
        });

        const shoppingcartPrisma = await db.shoppingcart.delete({
            where: {
                id: shoppingcart.getId(),
            },
            include: {
                items: {
                    include: {
                        item: true,
                    },
                },
                user: true,
            },
        });

        return shoppingcartPrisma ? Shoppingcart.from(shoppingcartPrisma) : undefined;
    } catch (error) {
        console.log(error);
        throw new Error('Could not delete shoppingcart');
    }
};

export default {
    getAll,
    getById,
    addItemToShoppingcart,
    create,
    deleteItemFromShoppingcart,
    removeAnItemFromShoppingcart,
    updateItemQuantityInShoppingcart,
    deleteShoppingcart,
};
