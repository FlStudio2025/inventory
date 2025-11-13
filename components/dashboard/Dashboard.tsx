
import React, { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { AuthContext } from '../../context/AuthContext';
import StatCard from '../ui/StatCard';
import type { Product } from '../../types';
import { AuthContextType } from '../../types';

const formatTaka = (amount: number) => `৳ ${Math.round(amount).toLocaleString('bn-BD')}`;

const LowStockProducts: React.FC<{products: Product[]}> = ({ products }) => {
    const lowStockThreshold = 10;
    const lowStock = products.filter(p => p.stock < lowStockThreshold);

    if (lowStock.length === 0) {
        return <p className="text-green-600">সব প্রোডাক্টের স্টক পর্যাপ্ত আছে।</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">প্রোডাক্ট</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">স্টক</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {lowStock.map(p => (
                        <tr key={p.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 font-bold">{p.stock.toLocaleString('bn-BD')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const Dashboard: React.FC = () => {
    const { products, sales } = useContext(DataContext);
    // FIX: Cast the value from useContext to AuthContextType to resolve property access errors.
    const { loggedInUser } = useContext(AuthContext) as AuthContextType;

    const totalProducts = products.length;
    const totalSalesCount = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
    const totalProfit = sales.reduce((sum, sale) => sum + sale.totalProfit, 0);

    return (
        <>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">ড্যাশবোর্ড - স্বাগতম, {loggedInUser?.name}</h2>
            
            {loggedInUser?.role === 'admin' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label="মোট বিক্রয়" value={formatTaka(totalRevenue)} borderColorClass="border-primary" textColorClass="text-primary" />
                    <StatCard label="মোট লাভ" value={formatTaka(totalProfit)} borderColorClass="border-green-500" textColorClass="text-green-500" />
                    <StatCard label="মোট প্রোডাক্ট সংখ্যা" value={totalProducts.toLocaleString('bn-BD')} borderColorClass="border-yellow-500" textColorClass="text-yellow-500" />
                    <StatCard label="মোট ইনভয়েস" value={totalSalesCount.toLocaleString('bn-BD')} borderColorClass="border-blue-500" textColorClass="text-blue-500" />
                </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow-main mt-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">কম স্টকের প্রোডাক্ট</h3>
                <LowStockProducts products={products} />
            </div>
        </>
    );
};

export default Dashboard;
