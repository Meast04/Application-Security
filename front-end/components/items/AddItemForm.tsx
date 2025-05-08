import { useState, ChangeEvent } from 'react';
import ItemService from '@services/ItemsService';
import { Item, StatusMessage } from '@types';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';
import React from 'react';

const AddItemForm: React.FC = () => {
    const router = useRouter();
    const { t } = useTranslation('common');
    const [item, setItem] = useState<Item>({
        name: '',
        price: 0,
        pathToImage: '',
        category: 'fruits',
    });
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);

    const clearStatusMessages = () => {
        setStatusMessages([]);
    };

    const validateForm = (): boolean => {
        clearStatusMessages();
        let isValid = true;

        if (!item.name.trim()) {
            setStatusMessages((prev) => [
                ...prev,
                { message: t('addItemForm.validation.nameRequired'), type: 'error' },
            ]);
            isValid = false;
        }
        if (item.price <= 0) {
            setStatusMessages((prev) => [
                ...prev,
                { message: t('addItemForm.validation.pricePositive'), type: 'error' },
            ]);
            isValid = false;
        }
        if (!item.pathToImage.trim()) {
            setStatusMessages((prev) => [
                ...prev,
                { message: t('addItemForm.validation.imageUrlRequired'), type: 'error' },
            ]);
            isValid = false;
        }

        return isValid;
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setItem((prev) => ({
            ...prev,
            [name]: name === 'price' ? (value === '' ? '' : Number(value)) : value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateForm()) return;

        console.log(item);

        try {
            const token = JSON.parse(sessionStorage.getItem('loggedInUser') as string)?.token;
            if (!token) throw new Error(t('addItemForm.error.tokenMissing'));

            const response = await ItemService.addItem(token, item);

            if (response && response.ok) {
                setStatusMessages([
                    {
                        message: 'success: redirecting',
                        type: 'success',
                    },
                ]);

                setTimeout(() => {
                    router.push('/itemOverview');
                }, 2000); // Redirect after a delay
            } else {
                if (response) {
                    const errorData = await response.json();
                    setStatusMessages([
                        {
                            message: errorData?.message ?? t('error: unknownError'),
                            type: 'error',
                        },
                    ]);
                }
            }
        } catch (error) {
            console.error(error);
            setStatusMessages([
                {
                    message: 'error: unknownError',
                    type: 'error',
                },
            ]);
        }
    };

    return (
        <section>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col p-6 w-full max-w-lg mx-auto mb-8 bg-tertiary shadow-md rounded-lg border-2 border-gray-200"
            >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                    {t('addItemForm.title')}
                </h2>

                <div className="space-y-2">
                    <div>
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                            {t('addItemForm.labels.name')}:
                        </label>
                        <input
                            type="text"
                            required
                            name="name"
                            value={item.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label htmlFor="price" className="block text-gray-700 font-medium mb-1">
                            {t('addItemForm.labels.price')}:
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            name="price"
                            value={item.price}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="pathToImage"
                            className="block text-gray-700 font-medium mb-1"
                        >
                            {t('addItemForm.labels.imageUrl')}:
                        </label>
                        <input
                            type="text"
                            required
                            name="pathToImage"
                            value={item.pathToImage}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-gray-700 font-medium mb-1">
                            {t('addItemForm.labels.category')}:
                        </label>
                        <select
                            name="category"
                            value={item.category}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                        >
                            <option value="fruits">{t('addItemForm.categories.fruits')}</option>
                            <option value="vegetables">
                                {t('addItemForm.categories.vegetables')}
                            </option>
                            <option value="dairy">{t('addItemForm.categories.dairy')}</option>
                        </select>
                    </div>
                </div>

                {statusMessages.length > 0 && (
                    <ul className="mt-4">
                        {statusMessages.map(({ message, type }, index) => (
                            <li
                                key={index}
                                className={classNames('mb-2', {
                                    'text-red-700': type === 'error',
                                    'text-green-700': type === 'success',
                                })}
                            >
                                {message}
                            </li>
                        ))}
                    </ul>
                )}

                <button
                    type="submit"
                    className="mt-6 w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300 cursor-pointer"
                >
                    {t('addItemForm.buttons.addItem')}
                </button>
            </form>
        </section>
    );
};

export default AddItemForm;
