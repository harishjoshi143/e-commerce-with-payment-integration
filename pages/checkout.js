import Head from 'next/head';
import Header from '../components/Header';
import { useCart } from '../components/CartContext';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Checkout() {
  const { cart, updateQty, removeFromCart, getTotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const total = getTotal();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const payWithRazorpay = async () => {
    if (!cart.length) return alert('Cart is empty');
    setLoading(true);
    // Create order on server
    const resp = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: total })
    });
    const order = await resp.json();

    const ok = await loadRazorpayScript();
    if (!ok) {
      setLoading(false);
      return alert('Unable to load Razorpay SDK');
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      amount: order.amount,
      currency: 'INR',
      name: 'MyShop',
      description: 'Test Transaction',
      order_id: order.id,
      handler: async function (response) {
        const verifyRes = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(response)
        });
        const verifyData = await verifyRes.json();
        if (verifyData.status === 'success') {
          alert('Payment successful!');
          clearCart();
          router.push('/');
        } else {
          alert('Payment verification failed');
        }
      },
      prefill: {
        name: '',
        email: '',
        contact: ''
      },
      theme: { color: '#F97316' }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      alert('Payment failed: ' + (response.error && response.error.description));
    });
    rzp.open();
    setLoading(false);
  };

  const cashOnDelivery = () => {
    alert('Order placed with Cash on Delivery (demo). In production save order server-side.');
    clearCart();
    router.push('/');
  };

  return (
    <div>
      <Head><title>Checkout — MyShop</title></Head>
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
        {cart.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-lg shadow">Your cart is empty.</div>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
                <img src={item.image} className="w-24 h-24 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-gray-500">₹{item.price} x {item.qty}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))} className="px-2 py-1 rounded bg-gray-100">-</button>
                  <div>{item.qty}</div>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-2 py-1 rounded bg-gray-100">+</button>
                  <button onClick={() => removeFromCart(item.id)} className="ml-4 text-sm text-red-500">Remove</button>
                </div>
              </div>
            ))}

            <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
              <div className="font-semibold">Total</div>
              <div className="text-xl font-bold">₹{total}</div>
            </div>

            <div className="flex gap-3">
              <button onClick={payWithRazorpay} className="btn-cta bg-orange-500 text-white flex-1">{loading ? 'Processing...' : 'Pay with Razorpay'}</button>
              <button onClick={cashOnDelivery} className="btn-cta border border-gray-200 bg-white flex-1">Cash on Delivery</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
