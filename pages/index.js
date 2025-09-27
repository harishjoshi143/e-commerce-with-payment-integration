import Head from 'next/head';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { products } from '../lib/products';

export default function Home() {
  return (
    <div>
      <Head>
        <title>MyShop — Demo</title>
      </Head>
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Featured Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </main>
    </div>
  );
}
