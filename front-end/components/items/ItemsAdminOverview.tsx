import { Item } from '@types';
import { EllipsisVertical } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ItemsService from '@services/ItemsService';

const ItemAdminOverview: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [menuOpenId, setMenuOpenId] = useState<number | undefined>(undefined);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await ItemsService.getAllItems();
                const fetchedItems: Item[] = await response.json();
                setItems(fetchedItems);
            } catch (error) {
                console.error(error);
            }
        };

        fetchItems();
    }, []);

    const toggleMenu = (itemId: number | undefined) => {
        setMenuOpenId(menuOpenId === itemId ? undefined : itemId);
    };

    async function handleDeleteItem(id: number | undefined): Promise<void> {
        try {
            id && (await ItemsService.deleteItem(id));
            setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            {items && (
                <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-lg">
                    <table className="min-w-full bg-white text-left rounded-lg">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 text-center">
                                <th className="px-6 py-4 font-semibold text-sm">Name</th>
                                <th className="px-6 py-4 font-semibold text-sm">Price</th>
                                <th className="px-6 py-4 font-semibold text-sm">Category</th>
                                <th className="px-6 py-4 font-semibold text-sm w-36">Image</th>
                                <th className="px-6 py-4 font-semibold text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr
                                    key={item.id}
                                    className={`${
                                        item.id && item.id % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                    } hover:bg-gray-100 transition-colors duration-200 text-center`}
                                >
                                    <td className="px-6 py-4 border-t border-gray-200 text-sm text-gray-800">
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4 border-t border-gray-200 text-sm text-gray-800">
                                        {item.price.toFixed(2)}€
                                    </td>
                                    <td className="px-6 py-4 border-t border-gray-200 text-sm text-gray-800">
                                        {item.category}
                                    </td>
                                    <td className="px-6 py-4 border-t border-gray-200">
                                        <Link href={item.pathToImage} target="_blank">
                                            <img
                                                src={item.pathToImage}
                                                alt={`Image of ${item.name.toLowerCase()}`}
                                                className="w-28 h-18 m-auto rounded-md border border-gray-200"
                                            />
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 border-t border-gray-200 relative">
                                        <button
                                            onClick={() => toggleMenu(item.id)}
                                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                        >
                                            <EllipsisVertical size={24} />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {menuOpenId === item.id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 transition-opacity duration-200 ease-out opacity-100">
                                                <Link
                                                    href={`/itemOverview/${item.id}/addNutritionlabel`}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-700 hover:text-white hover:rounded-t-lg transition-all duration-200"
                                                >
                                                    {item.nutritionlabel
                                                        ? 'Update Nutrition Label'
                                                        : 'Add Nutrition Label'}
                                                </Link>
                                                <a
                                                    className="block rounded-b-lg px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer"
                                                    onClick={() => handleDeleteItem(item.id)}
                                                >
                                                    Delete Item
                                                </a>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default ItemAdminOverview;
