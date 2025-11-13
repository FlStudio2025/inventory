
import React from 'react';

interface StatCardProps {
    label: string;
    value: string;
    borderColorClass: string;
    textColorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, borderColorClass, textColorClass }) => {
    return (
        <div className={`bg-white p-6 rounded-xl shadow-main border-l-4 ${borderColorClass}`}>
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${textColorClass}`}>{value}</p>
        </div>
    );
};

export default StatCard;
