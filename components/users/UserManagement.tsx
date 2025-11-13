import React from 'react';
import { MOCK_USERS } from '../../services/mockData';
import type { User } from '../../types';

const UserManagement: React.FC = () => {
    // For this simulation, we'll read directly from the mock data.
    // In a real app, this would come from a data context or an API call.
    const users: User[] = MOCK_USERS;

    return (
        <>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">ইউজার ম্যানেজমেন্ট</h2>
            <div className="bg-white p-6 rounded-xl shadow-main">
                 <h3 className="text-xl font-semibold mb-4 border-b pb-2">ইউজার তালিকা ({users.length.toLocaleString('bn-BD')}টি)</h3>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">নাম</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ইউজারনেম</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ভূমিকা (Role)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.role === 'admin' ? 'প্রশাসক' : 'বিক্রয়কর্মী'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 transition-colors">এডিট</button>
                                        {/* Add delete functionality later if needed */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 <p className="mt-4 text-sm text-gray-500">দ্রষ্টব্য: এই ডেমো সংস্করণে ইউজার যোগ করা বা মুছে ফেলার সুবিধা নেই।</p>
            </div>
        </>
    );
};

export default UserManagement;
