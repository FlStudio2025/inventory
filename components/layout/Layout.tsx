
import React, { useState, useContext } from 'react';
import Sidebar from './Sidebar';
import Dashboard from '../dashboard/Dashboard';
import SalesPOS from '../sales/SalesPOS';
import ProductManagement from '../products/ProductManagement';
import Reports from '../reports/Reports';
import { AuthContext } from '../../context/AuthContext';
import { ModalContext } from '../../context/ModalContext';
import { AuthContextType } from '../../types';

const Layout: React.FC = () => {
    // FIX: Cast the value from useContext to AuthContextType to resolve property access errors.
    const { loggedInUser } = useContext(AuthContext) as AuthContextType;
    const { showAlert } = useContext(ModalContext);
    const defaultPage = loggedInUser?.role === 'admin' ? 'dashboard' : 'sales';

    const [currentPage, setCurrentPage] = useState(defaultPage);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleSetPage = (page: string) => {
        if (loggedInUser?.role === 'staff' && (page === 'products' || page === 'reports')) {
            showAlert('অনুমতি নেই', 'এই প্যানেলটি শুধুমাত্র প্রশাসকদের জন্য।', true);
            return;
        }
        setCurrentPage(page);
        setSidebarOpen(false); // Close sidebar on mobile after navigation
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard />;
            case 'sales':
                return <SalesPOS />;
            case 'products':
                return <ProductManagement />;
            case 'reports':
                return <Reports />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar currentPage={currentPage} setPage={handleSetPage} isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
            <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
                <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 mb-4 bg-primary text-white rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
                <div className="space-y-6">
                    {renderPage()}
                </div>
            </main>
        </div>
    );
};

export default Layout;
