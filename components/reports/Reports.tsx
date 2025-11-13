
import React, { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { ModalContext } from '../../context/ModalContext';
import StatCard from '../ui/StatCard';

const formatTaka = (amount: number) => `৳ ${Math.round(amount).toLocaleString('bn-BD')}`;

const Reports: React.FC = () => {
    const { sales } = useContext(DataContext);
    const { showAlert } = useContext(ModalContext);

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
    const totalProfit = sales.reduce((sum, sale) => sum + sale.totalProfit, 0);
    const totalSalesCount = sales.length;
    
    const handleRunReport = () => {
        showAlert(
            'রিপোর্ট জেনারেট সফল',
            <span>আজকের তারিখের (<b>{new Date().toLocaleDateString('bn-BD')}</b>) রিপোর্ট জেনারেট হয়েছে। একটি রিয়েল-ওয়ার্ল্ড অ্যাপে, এই ফাইলটি স্বয়ংক্রিয়ভাবে আপনার গুগল ড্রাইভে আপলোড হয়ে যেত।</span>,
            false
        );
    };

    return (
        <>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">রিপোর্ট ও বিশ্লেষণ</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <StatCard label="সর্বমোট বিক্রয়" value={formatTaka(totalRevenue)} borderColorClass="border-primary" textColorClass="text-primary" />
                 <StatCard label="সর্বমোট লাভ" value={formatTaka(totalProfit)} borderColorClass="border-green-500" textColorClass="text-green-500" />
                 <StatCard label="মোট বিক্রয় সংখ্যা" value={totalSalesCount.toLocaleString('bn-BD')} borderColorClass="border-blue-500" textColorClass="text-blue-500" />
            </div>
            
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8 rounded-lg shadow-inner flex flex-col sm:flex-row justify-between items-center">
                <div>
                    <p className="font-bold">স্বয়ংক্রিয় রিপোর্ট/ব্যাকআপ (সিমুলেশন)</p>
                    <p className="text-sm">দৈনিক রিপোর্ট জিমেইল/ড্রাইভে আপলোড করার জন্য একটি সার্ভার বা ক্লাউড ফাংশন প্রয়োজন। এই বাটনটি প্রক্রিয়াটি অনুকরণ করে।</p>
                </div>
                <button onClick={handleRunReport} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition-colors mt-3 sm:mt-0 sm:ml-4 flex-shrink-0">
                    আজকের রিপোর্ট জেনারেট করুন
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-main">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">বিক্রয়ের বিস্তারিত তালিকা</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ইনভয়েস ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">তারিখ</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">বিক্রয়কর্মী</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">বিক্রয় মূল্য</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">লাভ</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sales.map(s => (
                                <tr key={s.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.invoiceId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{s.timestamp.toLocaleDateString('bn-BD')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{s.soldBy}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold">{formatTaka(s.totalPrice)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-bold">{formatTaka(s.totalProfit)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Reports;
