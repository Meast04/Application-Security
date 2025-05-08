import shoppingcartDb from '../repository/shoppingcart.db';
import { Shoppingcart } from '../model/shoppingcart';
import itemDb from '../repository/item.db';
import { ShoppingcartInput } from '../types';
import userDb from '../repository/user.db';

const getAllShoppingcarts = async (): Promise<Shoppingcart[]> => {
    const shoppingcarts = await shoppingcartDb.getAll();
    if (!shoppingcarts) {
        throw new Error('No shoppingcarts found');
    }

    return shoppingcarts;
};

const addItemToShoppingcart = async ({
    itemId,
    shoppingcartId,
}: {
    itemId: number;
    shoppingcartId: number;
}): Promise<Shoppingcart> => {
    const item = await itemDb.getById(itemId);
    const shoppingcart = await shoppingcartDb.getById(shoppingcartId);

    if (!item || item === undefined || !shoppingcart || shoppingcart === undefined) {
        throw new Error('Item or shoppingcart not found');
    }

    const updatedShoppingcart = await shoppingcartDb.addItemToShoppingcart({ item, shoppingcart });
    if (!updatedShoppingcart) {
        throw new Error('Could not add item to shoppingcart');
    }
    return updatedShoppingcart;
};

const getShoppingcartById = async (id: number): Promise<Shoppingcart> => {
    const shoppingcart = await shoppingcartDb.getById(id);
    if (!shoppingcart) {
        throw new Error('Shoppingcart not found');
    }

    return shoppingcart;
};

const createShoppingcart = async (
    shoppingcart: ShoppingcartInput,
    email: string
): Promise<Shoppingcart> => {
    const newShoppingcart = new Shoppingcart(shoppingcart);

    const user = await userDb.getByEmail( email );

    if (!user) {
        throw new Error('User not found');
    }

    newShoppingcart.setUser(user);

    const createdShoppingcart = await shoppingcartDb.create(newShoppingcart);

    if (!createdShoppingcart) {
        throw new Error('Could not create shoppingcart');
    }

    return createdShoppingcart;
};

const removeItemFromShoppingcart = async (
    itemId: number,
    shoppingcartId: number
): Promise<Shoppingcart> => {
    const item = await itemDb.getById(itemId);
    const shoppingcart = await shoppingcartDb.getById(shoppingcartId);

    if (!item || item === undefined) {
        throw new Error('Item not found');
    }

    if (!shoppingcart || shoppingcart === undefined) {
        throw new Error('Shoppingcart not found');
    }

    const itemRemovedFromShoppingcart = await shoppingcartDb.deleteItemFromShoppingcart({
        item,
        shoppingcart,
    });

    if (!itemRemovedFromShoppingcart) {
        throw new Error('Could not remove item from shoppingcart');
    }

    return itemRemovedFromShoppingcart;
};

const removeAnItemFromShoppingcart = async (
    itemId: number,
    shoppingcartId: number
): Promise<Shoppingcart> => {
    const item = await itemDb.getById(itemId);
    const shoppingcart = await shoppingcartDb.getById(shoppingcartId);

    if (!item || item === undefined) {
        throw new Error('Item not found');
    }

    if (!shoppingcart || shoppingcart === undefined) {
        throw new Error('Shoppingcart not found');
    }

    const itemRemovedFromShoppingcart = await shoppingcartDb.removeAnItemFromShoppingcart({
        item,
        shoppingcart,
    });

    if (!itemRemovedFromShoppingcart) {
        throw new Error('Could not remove item from shoppingcart');
    }

    return itemRemovedFromShoppingcart;
};

const updateItemQuantityInShoppingcart = async (
    itemId: number,
    shoppingcartId: number,
    quantity: number
): Promise<Shoppingcart> => {
    const item = await itemDb.getById(itemId);
    const shoppingcart = await shoppingcartDb.getById(shoppingcartId);

    if (!item || item === undefined) {
        throw new Error('Item not found');
    }

    if (!shoppingcart || shoppingcart === undefined) {
        throw new Error('Shoppingcart not found');
    }

    const updatedShoppingcart = await shoppingcartDb.updateItemQuantityInShoppingcart({
        item,
        shoppingcart,
        quantity,
    });

    if (!updatedShoppingcart) {
        throw new Error('Could not update the quantity in this shoppingcart');
    }

    return updatedShoppingcart;
};

const deleteShoppingcart = async (id: number): Promise<Shoppingcart> => {
    const shoppingcart = await shoppingcartDb.getById(id);

    if (!shoppingcart) {
        throw new Error('Shoppingcart not found');
    }

    const deletedShoppingcart = await shoppingcartDb.deleteShoppingcart({ shoppingcart });

    if (!deletedShoppingcart) {
        throw new Error('Could not delete shoppingcart');
    }

    return deletedShoppingcart;
};

export default {
    getAllShoppingcarts,
    getShoppingcartById,
    addItemToShoppingcart,
    createShoppingcart,
    removeItemFromShoppingcart,
    removeAnItemFromShoppingcart,
    updateItemQuantityInShoppingcart,
    deleteShoppingcart,
};
