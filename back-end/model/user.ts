import { Role } from '../types';
import { Shoppingcart } from './shoppingcart';

import {
    User as UserPrisma,
    Shoppingcart as ShoppingcartPrisma,
    Item as ItemPrisma,
} from '@prisma/client';

export class User {
    readonly id?: number | undefined;
    readonly email: string;
    readonly password: string;
    readonly role: Role;
    readonly shoppingcarts: Shoppingcart[];

    constructor(user: {
        id?: number;
        email: string;
        password: string;
        role: Role;
        shoppingcarts: Shoppingcart[];
    }) {
        this.validate(user);
        this.id = user.id;
        this.email = user.email;
        this.password = user.password;
        this.role = user.role;
        this.shoppingcarts = user.shoppingcarts;
    }

    getId(): number | undefined {
        return this.id;
    }

    getEmail(): string {
        return this.email;
    }

    getPassword(): string {
        return this.password;
    }

    getRole(): Role {
        return this.role;
    }

    getShoppingcarts(): Shoppingcart[] {
        return this.shoppingcarts;
    }

    addShoppingcart(shoppingcart: Shoppingcart) {
        if (this.shoppingcarts.includes(shoppingcart)) {
            throw new Error('This shopping cart is already added to this user');
        }
        this.shoppingcarts.push(shoppingcart);
        shoppingcart.setUser(this);
    }

    validate(user: { email: string; password: string; role: Role }) {
        if (!user.email?.trim()) {
            throw new Error('Email is required');
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
            throw new Error('Email is not valid');
        }

        if (!user.password?.trim()) {
            throw new Error('Password is required');
        }
    }

    equals(user: User): boolean {
        return (
            this.id === user.getId() &&
            this.email === user.getEmail() &&
            this.password === user.getPassword() &&
            this.role === user.getRole() &&
            this.shoppingcarts === user.getShoppingcarts()
        );
    }

    static from({
        id,
        email,
        password,
        role,
        shoppingcarts,
    }: UserPrisma & {
        shoppingcarts: (ShoppingcartPrisma & {
            items?: { item: ItemPrisma; quantity: number }[];
        })[];
    }): User {
        return new User({
            id,
            email,
            password,
            role,
            shoppingcarts: shoppingcarts.map((shoppingcart) =>
                Shoppingcart.from({
                    ...shoppingcart,
                    items:
                        shoppingcart.items?.map(({ item, quantity }) => ({
                            item: {
                                id: item.id,
                                name: item.name,
                                price: item.price,
                                pathToImage: item.pathToImage,
                                category: item.category,
                            },
                            quantity,
                        })) ?? [],
                    user: {
                        id,
                        email,
                        password,
                        role,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                })
            ),
        });
    }
}
