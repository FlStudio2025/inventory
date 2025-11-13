
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ModalContext } from '../../context/ModalContext';
import { NAV_ITEMS } from '../../constants';
import { AuthContextType } from '../../types';

interface SidebarProps {
    currentPage: string;
    setPage: (page: string) => void;
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage, isOpen, setOpen }) => {
    // FIX: Cast the value from useContext to AuthContextType to resolve property access errors.
    const { loggedInUser, logout, changePassword } = useContext(AuthContext) as AuthContextType;
    const { showAlert, hideModal } = useContext(ModalContext);

    const showChangePasswordModal = () => {
        let currentPass = '';
        let newPass = '';
        let confirmPass = '';

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            if (newPass !== confirmPass) {
                showAlert('ত্রুটি', 'নতুন পাসওয়ার্ড এবং নিশ্চিত পাসওয়ার্ড মিলছে না।', true);
                return;
            }
            if (newPass.length < 3) {
                showAlert('ত্রুটি', 'পাসওয়ার্ড কমপক্ষে 3 অক্ষরের হতে হবে।', true);
                return;
            }
            const success = await changePassword(currentPass, newPass);
            if (success) {
                hideModal();
                showAlert('সফল', 'আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।');
            } else {
                showAlert('ত্রুটি', 'বর্তমান পাসওয়ার্ড ভুল।', true);
            }
        };

        showAlert(
            'পাসওয়ার্ড পরিবর্তন',
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">বর্তমান পাসওয়ার্ড</label>
                    <input type="password" onChange={(e) => currentPass = e.target.value} className="w-full px-3 py-2 border rounded-lg" required />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">নতুন পাসওয়ার্ড</label>
                    <input type="password" onChange={(e) => newPass = e.target.value} className="w-full px-3 py-2 border rounded-lg" required />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">পাসওয়ার্ড নিশ্চিত করুন</label>
                    <input type="password" onChange={(e) => confirmPass = e.target.value} className="w-full px-3 py-2 border rounded-lg" required />
                </div>
                <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 rounded-lg transition-colors">পাসওয়ার্ড সেভ করুন</button>
            </form>
        );
    };

    if (!loggedInUser) return null;

    return (
        <>
            <aside className={`bg-primary w-64 p-4 flex flex-col flex-shrink-0 fixed md:relative h-full z-20 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div>
                    <h1 className="text-3xl font-extrabold text-white mb-8 border-b border-white border-opacity-30 pb-2">ইনভেন্টরি অ্যাপ</h1>
                    <div className="space-y-2">
                        {NAV_ITEMS.map(nav => {
                            if (nav.roles.includes(loggedInUser.role)) {
                                const isActive = currentPage === nav.id;
                                return (
                                    <div
                                        key={nav.id}
                                        onClick={() => setPage(nav.id)}
                                        className={`flex items-center p-3 rounded-lg transition-all duration-200 cursor-pointer ${isActive ? 'bg-white text-primary font-bold' : 'text-white hover:bg-white hover:bg-opacity-20'}`}
                                    >
                                        {nav.icon}
                                        {nav.label}
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>

                <div className="mt-auto pt-8 border-t border-white border-opacity-30">
                    <p className="text-white text-sm">স্বাগতম,</p>
                    <p className="text-white font-bold">{loggedInUser.name}</p>
                    <p className="text-white text-sm">({loggedInUser.role === 'admin' ? 'প্রশাসক' : 'বিক্রয়কর্মী'})</p>

                    <button onClick={logout} className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                         <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        লগ আউট
                    </button>
                    <button onClick={showChangePasswordModal} className="mt-2 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                         <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2v10a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2h6zm-6 4l2-2m0 0l2 2m-2-2v6"></path></svg>
                        পাসওয়ার্ড পরিবর্তন
                    </button>
                </div>
            </aside>
            {isOpen && <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"></div>}
        </>
    );
};

export default Sidebar;
