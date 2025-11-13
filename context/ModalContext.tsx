
import React, { createContext, useState, useCallback, ReactNode } from 'react';

interface ModalState {
    isOpen: boolean;
    title: string;
    message: React.ReactNode;
    isConfirm: boolean;
    onConfirm?: () => void;
    isError: boolean;
}

interface ModalContextType {
    modalState: ModalState;
    showAlert: (title: string, message: React.ReactNode, isError?: boolean) => void;
    showConfirm: (title: string, message: React.ReactNode, onConfirm: () => void) => void;
    hideModal: () => void;
}

const initialState: ModalState = {
    isOpen: false,
    title: '',
    message: '',
    isConfirm: false,
    onConfirm: undefined,
    isError: false,
};

export const ModalContext = createContext<ModalContextType>({
    modalState: initialState,
    showAlert: () => {},
    showConfirm: () => {},
    hideModal: () => {},
});

export const ModalProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [modalState, setModalState] = useState<ModalState>(initialState);

    const hideModal = useCallback(() => {
        setModalState(initialState);
    }, []);

    const showAlert = useCallback((title: string, message: React.ReactNode, isError = false) => {
        setModalState({
            isOpen: true,
            title,
            message,
            isConfirm: false,
            isError,
        });
    }, []);

    const showConfirm = useCallback((title: string, message: React.ReactNode, onConfirm: () => void) => {
        setModalState({
            isOpen: true,
            title,
            message,
            isConfirm: true,
            onConfirm,
            isError: false,
        });
    }, []);

    return (
        <ModalContext.Provider value={{ modalState, showAlert, showConfirm, hideModal }}>
            {children}
        </ModalContext.Provider>
    );
};
