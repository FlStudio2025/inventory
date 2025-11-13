
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { AuthContextType } from '../../types';

const LoginScreen: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    // FIX: Cast the value from useContext to AuthContextType to resolve property access errors.
    const { login } = useContext(AuthContext) as AuthContextType;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        const success = await login(username, password);
        if (!success) {
            setErrorMessage('ইউজারনেম বা পাসওয়ার্ড ভুল।');
            setTimeout(() => setErrorMessage(''), 5000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-main">
                <h2 className="text-3xl font-bold mb-6 text-center text-primary">লগইন করুন</h2>
                {errorMessage && <div className="mb-4 text-sm text-center text-red-500">{errorMessage}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-gray-700 font-medium mb-1">ইউজারনেম</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition duration-150"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-1">পাসওয়ার্ড</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition duration-150"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 rounded-lg transition-colors duration-200">
                        লগইন
                    </button>
                    <p className="text-sm text-gray-500 text-center mt-4">অ্যাডমিন ডিফল্ট: ইউজারনেম `admin`, পাসওয়ার্ড `123`</p>
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;
