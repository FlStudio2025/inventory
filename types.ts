
export interface User {
    id: string;
    username: string;
    password?: string; // Should not be stored long-term
    role: 'admin' | 'staff';
    name: string;
}

export interface Product {
    id: string;
    name: string;
    cost: number;
    price: number;
    stock: number;
    category: string;
    lastUpdated: Date;
}

export interface CartItem {
    id: string;
    name: string;
    price: number;
    cost: number;
    quantity: number;
    discount: number;
    total: number;
}

export interface Sale {
    id: string;
    items: CartItem[];
    totalPrice: number;
    totalCost: number;
    totalProfit: number;
    timestamp: Date;
    soldBy: string;
    soldById: string;
    invoiceId: string;
}

// FIX: Define AuthContextType to provide a type for the AuthContext value.
export interface AuthContextType {
    loggedInUser: User | null;
    isAuthReady: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    changePassword: (currentPass: string, newPass: string) => Promise<boolean>;
}
