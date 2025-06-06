import Head from 'next/head';
import { useEffect, useState } from 'react';
import { User } from '@types';
import AddShoppingcartForm from '@components/shoppingcart/AddShoppingcartForm';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import React from 'react';

const ShoppingcartForm: React.FC = () => {
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        const token = JSON.parse(sessionStorage.getItem('loggedInUser') || 'null');
        setLoggedInUser(token);
    }, []);

    if (!loggedInUser) {
        return (
            <p className="py-56 text-lg text-red-600 text-center italic font-bold">
                {t('loginwarning')}
            </p>
        );
    }

    return (
        <>
            <Head>
                <title>{t('pagetitles.createshoppingcart')}</title>
            </Head>

            <section className="p-6 w-full max-w-lg mx-auto bg-white shadow-md rounded-lg border-2 border-gray-200">
                {loggedInUser && <AddShoppingcartForm />}
            </section>
        </>
    );
};

export const getServerSideProps = async (context: any) => {
    const { locale } = context;
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'en', ['common'])),
        },
    };
};

export default ShoppingcartForm;
