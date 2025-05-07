import userService from '@services/userService';
import { StatusMessage } from '@types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next'; // Assuming you're using next-i18next for translations

const UserLoginForm: React.FC = () => {
    const router = useRouter();
    const { t } = useTranslation(); // Initialize translation function
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nameError, setNameError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);

    const clearErrors = () => {
        setNameError(null);
        setPasswordError(null);
        setStatusMessages([]);
    };

    const validate = (): boolean => {
        let isValid = true;
        clearErrors();

        if (!email.trim()) {
            setNameError(t('UserLoginForm.emailLabel') + ' ' + t('validation.required'));
            isValid = false;
        }
        if (!password.trim()) {
            setPasswordError(t('UserLoginForm.passwordLabel') + ' ' + t('validation.required'));
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!validate()) return;

        try {
            const response = await userService.login(email, password);

            if (response.ok) {
                const loggedInUser = await response.json();

                setStatusMessages([
                    {
                        message: t('UserLoginForm.loginSuccess'),
                        type: 'success',
                    },
                ]);

                sessionStorage.setItem(
                    'loggedInUser',
                    JSON.stringify({
                        token: loggedInUser.token,
                        email: loggedInUser.email,
                        role: loggedInUser.role,
                    })
                );

                setTimeout(() => {
                    router.push('/');
                }, 2000); // Redirect after a delay
            } else {
                const errorResponse = await response.json();

                setPassword('');

                setStatusMessages([
                    {
                        message: errorResponse?.message || t('UserLoginForm.invalidCredentials'),
                        type: 'error',
                    },
                ]);
            }
        } catch (error) {
            console.log(error);
            setStatusMessages([
                {
                    message: t('UserLoginForm.unexpectedError'),
                    type: 'error',
                },
            ]);
        }
    };

    return (
        <>
            <h3>{t('UserLoginForm.title')}</h3>

            <form onSubmit={handleSubmit} className="w-1/3">
                <div>
                    <label htmlFor="emailInput">{t('UserLoginForm.emailLabel')}</label>
                    <input
                        id="emailInput"
                        type="text"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder={t('UserLoginForm.emailPlaceholder')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {nameError && <span className="text-red-700 font-bold">{nameError}</span>}
                </div>

                <div className="mt-4">
                    <label htmlFor="passwordInput">{t('UserLoginForm.passwordLabel')}</label>
                    <input
                        id="passwordInput"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder={t('UserLoginForm.passwordPlaceholder')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {passwordError && (
                        <span className="text-red-700 font-bold">{passwordError}</span>
                    )}
                </div>

                {statusMessages && (
                    <div>
                        <ul>
                            {statusMessages.map(({ message, type }, index) => (
                                <li
                                    key={index}
                                    className={classNames({
                                        'text-red-800': type === 'error',
                                        'text-green-800': type === 'success',
                                    })}
                                >
                                    {message}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <button
                    className="mt-6 w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300 cursor-pointer"
                    type="submit"
                >
                    {t('UserLoginForm.loginButton')}
                </button>
            </form>

            <Link
                href="/register"
                className="mt-6 w-1/3 py-3 text-center bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-400 transition duration-300 cursor-pointer"
            >
                {t('UserLoginForm.registerButton')}
            </Link>
            <Link
                href="/"
                className='"mt-6 w-1/3 py-3 text-center text-blue-900 font-semibold rounded-lg hover:underline transition duration-300 cursor-pointer'>
                    Password forgotten?
            </Link>
        </>
    );
};

export default UserLoginForm;
