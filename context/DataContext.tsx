
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Product, Sale } from '../types';
import { MOCK_PRODUCTS, MOCK_SALES } from '../services/mockData';

interface DataContextType {
    products: Product[];
    sales: Sale[];
    loading: boolean;
    addProduct: (productData: Omit<Product, 'id' | 'lastUpdated'>) => Promise<void>;
    updateProduct: (id: string, productData: Partial<Product>) => Promise<void>;
    addSale: (saleData: Omit<Sale, 'id'>) => Promise<string>;
    updateProductStock: (productId: string, quantitySold: number) => Promise<void>;
}

export const DataContext = createContext<DataContextType>({} as DataContextType);

export const DataProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            setProducts(MOCK_PRODUCTS);
            setSales(MOCK_SALES);
            setLoading(false);
        };
        fetchData();
    }, []);

    const addProduct = useCallback(async (productData: Omit<Product, 'id' | 'lastUpdated'>) => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        const newProduct: Product = {
            ...productData,
            id: `prod-${Date.now()}`,
            lastUpdated: new Date(),
        };
        setProducts(prev => [...prev, newProduct]);
        setLoading(false);
    }, []);

    const updateProduct = useCallback(async (id: string, productData: Partial<Product>) => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...productData, lastUpdated: new Date() } : p));
        setLoading(false);
    }, []);
    
    const updateProductStock = useCallback(async (productId: string, quantitySold: number) => {
        setProducts(prev => prev.map(p => {
            if (p.id === productId) {
                return { ...p, stock: p.stock - quantitySold, lastUpdated: new Date() };
            }
            return p;
        }));
    }, []);

    const addSale = useCallback(async (saleData: Omit<Sale, 'id'>) => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        const newSale: Sale = {
            ...saleData,
            id: `sale-${Date.now()}`,
        };
        setSales(prev => [newSale, ...prev]);
        
        // Batch update stock
        const stockUpdates = saleData.items.map(item => updateProductStock(item.id, item.quantity));
        await Promise.all(stockUpdates);

        setLoading(false);
        return newSale.id;
    }, [updateProductStock]);
    
    return (
        <DataContext.Provider value={{ products, sales, loading, addProduct, updateProduct, addSale, updateProductStock }}>
            {children}
        </DataContext.Provider>
    );
};
