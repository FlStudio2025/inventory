
import React, { useContext } from 'react';
import { ModalContext } from '../../context/ModalContext';

const Modal: React.FC = () => {
    const { modalState, hideModal } = useContext(ModalContext);
    const { isOpen, title, message, isConfirm, onConfirm, isError } = modalState;

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        hideModal();
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-40 transition-opacity duration-300">
            <div className="bg-white p-6 rounded-xl shadow-main max-w-lg w-full transform scale-95 animate-scale-in">
                <h3 className={`text-xl font-bold mb-4 border-b pb-2 ${isError ? 'text-red-500' : 'text-primary'}`}>{title}</h3>
                <div className="mb-6 text-gray-700">{message}</div>
                <div className="flex justify-end space-x-3">
                    {isConfirm && (
                        <button onClick={hideModal} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">
                            বাতিল
                        </button>
                    )}
                    <button
                        onClick={isConfirm ? handleConfirm : hideModal}
                        className={`px-4 py-2 text-white rounded-lg ${isConfirm ? 'bg-primary hover:bg-primary-dark' : isError ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-dark'}`}
                    >
                        {isConfirm ? 'নিশ্চিত করুন' : 'বন্ধ করুন'}
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes scale-in {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default Modal;
