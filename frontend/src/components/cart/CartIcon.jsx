import { NavLink } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";

function CartIcon() {
  const { getCartCount } = useCart();

  const cartCount = getCartCount();

  return (
    <NavLink
      to="/carrito"
      className="relative flex items-center text-slate-700 transition hover:text-violet-600"
    >
      <ShoppingCart size={22} />

      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </NavLink>
  );
}

export default CartIcon;