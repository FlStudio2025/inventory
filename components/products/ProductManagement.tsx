
import React, { useState, useContext, useEffect, useRef } from 'react';
import { DataContext } from '../../context/DataContext';
import { ModalContext } from '../../context/ModalContext';
import type { Product } from '../../types';

const formatTaka = (amount: number) => `৳ ${Math.round(amount).toLocaleString('bn-BD')}`;
const initialFormState = { id: '', name: '', cost: '', price: '', stock: '', category: '' };

const ProductManagement: React.FC = () => {
    const { products, addProduct, updateProduct } = useContext(DataContext);
    const { showAlert } = useContext(ModalContext);
    const [formData, setFormData] = useState(initialFormState);
    const formRef = useRef<HTMLDivElement>(null);

    const isEditing = !!formData.id;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData(initialFormState);
    };

    const handleEdit = (product: Product) => {
        setFormData({
            id: product.id,
            name: product.name,
            cost: String(product.cost),
            price: String(product.price),
            stock: String(product.stock),
            category: product.category,
        });
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const cost = parseFloat(formData.cost);
        const price = parseFloat(formData.price);
        const stock = parseInt(formData.stock, 10);
        
        if (price < cost) {
            showAlert('ত্রুটি', 'বিক্রয় মূল্য ক্রয় মূল্যের চেয়ে কম হতে পারে না!', true);
            return;
        }

        const productData = {
            name: formData.name,
            cost,
            price,
            stock,
            category: formData.category,
        };
        
        try {
            if (isEditing) {
                await updateProduct(formData.id, productData);
                showAlert('সফল', 'প্রোডাক্ট সফলভাবে আপডেট হয়েছে।');
            } else {
                await addProduct(productData);
                showAlert('সফল', 'নতুন প্রোডাক্ট সফলভাবে যোগ হয়েছে।');
            }
            resetForm();
        } catch (error) {
            const err = error as Error;
            showAlert('ত্রুটি', `প্রোডাক্ট সেভ করার সময় সমস্যা হয়েছে: ${err.message}`, true);
        }
    };

    return (
        <>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">প্রোডাক্ট ম্যানেজমেন্ট</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div ref={formRef} className="bg-white p-6 rounded-xl shadow-main lg:col-span-1">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2">{isEditing ? 'প্রোডাক্ট এডিট করুন' : 'নতুন প্রোডাক্ট যোগ করুন'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="hidden" name="id" value={formData.id} />
                        <div>
                            <label className="block text-gray-700 text-sm font-medium">নাম</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium">ক্রয় মূল্য (প্রতি ইউনিট)</label>
                            <input type="number" name="cost" value={formData.cost} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" min="0" required />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium">বিক্রয় মূল্য (প্রতি ইউনিট)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" min="0" required />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium">স্টক পরিমাণ</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" min="0" required />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium">ক্যাটাগরি</label>
                            <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 rounded-lg transition-colors">{isEditing ? 'আপডেট করুন' : 'প্রোডাক্ট সেভ করুন'}</button>
                        {isEditing && <button type="button" onClick={resetForm} className="w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-lg transition-colors">বাতিল/নতুন</button>}
                    </form>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-main lg:col-span-2">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2">প্রোডাক্ট তালিকা ({products.length.toLocaleString('bn-BD')}টি)</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">নাম (ক্যাটাগরি)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ক্রয় মূল্য</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">বিক্রয় মূল্য</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">স্টক</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">অ্যাকশন</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map(p => (
                                    <tr key={p.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name} <span className="text-xs text-gray-500">({p.category || 'N/A'})</span></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{formatTaka(p.cost)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{formatTaka(p.price)}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${p.stock < 10 ? 'text-red-500' : 'text-green-600'}`}>{p.stock.toLocaleString('bn-BD')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onClick={() => handleEdit(p)} className="text-indigo-600 hover:text-indigo-900 transition-colors">এডিট</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductManagement;
