'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Order } from '@/types';
import { Package, Search, Calendar, User, MapPin, Phone, Hash, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchName] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    }
  };

  const filteredOrders = orders.filter(order => 
    order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerPhone?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 text-slate-900">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">Order Management</h1>
            <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em]">Customer Details & Tracking</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={e => setSearchName(e.target.value)}
              className="w-full pl-12 pr-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold shadow-sm"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden group hover:border-indigo-200 transition-all">
              <div className="flex flex-col lg:flex-row">
                {/* Left: Order Meta */}
                <div className="p-8 lg:w-1/4 bg-slate-50 border-r border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black mb-1">₹{order.totalAmount}</h3>
                  <div className="flex items-center text-slate-400 text-xs font-bold gap-2 mb-6">
                    <Calendar size={14} /> {new Date(order.createdAt).toLocaleString()}
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-inner">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order OTP</p>
                    <p className="text-3xl font-black text-indigo-600 tracking-widest">{order.otp}</p>
                  </div>
                </div>

                {/* Middle: Customer Details */}
                <div className="p-8 lg:w-2/4 flex flex-col justify-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                            <User size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-xl font-black">{order.customerName || 'Walk-in Customer'}</p>
                            <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                                <Phone size={14} /> {order.customerPhone || 'No Phone'}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 shadow-sm border border-rose-100 mt-1 flex-shrink-0">
                            <MapPin size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-700 leading-snug">{order.address || 'N/A'}</p>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                                <Hash size={12} /> PIN: {order.pincode || '000000'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Items List */}
                <div className="p-8 lg:w-1/4 bg-slate-50/50 flex flex-col border-l border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Items Summary</p>
                    <div className="space-y-3 overflow-y-auto max-h-40 pr-2 custom-scrollbar">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                <span className="font-bold text-slate-700 truncate mr-2">{item.product.name}</span>
                                <span className="font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-xs">x{item.quantity}</span>
                            </div>
                        ))}
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
              <Package size={64} className="mx-auto text-slate-200 mb-6" />
              <p className="text-2xl font-black text-slate-300 uppercase tracking-widest">No Orders Found</p>
          </div>
        )}
      </div>
    </div>
  );
}
