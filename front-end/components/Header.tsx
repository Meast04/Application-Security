import { User } from '@types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useInterval from 'use-interval';
import Language from './language/Language';
import { useTranslation } from 'next-i18next';
import React from 'react';

const Header: React.FC = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

    const logOut = () => {
        sessionStorage.removeItem('loggedInUser');
        setLoggedInUser(null);
        router.push('/');
    };

    const getLoggedInUser = () => {
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser') as string);
        loggedInUser && setLoggedInUser(loggedInUser);
    };

    useEffect(() => {
        getLoggedInUser();
    }, []);

    useInterval(() => {
        getLoggedInUser();
    }, 1000);

    return (
        <header className="bg-primary text-white flex justify-between uppercase py-6">
            <div className="max-w-7xl px-8 mx-auto flex justify-between w-full">
                <Link href={'/'}>
                    <h1 className="text-lg font-bold">{t('header.title')}</h1>
                </Link>
                <nav className="">
                    <ul className="flex gap-4">
                        {loggedInUser && (
                            <>
                                <li>
                                    <Link href="/shoppingcarts">{t('header.shoppingcarts')}</Link>
                                </li>

                                {(loggedInUser.role === 'admin' ||
                                    loggedInUser.role === 'manager') && (
                                    <li>
                                        <Link href="/itemOverview">
                                            {t('header.admin_items_overview')}
                                        </Link>
                                    </li>
                                )}
                                {(loggedInUser.role === 'admin' ||
                                    loggedInUser.role === 'manager') && (
                                    <li>
                                        <Link href="/adminUsersOverview">
                                            {t('header.admin_users_overview')}
                                        </Link>
                                    </li>
                                )}
                            </>
                        )}
                        {loggedInUser && (
                            <li>
                                <Link href="/account">Account</Link>
                            </li>
                        )}

                        {loggedInUser ? (
                            <li>
                                <Link onClick={logOut} href={'/login'}>
                                    {t('header.logout')}
                                </Link>
                            </li>
                        ) : (
                            <>
                                <li>
                                    <Link href="/login">{t('header.login')}</Link>
                                </li>
                                <li>
                                    <Link href="/register">{t('header.register')}</Link>
                                </li>
                            </>
                        )}
                        <li>
                            <Language />
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
