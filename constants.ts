import React from 'react';

// FIX: Define an interface for navigation items for strong typing.
interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    roles: ('admin' | 'staff')[];
}

// FIX: Apply the NavItem type to the NAV_ITEMS array.
// FIX: Add missing 'roles' property to each nav item and call icon functions to avoid JSX in .ts file.
export const NAV_ITEMS: NavItem[] = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: DashboardIcon(), roles: ['admin', 'staff'] },
    { id: 'sales', label: 'বিক্রয় (POS)', icon: SalesIcon(), roles: ['admin', 'staff'] },
    { id: 'products', label: 'প্রোডাক্ট ম্যানেজমেন্ট', icon: ProductsIcon(), roles: ['admin'] },
    { id: 'reports', label: 'রিপোর্ট ও বিশ্লেষণ', icon: ReportsIcon(), roles: ['admin'] },
];

// FIX: Convert icon components from JSX to React.createElement to be valid in a .ts file.
function DashboardIcon() {
    return React.createElement('svg', {className: "w-5 h-5 mr-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg"}, 
        React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6m-6 0h-2a1 1 0 01-1-1v-4m0 0h5m-5 0v-4"})
    );
}
// FIX: Convert icon components from JSX to React.createElement to be valid in a .ts file.
function SalesIcon() {
    return React.createElement('svg', {className: "w-5 h-5 mr-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg"}, 
        React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"})
    );
}
// FIX: Convert icon components from JSX to React.createElement to be valid in a .ts file.
function ProductsIcon() {
    return React.createElement('svg', {className: "w-5 h-5 mr-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg"}, 
        React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"})
    );
}
// FIX: Convert icon components from JSX to React.createElement to be valid in a .ts file.
function ReportsIcon() {
    return React.createElement('svg', {className: "w-5 h-5 mr-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg"}, 
        React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"})
    );
}
