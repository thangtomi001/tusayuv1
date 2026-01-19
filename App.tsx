
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, 
  Facebook, 
  MessageCircle, 
  ShieldCheck, 
  Phone, 
  RefreshCw, 
  Zap, 
  ArrowUp 
} from 'lucide-react';
import { WHY_US, SHEET_CSV_URL } from './constants';
import { Category, Product, BadgeType } from './types';
import ProductCard from './components/ProductCard';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>('Tất cả');
  const [scrolled, setScrolled] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const CONTACT = {
    phone: "0369333910",
    zalo: "https://zalo.me/0369333910",
    facebook: "https://www.facebook.com/tongkhotusaytiettrung",
    address: "Tổng Kho Tủ Sấy UV, TP. Hồ Chí Minh & Hà Nội",
    messenger: "http://m.me/766052539915218"
  };

  const fixImageUrl = (url: string) => {
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return 'https://via.placeholder.com/600x600?text=H%C3%ACnh+%E1%BA%A3nh+đang+cập+nhật';
    }
    const trimmedUrl = url.trim();
    if (trimmedUrl.includes('drive.google.com')) {
      let driveId = '';
      const dMatch = trimmedUrl.match(/\/d\/([a-zA-Z0-9_-]{25,})/);
      if (dMatch && dMatch[1]) driveId = dMatch[1];
      else {
        const idMatch = trimmedUrl.match(/[?&]id=([a-zA-Z0-9_-]{25,})/);
        if (idMatch && idMatch[1]) driveId = idMatch[1];
      }
      if (driveId) return `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`;
    }
    return trimmedUrl;
  };

  const fixAffiliateUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed || trimmed === '#' || trimmed === '') return CONTACT.messenger;
    if (trimmed.startsWith('m.me')) return `https://${trimmed}`;
    if (!trimmed.startsWith('http')) return `https://${trimmed}`;
    return trimmed;
  };

  const parsePrice = (val: any): number => {
    if (!val) return 0;
    const cleanValue = val.toString()
      .replace(/[.\s,đĐvVnNlL-]/g, '')
      .trim();
    return parseInt(cleanValue, 10) || 0;
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    fetchData();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${SHEET_CSV_URL}&t=${new Date().getTime()}`);
      if (!response.ok) throw new Error('Không thể tải dữ liệu');
      const csvText = await response.text();
      const lines = csvText.split(/\r?\n/);
      const dataRows = lines.slice(1).filter(line => line.trim().length > 10); 

      const parsedProducts: Product[] = dataRows
        .map((line, index) => {
          const columns = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          const clean = (val: string) => val?.replace(/^"|"$/g, '').trim() || '';
          if (columns.length < 7) return null;

          const category = clean(columns[0]) || 'Khác';
          const name = clean(columns[1]);
          const affiliateUrl = fixAffiliateUrl(clean(columns[3]));
          const imageUrl = fixImageUrl(clean(columns[4]));
          let original = parsePrice(clean(columns[5])); 
          let discounted = parsePrice(clean(columns[6]));

          if (discounted === 0 && original > 0) discounted = original;
          if (original === 0 && discounted > 0) original = discounted;
          if (original > 0 && discounted > original) {
            [original, discounted] = [discounted, original];
          }

          const badges: BadgeType[] = [];
          if (discounted < original) badges.push('Giảm sâu');

          return {
            id: `p-${index}`,
            name,
            category,
            originalPrice: original,
            discountedPrice: discounted,
            imageUrl,
            affiliateUrl,
            badges
          };
        })
        .filter((p): p is Product => p !== null && p.name !== '');

      setProducts(parsedProducts);
      setLastUpdated(new Date().toLocaleTimeString('vi-VN'));
    } catch (err) {
      console.error("Lỗi đồng bộ:", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
    return ['Tất cả', ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Tất cả') return products;
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory, products]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-orange-100 selection:text-orange-600 bg-white antialiased">
      {/* Top Bar Status */}
      <div className="bg-gray-950 text-white py-3 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] z-[60] relative border-b border-gray-800">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="opacity-70 font-semibold tracking-wider">Hệ thống đồng bộ trực tuyến</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-gray-500 hidden md:inline italic opacity-60 tracking-normal">Cập nhật: {lastUpdated}</span>
            <a href={`tel:${CONTACT.phone}`} className="text-[#EE4D2D] hover:text-white transition-colors flex items-center gap-2 font-extrabold">
              <Phone size={14} className="fill-[#EE4D2D]" /> {CONTACT.phone}
            </a>
          </div>
        </div>
      </div>

      <header className={`fixed top-11 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 shadow-xl py-4 top-0 backdrop-blur-md border-b border-gray-100' : 'bg-transparent py-12'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-5 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className={`p-3.5 rounded-2xl transition-all duration-500 shadow-lg ${scrolled ? 'bg-[#EE4D2D]' : 'bg-white'}`}>
              <ShieldCheck className={scrolled ? 'text-white w-8 h-8' : 'text-[#EE4D2D] w-8 h-8'} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-black tracking-tight uppercase text-gray-950 leading-none">
                TỔNG KHO <span className="text-[#EE4D2D]">UV</span>
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mt-2 opacity-70 italic">Premium Catalog</span>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <button onClick={fetchData} className="p-4 rounded-2xl border bg-white hover:bg-gray-50 transition-all border-gray-100 hidden sm:flex shadow-sm">
              <RefreshCw size={22} className={`${loading ? 'animate-spin text-[#EE4D2D]' : 'text-gray-400'}`} />
            </button>
            <a href={CONTACT.zalo} target="_blank" rel="noopener noreferrer" className="bg-[#EE4D2D] text-white px-10 md:px-14 py-4.5 rounded-2xl font-black text-sm md:text-base shadow-2xl shadow-orange-200 hover:scale-[1.02] active:scale-95 transition-all uppercase italic tracking-wider">
              Kết nối Zalo
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-64 pb-32 md:pt-80 md:pb-64 overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
           <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-orange-50/70 rounded-full blur-[200px] opacity-50"></div>
           <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[180px] opacity-30"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-4 bg-white border border-gray-100 px-10 py-4.5 rounded-full mb-20 shadow-xl shadow-gray-100/50 group hover:border-orange-200 transition-colors">
            <Zap size={18} className="text-orange-500 fill-orange-500 animate-pulse" />
            <span className="text-gray-900 text-[11px] md:text-xs font-extrabold uppercase tracking-[0.25em]">Cập nhật bảng giá ưu đãi hằng ngày</span>
          </div>
          
          <h1 className="text-5xl md:text-[88px] font-black text-gray-950 mb-12 leading-[1.2] tracking-tight italic uppercase">
            Kho <span className="text-[#EE4D2D]">Tủ Sấy UV</span> <br className="hidden md:block"/>
            <span className="relative inline-block mt-4">Giá Tận Gốc Online</span>
          </h1>
          
          <p className="text-gray-500 text-lg md:text-2xl max-w-4xl mx-auto mb-20 leading-[1.8] font-medium italic px-6 opacity-70">
            Phân phối sỉ lẻ thiết bị tiệt trùng tia cực tím chuyên dụng <br className="hidden md:block"/> 
            cho gia đình, nhà hàng, Spa & cơ sở y tế.
          </p>
          
          <button 
            onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })} 
            className="group bg-[#EE4D2D] text-white px-24 py-8.5 rounded-[3rem] font-black text-xl shadow-2xl shadow-orange-300/40 hover:bg-gray-950 transition-all transform hover:-translate-y-2.5 flex items-center justify-center gap-4 uppercase italic mx-auto active:scale-95"
          >
            Xem Ưu Đãi Ngay <ChevronRight size={36} className="group-hover:translate-x-3 transition-transform duration-300" />
          </button>
        </div>
      </section>

      {/* Catalog Section - Adjusted Leading to prevent overlap */}
      <section id="catalog" className="py-48 bg-gray-50/60 min-h-[900px] border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-32 gap-16">
            <div className="max-w-3xl">
              <div className="inline-block bg-[#EE4D2D]/10 text-[#EE4D2D] px-8 py-3.5 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] mb-12">
                Authorized Distribution
              </div>
              <h2 className="text-5xl md:text-[76px] font-black text-gray-950 mb-10 tracking-tight uppercase italic leading-[1.2]">
                Catalog Sản <br className="hidden sm:block"/> Phẩm Ưu Đãi
              </h2>
              <p className="text-gray-500 text-xl md:text-2xl font-medium leading-[1.7] italic opacity-70 max-w-xl">
                Toàn bộ dữ liệu được cập nhật tự động từ kho tổng theo thời gian thực.
              </p>
            </div>
            
            <div className="flex overflow-x-auto gap-4 pb-10 no-scrollbar -mx-4 px-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-14 py-6 rounded-2xl font-black text-sm md:text-base transition-all duration-400 border-2 ${
                    activeCategory === cat 
                      ? 'bg-[#EE4D2D] border-[#EE4D2D] text-white shadow-xl shadow-orange-200/50' 
                      : 'bg-white border-transparent text-gray-400 hover:bg-gray-100 hover:text-gray-950'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-64">
              <div className="w-24 h-24 border-[7px] border-orange-50 border-t-[#EE4D2D] rounded-full animate-spin mb-14"></div>
              <p className="text-gray-400 font-black uppercase tracking-[0.4em] animate-pulse italic">Đang đồng bộ danh mục từ tổng kho...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 md:gap-14">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Us - Adjusted Leading to 1.2 */}
      <section className="py-64 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-6xl mx-auto mb-40">
            <h2 className="text-5xl md:text-[82px] font-black text-gray-950 tracking-tight uppercase italic leading-[1.2] mb-4">
              Lợi thế cạnh tranh tại
            </h2>
            <h2 className="text-5xl md:text-[82px] font-black text-[#EE4D2D] tracking-tight uppercase italic leading-[1.2]">
              Tổng Kho Tủ Sấy UV
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">
            {WHY_US.map((item, idx) => (
              <div key={idx} className="bg-gray-50/70 p-16 rounded-[4.5rem] hover:bg-orange-50/60 transition-all duration-700 group border border-transparent hover:border-orange-100 flex flex-col items-center text-center">
                <div className="bg-white w-32 h-32 rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-14 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                  {item.icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-gray-950 mb-8 tracking-normal uppercase italic leading-tight">{item.title}</h3>
                <p className="text-gray-500 font-medium leading-[1.8] italic text-base md:text-lg opacity-80 px-4">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-500 py-48 border-t border-gray-900 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-6 mb-16 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <ShieldCheck className="text-[#EE4D2D] w-16 h-16" />
            <span className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
              TỔNG KHO <span className="text-[#EE4D2D]">UV</span>
            </span>
          </div>
          <p className="text-xl md:text-2xl opacity-60 mb-24 italic max-w-5xl mx-auto leading-[1.8] tracking-normal">
            Mạng lưới phân phối tủ sấy tiệt trùng UV hàng đầu Việt Nam. <br className="hidden md:block"/> Cam kết sản phẩm đạt chuẩn y tế & mức giá tối ưu nhất cho đối tác.
          </p>
          
          <div className="flex justify-center gap-12 mb-28">
            <a href={CONTACT.facebook} target="_blank" className="w-24 h-24 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-blue-600 transition-all shadow-2xl hover:-translate-y-3"><Facebook size={36} /></a>
            <a href={CONTACT.zalo} target="_blank" className="w-24 h-24 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-[#EE4D2D] transition-all shadow-2xl hover:-translate-y-3"><MessageCircle size={36} /></a>
          </div>
          
          <div className="max-w-6xl mx-auto border-t border-gray-900 pt-24">
            <p className="text-[13px] font-black uppercase tracking-[0.7em] opacity-40 italic">
              © 2024 Tổng Kho Tủ Sấy UV • Professional Distribution Network
            </p>
          </div>
        </div>
      </footer>

      {scrolled && (
        <button 
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
          className="fixed bottom-14 right-14 bg-[#EE4D2D] text-white p-6.5 rounded-[1.8rem] shadow-2xl z-[70] hover:scale-110 active:scale-90 transition-all border-2 border-white/10"
        >
          <ArrowUp size={36} />
        </button>
      )}
    </div>
  );
};

export default App;
