import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useCart } from './CartContext';

export default function ProductCard({ product }) {
  const ref = useRef();
  const { addToCart } = useCart();

  useEffect(() => {
    const el = ref.current;
    gsap.from(el, { y: 16, opacity: 0, duration: 0.6, ease: 'power3.out' });
  }, []);

  return (
    <div ref={ref} className="bg-white rounded-2xl shadow-md overflow-hidden">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{product.desc}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-orange-600 font-bold">₹{product.price}</div>
          <button onClick={() => addToCart(product)} className="btn-cta bg-orange-500 text-white hover:bg-orange-600">Add</button>
        </div>
      </div>
    </div>
  );
}
