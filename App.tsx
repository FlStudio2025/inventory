
import React, { useContext } from 'react';
import LoginScreen from './components/auth/LoginScreen';
import Layout from './components/layout/Layout';
import LoadingOverlay from './components/ui/LoadingOverlay';
import Modal from './components/ui/Modal';
import { AuthContext } from './context/AuthContext';
import { DataContext } from './context/DataContext';
import { AuthContextType } from './types';

const App: React.FC = () => {
    // FIX: Cast the value from useContext to AuthContextType to resolve property access errors.
    const { loggedInUser, isAuthReady } = useContext(AuthContext) as AuthContextType;
    const { loading } = useContext(DataContext);

    if (!isAuthReady) {
        return <LoadingOverlay message="অ্যাপ চালু হচ্ছে..." />;
    }
    
    return (
        <>
            {loading && <LoadingOverlay message="ডেটা লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন..." />}
            <Modal />
            {loggedInUser ? <Layout /> : <LoginScreen />}
        </>
    );
};

export default App;
