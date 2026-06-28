import { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStore debe ser usado dentro de un StoreProvider');
    }
    return context;
};
