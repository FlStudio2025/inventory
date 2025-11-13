
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { MOCK_USERS } from '../services/mockData';
import type { User, AuthContextType } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    useEffect(() => {
        // Simulate checking auth status on app start (e.g., from localStorage)
        const timer = setTimeout(() => {
            setIsAuthReady(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const login = useCallback(async (username: string, password: string): Promise<boolean> => {
        const user = MOCK_USERS.find(u => u.username === username && u.password === password);
        if (user) {
            // In a real app, don't store the password in the user object in state
            const { password: _, ...userToStore } = user;
            setLoggedInUser(userToStore);
            return true;
        }
        return false;
    }, []);

    const logout = useCallback(() => {
        setLoggedInUser(null);
    }, []);

    const changePassword = useCallback(async (currentPass: string, newPass: string): Promise<boolean> => {
        if (!loggedInUser) return false;

        const userInDb = MOCK_USERS.find(u => u.id === loggedInUser.id);
        if (userInDb && userInDb.password === currentPass) {
            // NOTE: This mutates the imported mock data array.
            // This is generally bad practice but works for this simulation.
            // In a real app, this would be an API call to a backend.
            userInDb.password = newPass;
            return true;
        }
        return false;
    }, [loggedInUser]);

    const value: AuthContextType = {
        loggedInUser,
        isAuthReady,
        login,
        logout,
        changePassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
