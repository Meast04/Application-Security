import { Nutritionlabel as NutritionlabelPrisma } from '@prisma/client';

export class Nutritionlabel {
    private id?: number | undefined;
    readonly energy: number;
    readonly fat: number;
    readonly saturatedFats: number;
    readonly carbohydrates: number;
    readonly sugar: number;
    readonly protein: number;
    readonly salts: number;

    constructor(nutritionlabel: {
        id?: number;
        energy: number;
        fat: number;
        saturatedFats: number;
        carbohydrates: number;
        sugar: number;
        protein: number;
        salts: number;
    }) {
        this.validate(nutritionlabel);
        this.id = nutritionlabel.id;
        this.energy = nutritionlabel.energy;
        this.fat = nutritionlabel.fat;
        this.saturatedFats = nutritionlabel.saturatedFats;
        this.carbohydrates = nutritionlabel.carbohydrates;
        this.sugar = nutritionlabel.sugar;
        this.protein = nutritionlabel.protein;
        this.salts = nutritionlabel.salts;
    }

    setId(id: number) {
        this.id = id;
    }

    getId(): number | undefined {
        return this.id;
    }

    getEnergy(): number {
        return this.energy;
    }

    getFat(): number {
        return this.fat;
    }

    getSaturatedFats(): number {
        return this.saturatedFats;
    }

    getCarbohydrates(): number {
        return this.carbohydrates;
    }

    getSugar(): number {
        return this.sugar;
    }

    getProtein(): number {
        return this.protein;
    }

    getSalts(): number {
        return this.salts;
    }

    validate(nutritionlabel: {
        energy: number;
        fat: number;
        saturatedFats: number;
        carbohydrates: number;
        sugar: number;
        protein: number;
        salts: number;
    }) {
        if (nutritionlabel.energy === null || isNaN(nutritionlabel.energy))
            throw new Error('Energy is required');
        if (nutritionlabel.fat == null || isNaN(nutritionlabel.fat))
            throw new Error('Fat is required');
        if (nutritionlabel.saturatedFats == null || isNaN(nutritionlabel.saturatedFats))
            throw new Error('Saturated fats are required');
        if (nutritionlabel.carbohydrates == null || isNaN(nutritionlabel.carbohydrates))
            throw new Error('Carbohydrates are required');
        if (nutritionlabel.sugar == null || isNaN(nutritionlabel.sugar))
            throw new Error('Sugar is required');
        if (nutritionlabel.protein == null || isNaN(nutritionlabel.protein))
            throw new Error('Protein is required');
        if (nutritionlabel.salts == null || isNaN(nutritionlabel.salts))
            throw new Error('Salts are required');

        if (nutritionlabel.energy < 0) throw new Error('Energy must be a positive value');
        if (nutritionlabel.fat < 0) throw new Error('Fat must be a positive value');
        if (nutritionlabel.saturatedFats < 0)
            throw new Error('Saturated fats must be a positive value');
        if (nutritionlabel.carbohydrates < 0)
            throw new Error('Carbohydrates must be a positive value');
        if (nutritionlabel.sugar < 0) throw new Error('Sugar must be a positive value');
        if (nutritionlabel.protein < 0) throw new Error('Protein must be a positive value');
        if (nutritionlabel.salts < 0) throw new Error('Salts must be a positive value');
    }

    equals(nutritionlabel: Nutritionlabel): boolean {
        return (
            this.energy === nutritionlabel.getEnergy() &&
            this.fat === nutritionlabel.getFat() &&
            this.saturatedFats === nutritionlabel.getSaturatedFats() &&
            this.carbohydrates === nutritionlabel.getCarbohydrates() &&
            this.sugar === nutritionlabel.getSugar() &&
            this.protein === nutritionlabel.getProtein() &&
            this.salts === nutritionlabel.getSalts()
        );
    }

    static from({
        id,
        energy,
        fat,
        saturatedFats,
        carbohydrates,
        sugar,
        protein,
        salts,
    }: NutritionlabelPrisma) {
        return new Nutritionlabel({
            id,
            energy,
            fat,
            saturatedFats,
            carbohydrates,
            sugar,
            protein,
            salts,
        });
    }
}
