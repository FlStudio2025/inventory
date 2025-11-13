
import type { User, Product, Sale } from '../types';

export const MOCK_USERS: User[] = [
    {
        id: 'user-admin',
        username: 'admin',
        password: '123',
        role: 'admin',
        name: 'প্রধান প্রশাসক'
    },
    {
        id: 'user-staff1',
        username: 'staff1',
        password: '456',
        role: 'staff',
        name: 'বিক্রয়কর্মী ১'
    }
];

export const MOCK_PRODUCTS: Product[] = [
    { id: 'prod-1', name: 'চাল', cost: 50, price: 60, stock: 100, category: 'গ্রোসারি', lastUpdated: new Date() },
    { id: 'prod-2', name: 'ডাল', cost: 110, price: 130, stock: 80, category: 'গ্রোসারি', lastUpdated: new Date() },
    { id: 'prod-3', name: 'সয়াবিন তেল', cost: 150, price: 175, stock: 50, category: 'তেল', lastUpdated: new Date() },
    { id: 'prod-4', name: 'লবণ', cost: 30, price: 40, stock: 200, category: 'মশলা', lastUpdated: new Date() },
    { id: 'prod-5', name: 'চিনি', cost: 80, price: 95, stock: 120, category: 'গ্রোসারি', lastUpdated: new Date() },
    { id: 'prod-6', name: 'দুধ (১ লিটার)', cost: 75, price: 85, stock: 40, category: 'ডেইরি', lastUpdated: new Date() },
    { id: 'prod-7', name: 'ডিম (ডজন)', cost: 120, price: 140, stock: 30, category: 'ডেইরি', lastUpdated: new Date() },
    { id: 'prod-8', name: 'সাবান', cost: 25, price: 35, stock: 150, category: 'টয়লেট্রিজ', lastUpdated: new Date() },
    { id: 'prod-9', name: 'শ্যাম্পু', cost: 180, price: 210, stock: 60, category: 'টয়লেট্রিজ', lastUpdated: new Date() },
    { id: 'prod-10', name: 'চা পাতা', cost: 90, price: 110, stock: 70, category: 'পানীয়', lastUpdated: new Date() },
    { id: 'prod-11', name: 'বিস্কুট', cost: 20, price: 25, stock: 5, category: 'স্ন্যাকস', lastUpdated: new Date() },
];

export const MOCK_SALES: Sale[] = [
    {
        id: 'sale-1',
        invoiceId: 'INV-1672531200000',
        items: [
            { id: 'prod-1', name: 'চাল', cost: 50, price: 60, quantity: 5, discount: 0, total: 300 },
            { id: 'prod-3', name: 'সয়াবিন তেল', cost: 150, price: 175, quantity: 2, discount: 5, total: 332.5 },
        ],
        totalPrice: 632.5,
        totalCost: 550, // (5*50) + (2*150) = 250 + 300
        totalProfit: 82.5,
        timestamp: new Date('2023-01-01T10:00:00Z'),
        soldBy: 'বিক্রয়কর্মী ১',
        soldById: 'user-staff1'
    },
    {
        id: 'sale-2',
        invoiceId: 'INV-1672617600000',
        items: [
            { id: 'prod-7', name: 'ডিম (ডজন)', cost: 120, price: 140, quantity: 2, discount: 0, total: 280 },
            { id: 'prod-6', name: 'দুধ (১ লিটার)', cost: 75, price: 85, quantity: 3, discount: 0, total: 255 },
        ],
        totalPrice: 535,
        totalCost: 465, // (2*120) + (3*75) = 240 + 225
        totalProfit: 70,
        timestamp: new Date('2023-01-02T12:30:00Z'),
        soldBy: 'প্রধান প্রশাসক',
        soldById: 'user-admin'
    }
];
