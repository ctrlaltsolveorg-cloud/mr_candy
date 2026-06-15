'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Product } from '@/types';
import { Plus, Minus, Package, Home, Sparkles, TrendingUp, ArrowUpDown, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function MotherPanel() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'stock'>('newest');

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
      applySorting(data, sortBy);
    } catch (error) { toast.error('Failed to load products'); } finally { setLoading(false); }
  };

  const applySorting = (list: Product[], type: 'newest' | 'stock') => {
    const sorted = [...list];
    if (type === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else if (type === 'stock') {
      sorted.sort((a, b) => a.retailStock - b.retailStock);
    }
    setDisplayProducts(sorted);
  };

  // Re-sort only when sortBy changes
  useEffect(() => {
    if (products.length > 0) {
      applySorting(products, sortBy);
    }
  }, [sortBy]);

  const updateStock = async (id: string, type: 'add' | 'deduct') => {
    try {
      const endpoint = type === 'add' ? `/products/${id}/add-stock` : `/products/${id}/deduct-stock`;
      const { data } = await api.post(endpoint, { multiplier: 1 });

      // Update both raw products and the currently displayed list (maintain position)
      setProducts(prev => prev.map(p => p.id === id ? data : p));
      setDisplayProducts(prev => prev.map(p => p.id === id ? data : p));

      toast.success(`${type === 'add' ? 'Increased' : 'Reduced'} inventory!`);
    } catch (error) { toast.error('Inventory limit reached!'); }
  };

  const renderPhoto = (url: string | null) => {
    if (!url) return <Package className="w-12 h-12 text-stone-300" strokeWidth={1} />;
    const fullUrl = url.startsWith('http') ? url : `http://localhost:4000${url}`;
    return <img src={fullUrl} alt="product" className="w-full h-full object-cover" />;
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FFFBF7] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-16 h-16 border-4 border-[#F43F5E] border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFBF7] p-6 sm:p-12 text-[#1C1917]">
      <header className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex-1">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-6 mb-4">
                <button onClick={() => router.push('/')} className="p-4 bg-white rounded-[24px] shadow-xl shadow-orange-100/50 border border-orange-50 text-stone-900 hover:bg-[#1C1917] hover:text-white transition-all">
                    <Home size={24} strokeWidth={2.5} />
                </button>
                <span className="bg-orange-100 text-orange-700 px-5 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase border border-orange-200">Inventory Hub</span>
            </motion.div>
            <h1 className="text-6xl font-black tracking-tighter leading-none mb-4">Stock <span className="text-[#F43F5E]">Control</span></h1>
            
            <div className="flex items-center gap-3 mt-8">
                <button 
                  onClick={() => setSortBy('newest')}
                  className={`px-6 py-3 rounded-2xl font-black text-xs tracking-widest uppercase transition-all flex items-center gap-2 border-2 ${sortBy === 'newest' ? 'bg-[#1C1917] text-white border-[#1C1917]' : 'bg-white text-stone-400 border-stone-100 hover:border-orange-200'}`}
                >
                  <Sparkles size={14} /> Newest First
                </button>
                <button 
                  onClick={() => setSortBy('stock')}
                  className={`px-6 py-3 rounded-2xl font-black text-xs tracking-widest uppercase transition-all flex items-center gap-2 border-2 ${sortBy === 'stock' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-stone-400 border-stone-100 hover:border-indigo-100'}`}
                >
                  <ArrowUpDown size={14} /> Low Stock First
                </button>
                <button 
                  onClick={() => applySorting(products, sortBy)}
                  className="p-3 bg-white text-stone-400 rounded-2xl border-2 border-stone-100 hover:bg-[#1C1917] hover:text-white hover:border-[#1C1917] transition-all group"
                  title="Refresh Arrangement"
                >
                  <RefreshCw size={20} className="group-active:rotate-180 transition-transform duration-500" />
                </button>
            </div>
        </div>
        <div className="hidden lg:flex gap-8 items-center bg-white p-8 rounded-[40px] border border-orange-50 shadow-xl shadow-orange-100/30">
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-1">Total SKUs</span>
                <span className="text-3xl font-black">{products.length} Items</span>
            </div>
            <div className="w-[1px] h-12 bg-orange-100" />
            <TrendingUp size={32} className="text-emerald-500" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayProducts.map((product) => (
          <motion.div layout initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} key={product.id} className="bg-white rounded-[56px] shadow-2xl shadow-orange-100/40 border-4 border-white hover:border-orange-50 transition-all duration-500 p-8 flex flex-col group">
            <div className="flex items-center gap-6 mb-10">
              <div className="w-32 h-32 bg-[#FFFBF7] rounded-[40px] overflow-hidden flex items-center justify-center border-2 border-orange-50 shadow-inner group-hover:rotate-3 transition-transform duration-500">
                {renderPhoto(product.photoUrl)}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-[#1C1917] mb-2 tracking-tight group-hover:text-[#F43F5E] transition-colors">{product.name}</h3>
                <div className="bg-orange-50/50 px-4 py-2 rounded-2xl inline-block border border-orange-100/50">
                    <span className="text-2xl font-black text-indigo-600 leading-none">{product.retailStock}</span>
                    <span className="text-xs font-black text-indigo-400 uppercase ml-2 tracking-widest">{product.unit}</span>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 rounded-[40px] p-4 flex items-center justify-between border-2 border-white shadow-inner relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[2px] bg-white hidden sm:block" />
              
              <button
                onClick={() => updateStock(product.id, 'deduct')}
                disabled={product.retailStock < product.wholesaleUnitQty}
                className={`w-20 h-20 flex items-center justify-center rounded-[30px] shadow-2xl transition-all active:scale-90 ${
                  product.retailStock < product.wholesaleUnitQty 
                  ? 'bg-white text-stone-200 cursor-not-allowed shadow-none border border-stone-100' 
                  : 'bg-white text-rose-500 hover:bg-rose-500 hover:text-white border-4 border-white shadow-rose-100'
                }`}
              >
                <Minus size={32} strokeWidth={4} />
              </button>
              
              <div className="text-center z-10">
                <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-1">Batch</p>
                <p className="text-xl font-black text-stone-900">±{product.wholesaleUnitQty}</p>
              </div>

              <button
                onClick={() => updateStock(product.id, 'add')}
                className="w-20 h-20 flex items-center justify-center bg-[#1C1917] text-white rounded-[30px] shadow-2xl shadow-stone-300 hover:bg-[#F43F5E] transition-all active:scale-90 border-4 border-[#1C1917]"
              >
                <Plus size={32} strokeWidth={4} />
              </button>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-2 text-stone-300">
                <Sparkles size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Smart Inventory Sync</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-32 text-center opacity-20 hover:opacity-100 transition-opacity duration-1000">
          <p className="text-[10px] font-black tracking-[1em] uppercase ml-[1em]">End of Operations</p>
      </div>
    </div>
  );
}
