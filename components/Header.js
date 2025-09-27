import Link from 'next/link';
import { useCart } from './CartContext';

export default function Header() {
  const { cart } = useCart();
  const count = cart.reduce((s, p) => s + p.qty, 0);
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <p className="text-2xl font-bold text-orange-600">MyShop</p>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/checkout"><p className="px-3 py-1 rounded-md hover:bg-gray-100">Checkout</p></Link>
          <div className="relative">
            <Link href="/checkout"><p className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-50 text-orange-600">Cart ({count})</p></Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
