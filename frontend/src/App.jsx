import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { StoreProvider } from './context/StoreContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <StoreProvider>
          <AppRoutes />
        </StoreProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
