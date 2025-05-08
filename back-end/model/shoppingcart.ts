import { Item } from './item';
import { User } from './user';

import {
    User as UserPrisma,
    Shoppingcart as ShoppingcartPrisma,
    Item as ItemPrisma,
} from '@prisma/client';

interface CartItem {
    item: Item;
    quantity: number;
}

export class Shoppingcart {
    readonly id?: number | undefined;
    readonly name: string;
    readonly deliveryDate: Date;
    private user?: User;
    private items: CartItem[] = [];

    constructor(shoppingcart: {
        id?: number;
        name: string;
        deliveryDate: Date;
        items: CartItem[];
    }) {
        this.validate(shoppingcart);
        this.id = shoppingcart.id;
        this.name = shoppingcart.name;
        this.deliveryDate = shoppingcart.deliveryDate;
        this.items = shoppingcart.items;
    }

    validate(shoppingcart: { name: string; deliveryDate: Date }) {
        if (!shoppingcart.name?.trim()) {
            throw new Error('Name is required');
        }

        const deliveryDate = new Date(shoppingcart.deliveryDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!deliveryDate || isNaN(deliveryDate.getTime())) {
            throw new Error('Delivery date is required');
        }

        if (deliveryDate < today) {
            throw new Error('Delivery date should be after today');
        }
    }
    addItem(item: Item) {
        const existingCartItem = this.items.find((cartItem) => cartItem.item.equals(item));
        if (existingCartItem) {
            existingCartItem.quantity++;
        } else {
            this.items.push({
                item,
                quantity: 1,
            });
        }
    }

    removeItem(item: Item) {
        const existingCartItem = this.items.find((cartItem) => cartItem.item.equals(item));

        if (existingCartItem) {
            if (existingCartItem.quantity > 1) {
                existingCartItem.quantity--;
            } else {
                this.items = this.items.filter((cartItem) => !cartItem.item.equals(item));
            }
        } else {
            throw new Error('This item does not exist in this shopping cart');
        }
    }

    getId(): number | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getDeliveryDate(): Date {
        return this.deliveryDate;
    }

    getUser(): User | undefined {
        return this.user;
    }

    getItems(): CartItem[] {
        return this.items;
    }

    setUser(user: User) {
        this.user = user;
    }

    equals(shoppingcart: Shoppingcart): boolean {
        return (
            this.id === shoppingcart.getId() &&
            this.name === shoppingcart.getName() &&
            this.deliveryDate === shoppingcart.getDeliveryDate() &&
            this.user === shoppingcart.getUser()
        );
    }

    static from({
        id,
        name,
        deliveryDate,
        items,
    }: ShoppingcartPrisma & {
        items: { item: ItemPrisma; quantity: number }[];
        user: UserPrisma;
    }): Shoppingcart {
        return new Shoppingcart({
            id,
            name,
            deliveryDate,
            items: items.map(({ item, quantity }) => ({
                item: Item.from(item),
                quantity,
            })),
        });
    }
}
