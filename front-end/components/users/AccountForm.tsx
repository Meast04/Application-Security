import UserService from '@services/userService';
import { StatusMessage, User } from '@types';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AccountFormProps {
    setLoggedInUser: (user: User | null) => void;
}

const AccountForm: React.FC<AccountFormProps> = ({ setLoggedInUser }) => {
    const [oldPassword, setOldPassword] = useState<string>('');
    const [oldPasswordError, setOldPasswordError] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [newPasswordError, setNewPasswordError] = useState<string>('');
    const router = useRouter();
    const { t } = useTranslation();

    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const logOut = () => {
        sessionStorage.removeItem('loggedInUser');
        setLoggedInUser(null);
        router.push('/login');
    };

    const clearErrors = () => {
        setOldPasswordError('');
        setNewPasswordError('');
        setStatusMessages([]);
    };

    const validate = (): boolean => {
        let isValid = true;
        clearErrors();

        if (!newPassword.trim()) {
            setNewPasswordError('Please enter a valid password.');
            isValid = false;
        }
        if (!oldPassword.trim()) {
            setOldPasswordError('Please enter a valid password.');
            isValid = false;
        }

        return isValid;
    };

    const changePassword = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!validate()) return;

        if (!oldPassword || !newPassword) {
            console.error('Both password fields must be filled out');
            return;
        }

        try {
            const token = JSON.parse(sessionStorage.getItem('loggedInUser') as string).token;
            const response = await UserService.updateUsersPassword(
                token,
                oldPassword as string,
                newPassword as string
            );

            if (response) {
                setStatusMessages([
                    {
                        message: 'Password updated successfully, redirecting to login page...',
                        type: 'success',
                    },
                ]);

                setTimeout(() => {
                    logOut();
                }, 2000);
            }
        } catch (error) {
            console.error(error);
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
            <h1>Change Password</h1>

            <form onSubmit={changePassword} className="w-1/3">
                <div>
                    <label htmlFor="oldpassword">Old Password</label>
                    <input
                        type="password"
                        name="oldpassword"
                        id="oldpassword"
                        placeholder="Enter Old Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {oldPasswordError && (
                        <span className="text-red-700 font-bold">{oldPasswordError}</span>
                    )}
                </div>

                <div className="mt-4">
                    <label htmlFor="newpassword">New Password</label>
                    <input
                        type="password"
                        name="newpassword"
                        id="newpassword"
                        placeholder="Enter New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {newPasswordError && (
                        <span className="text-red-700 font-bold">{newPasswordError}</span>
                    )}
                </div>
                <button
                    type="submit"
                    className="mt-6 w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300 cursor-pointer"
                >
                    Submit
                </button>
            </form>
        </>
    );
};

export default AccountForm;
