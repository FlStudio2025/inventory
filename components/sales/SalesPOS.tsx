
import React, { useState, useContext, useMemo } from 'react';
import { DataContext } from '../../context/DataContext';
import { AuthContext } from '../../context/AuthContext';
import { ModalContext } from '../../context/ModalContext';
import type { CartItem, Product, Sale, AuthContextType } from '../../types';
// FIX: Import createRoot from react-dom/client for React 18 compatibility.
import { createRoot } from 'react-dom/client';

const formatTaka = (amount: number) => `৳ ${Math.round(amount).toLocaleString('bn-BD')}`;

const SalesPOS: React.FC = () => {
    const { products, addSale } = useContext(DataContext);
    // FIX: Cast the value from useContext to AuthContextType to resolve property access errors.
    const { loggedInUser } = useContext(AuthContext) as AuthContextType;
    const { showAlert, showConfirm } = useContext(ModalContext);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products;
        return products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [products, searchTerm]);

    const addToCart = (product: Product) => {
        if (product.stock <= 0) {
            showAlert('স্টক আউট', `${product.name} এর স্টক শেষ।`, true);
            return;
        }

        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            if (existingItem.quantity + 1 > product.stock) {
                showAlert('স্টক সতর্কতা', `কার্টে ${product.name} এর আর বেশি পরিমাণ যোগ করা যাবে না। বর্তমান স্টক: ${product.stock.toLocaleString('bn-BD')}`, true);
                return;
            }
            updateCartItem(product.id, { quantity: existingItem.quantity + 1 });
        } else {
            const newItem: CartItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                cost: product.cost,
                quantity: 1,
                discount: 0,
                total: product.price,
            };
            setCart(prev => [...prev, newItem]);
        }
    };

    const updateCartItem = (id: string, updates: Partial<CartItem>) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.id === id) {
                const updatedItem = { ...item, ...updates };
                updatedItem.total = updatedItem.quantity * updatedItem.price * (1 - (updatedItem.discount / 100));
                return updatedItem;
            }
            return item;
        }));
    };
    
    const handleDiscountChange = (id: string, discountStr: string) => {
        let discount = parseFloat(discountStr) || 0;
        if (discount < 0 || discount > 100) {
            showAlert('ডিসকাউন্ট ত্রুটি', 'ডিসকাউন্ট অবশ্যই 0% থেকে 100% এর মধ্যে হতে হবে।', true);
            return;
        }
        updateCartItem(id, { discount });
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.total, 0), [cart]);
    const cartItemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

    // FIX: Update print logic to use createRoot API from React 18.
    const printInvoice = (saleData: Sale) => {
        const printArea = document.getElementById('print-invoice-area');
        if (!printArea) return;

        const totalDiscount = saleData.items.reduce((sum, item) => {
            const originalPrice = item.quantity * item.price;
            return sum + (originalPrice - item.total);
        }, 0);

        const invoiceHTML = (
             <div className="p-6">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-1">ইনভেন্টরি অ্যাপ স্টোর</h1>
                    <p>বিক্রয় চালান / ইনভয়েস</p>
                </div>
                <div className="flex justify-between text-sm mb-4 border-b pb-2">
                    <div>
                        <p>ইনভয়েস আইডি: <b>{saleData.invoiceId}</b></p>
                        <p>বিক্রয়কর্মী: {saleData.soldBy}</p>
                    </div>
                    <div>
                        <p>তারিখ: {saleData.timestamp.toLocaleDateString('bn-BD')}</p>
                        <p>সময়: {saleData.timestamp.toLocaleTimeString('bn-BD')}</p>
                    </div>
                </div>
                <table className="w-full text-left border-collapse mb-6 text-sm">
                    <thead><tr className="border-b"><th className="py-2">প্রোডাক্ট</th><th className="py-2 text-center">পরিমাণ</th><th className="py-2 text-center">ইউনিট মূল্য</th><th className="py-2 text-center">ডিসকাউন্ট (%)</th><th className="py-2 text-right">মোট</th></tr></thead>
                    <tbody>{saleData.items.map(item => (<tr key={item.id} className="border-b"><td className="py-2">{item.name}</td><td className="py-2 text-center">{item.quantity.toLocaleString('bn-BD')}</td><td className="py-2 text-center">{formatTaka(item.price)}</td><td className="py-2 text-center">{item.discount.toLocaleString('bn-BD')}</td><td className="py-2 text-right">{formatTaka(item.total)}</td></tr>))}</tbody>
                </table>
                <div className="flex flex-col items-end space-y-2 text-base">
                    <div className="w-full max-w-xs flex justify-between border-t pt-2"><span>মোট ডিসকাউন্ট:</span><span>{formatTaka(totalDiscount)}</span></div>
                    <div className="w-full max-w-xs flex justify-between font-bold text-xl border-t border-double pt-2"><span>মোট পরিশোধ:</span><span className="text-red-600">{formatTaka(saleData.totalPrice)}</span></div>
                </div>
                <div className="text-center mt-10 border-t pt-4 text-xs"><p>পুনরায় আসার জন্য ধন্যবাদ!</p></div>
            </div>
        );
        
        const root = createRoot(printArea);
        root.render(invoiceHTML);
        
        // Use a timeout to ensure content is rendered before printing, then unmount.
        setTimeout(() => {
            window.print();
            root.unmount();
        }, 250);
    };

    const handleCheckout = async () => {
        if (!loggedInUser) return;
        showConfirm(
            'বিল নিশ্চিত করুন',
            <span>মোট আইটেম: {cartItemCount.toLocaleString('bn-BD')}টি। মোট মূল্য: <b>{formatTaka(cartTotal)}</b>। আপনি কি বিক্রয় প্রক্রিয়াটি নিশ্চিত করতে চান?</span>,
            async () => {
                const saleData: Omit<Sale, 'id'> = {
                    items: cart,
                    totalPrice: cartTotal,
                    totalCost: cart.reduce((sum, item) => sum + item.cost * item.quantity, 0),
                    totalProfit: cart.reduce((sum, item) => sum + (item.total - item.cost * item.quantity), 0),
                    timestamp: new Date(),
                    soldBy: loggedInUser.name,
                    soldById: loggedInUser.id,
                    invoiceId: `INV-${Date.now()}`
                };
                try {
                    const newSaleId = await addSale(saleData);
                    showAlert('বিক্রয় সফল', <span>বিক্রয় সফলভাবে সম্পন্ন হয়েছে। মোট মূল্য: <b>{formatTaka(saleData.totalPrice)}</b>।</span>);
                    setCart([]);
                    
                    showConfirm(
                        'ইনভয়েস',
                        `ইনভয়েস সেভ হয়েছে। আপনি কি প্রিন্ট করতে চান?`,
                        () => printInvoice({ ...saleData, id: newSaleId })
                    );

                } catch (e) {
                     showAlert('ত্রুটি', `বিক্রয় প্রক্রিয়া ব্যর্থ হয়েছে`, true);
                }
            }
        );
    };

    return (
        <>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">বিক্রয় কেন্দ্র (POS)</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-xl shadow-main lg:col-span-2 h-[80vh] flex flex-col">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2">প্রোডাক্ট নির্বাচন</h3>
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="প্রোডাক্টের নাম দিয়ে খুঁজুন..." className="w-full px-4 py-2 border rounded-lg mb-4 focus:ring-primary focus:border-primary" />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto flex-1">
                        {filteredProducts.map(p => (
                            <div key={p.id} onClick={() => addToCart(p)} className={`p-3 border rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-150 bg-gray-50 ${p.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <p className="font-bold text-gray-800 text-sm">{p.name}</p>
                                <p className="text-xs text-gray-500">{p.category || 'সাধারণ'}</p>
                                <p className="text-base font-bold text-red-500 mt-1">{formatTaka(p.price)}</p>
                                <p className={`text-xs ${p.stock <= 0 ? 'text-red-700 font-bold' : 'text-green-600'}`}>স্টক: {p.stock.toLocaleString('bn-BD')}</p>
                                {p.stock <= 0 && <p className="text-xs text-red-700 font-bold mt-1">স্টক আউট</p>}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-main h-[80vh] flex flex-col">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2">কার্ট ({cartItemCount.toLocaleString('bn-BD')} আইটেম)</h3>
                    <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2">
                        {cart.length === 0 && <p className="text-gray-500 text-center mt-8">কার্ট খালি আছে</p>}
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between items-center border-b pb-2">
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.quantity.toLocaleString('bn-BD')} x {formatTaka(item.price)}</p>
                                    <input type="number" onChange={(e) => handleDiscountChange(item.id, e.target.value)} className="discount-input w-20 text-xs border rounded-lg p-1 mt-1" placeholder="ডিসকাউন্ট (%)" min="0" max="100" defaultValue={item.discount || 0} />
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-red-600">{formatTaka(item.total)}</p>
                                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 text-xs">মুছুন</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-4">
                        <div className="flex justify-between font-bold text-xl mb-4">
                            <span>মোট মূল্য:</span><span className="text-primary">{formatTaka(cartTotal)}</span>
                        </div>
                        <button onClick={handleCheckout} disabled={cart.length === 0} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            বিল তৈরি ও সংরক্ষণ করুন
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SalesPOS;
