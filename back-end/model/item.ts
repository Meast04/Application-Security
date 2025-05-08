import { Category } from '../types';

import { Item as ItemPrisma, Nutritionlabel as NutritionlabelPrisma } from '@prisma/client';
import { Nutritionlabel } from './nutritionlabel';

export class Item {
    private id?: number;
    readonly name: string;
    readonly price: number;
    readonly pathToImage: string;
    readonly category: Category;
    readonly nutritionlabel?: Nutritionlabel | null;

    constructor(item: {
        id?: number;
        name: string;
        price: number;
        pathToImage: string;
        category: Category;
        nutritionlabel?: Nutritionlabel;
    }) {
        this.validate(item);
        this.id = item.id;
        this.name = item.name;
        this.price = item.price;
        this.pathToImage = item.pathToImage;
        this.category = item.category;
        this.nutritionlabel = item.nutritionlabel;
    }

    validate(item: { name: string; price: number; pathToImage: string; category: Category }) {
        if (!item.name) {
            throw new Error('Name is required');
        }

        if (!item.price) {
            throw new Error('Price is required');
        }

        if (item.price < 0) {
            throw new Error('Price should be a positive number');
        }

        if (!item.pathToImage) {
            throw new Error('Path to image is required');
        }

        if (!item.category) {
            throw new Error('Category is required');
        }
    }

    setId(id: number) {
        this.id = id;
    }

    getId(): number | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getPrice(): number {
        return this.price;
    }

    getPathToImage(): string {
        return this.pathToImage;
    }

    getCategory(): Category {
        return this.category;
    }

    getNutritionlabel(): Nutritionlabel | undefined | null {
        return this.nutritionlabel;
    }

    equals(item: Item): boolean {
        return (
            this.id === item.getId() &&
            this.name === item.getName() &&
            this.pathToImage === item.getPathToImage() &&
            this.category === item.getCategory()
        );
    }

    static from({
        id,
        name,
        price,
        pathToImage,
        category,
        nutritionlabel,
    }: ItemPrisma & { nutritionlabel?: NutritionlabelPrisma }): Item {
        return new Item({
            id,
            name,
            price,
            pathToImage,
            category,
            nutritionlabel: nutritionlabel ? Nutritionlabel.from(nutritionlabel) : undefined,
        });
    }
}
