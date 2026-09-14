
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
import { motion } from 'motion/react';
import Papa from 'papaparse';
import { WHY_US, SHEET_CSV_URL, REAL_PHOTOS, LOGO_URL, HERO_BG_URL } from './constants';
import { Category, Product, BadgeType } from './types';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import FAQSection from './components/FAQSection';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>('Tất cả');
  const [scrolled, setScrolled] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      const difference = endOfDay.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

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

      Papa.parse<string[]>(csvText, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          const dataRows = results.data.slice(1);

          const parsedProducts: Product[] = dataRows
            .map((columns, index) => {
              const clean = (val: string) => val?.trim() || '';
              if (columns.length < 7) return null;

              const category = clean(columns[0]) || 'Khác';
              const name = clean(columns[1]);
              const affiliateUrl = fixAffiliateUrl(clean(columns[3]));
              const imageUrl = fixImageUrl(clean(columns[4]));
              let original = parsePrice(clean(columns[5])); 
              let discounted = parsePrice(clean(columns[6]));

              const specifications = columns.length > 7 ? clean(columns[7]) : 'Thông số kỹ thuật chi tiết đang được cập nhật...';
              const features = columns.length > 8 ? clean(columns[8]) : 'Các chức năng nổi bật của sản phẩm đang được cập nhật...';
              const additionalImagesStr = columns.length > 9 ? clean(columns[9]) : '';
              const additionalImages = additionalImagesStr 
                ? additionalImagesStr.split(',').map(u => fixImageUrl(u)) 
                : [
                    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=800&auto=format&fit=crop"
                  ]; // Default dummy images for now

              if (discounted === 0 && original > 0) discounted = original;
              if (original === 0 && discounted > 0) original = discounted;
              if (original > 0 && discounted > original) {
                [original, discounted] = [discounted, original];
              }

              const badges: BadgeType[] = [];
              if (discounted < original) badges.push('Giảm sâu');

              const prod: Product = {
                id: `p-${index}`,
                name,
                category,
                originalPrice: original,
                discountedPrice: discounted,
                imageUrl,
                affiliateUrl,
                badges,
                specifications,
                features,
                additionalImages
              };
              return prod;
            })
            .filter((p): p is Product => p !== null && p.name !== '');

          setProducts(parsedProducts);
          setLastUpdated(new Date().toLocaleTimeString('vi-VN'));
        },
        error: (error: Error) => {
          console.error("Lỗi parse CSV:", error);
        }
      });
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
      <div className="bg-gray-950 text-white py-2 md:py-3 text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] md:tracking-[0.15em] z-[60] relative border-b border-gray-800">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-1.5 md:gap-2">
              <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-green-500"></span>
              </span>
              <span className="opacity-70 font-semibold tracking-wider">Hệ thống đồng bộ</span>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <span className="text-gray-500 hidden md:inline italic opacity-60 tracking-normal">Cập nhật: {lastUpdated}</span>
            <a href={`tel:${CONTACT.phone}`} className="text-[#EE4D2D] hover:text-white transition-colors flex items-center gap-1.5 md:gap-2 font-extrabold">
              <Phone size={12} className="md:w-[14px] md:h-[14px] fill-[#EE4D2D]" /> <span className="hidden sm:inline">{CONTACT.phone}</span>
            </a>
          </div>
        </div>
      </div>

      <header className="absolute top-9 md:top-11 left-0 right-0 z-50 bg-transparent py-6 md:py-12">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3 md:gap-5 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="p-1.5 md:p-2 rounded-xl md:rounded-2xl transition-all duration-500 shadow-lg bg-white flex items-center justify-center w-10 h-10 md:w-14 md:h-14">
              {LOGO_URL ? (
                <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <ShieldCheck className="text-[#EE4D2D] w-6 h-6 md:w-8 md:h-8" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight uppercase text-white leading-none">
                TỔNG KHO <span className="text-[#EE4D2D]">UV</span>
              </span>
              <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] sm:tracking-[0.4em] mt-1 md:mt-2 opacity-90 italic">Premium Catalog</span>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-5">
            <button onClick={fetchData} className="p-2 sm:p-3 md:p-4 rounded-xl md:rounded-2xl border bg-white hover:bg-gray-50 transition-all border-gray-100 hidden sm:flex shadow-sm">
              <RefreshCw size={18} className={`md:w-[22px] md:h-[22px] ${loading ? 'animate-spin text-[#EE4D2D]' : 'text-gray-400'}`} />
            </button>
            <a href={CONTACT.zalo} target="_blank" rel="noopener noreferrer" className="bg-[#EE4D2D] text-white px-6 sm:px-8 md:px-14 py-3 sm:py-3.5 md:py-4.5 rounded-xl md:rounded-2xl font-black text-xs sm:text-sm md:text-base shadow-xl md:shadow-2xl shadow-orange-200 hover:scale-[1.02] active:scale-95 transition-all uppercase italic tracking-wider">
              Kết nối Zalo
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 lg:pt-80 md:pb-64 overflow-hidden bg-gray-950">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
           {HERO_BG_URL ? (
             <>
               <img src={HERO_BG_URL} alt="Background" className="w-full h-full object-cover opacity-60" />
               <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/40 to-white"></div>
             </>
           ) : (
             <>
               <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-orange-50/70 rounded-full blur-[200px] opacity-50"></div>
               <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[180px] opacity-30"></div>
             </>
           )}
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10 mt-16 md:mt-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 md:gap-4 bg-white/10 backdrop-blur-md border border-white/20 px-6 sm:px-10 py-3 sm:py-4.5 rounded-full mb-12 sm:mb-20 shadow-xl group hover:bg-white/20 transition-colors"
          >
            <Zap size={16} className="text-orange-400 fill-orange-400 animate-pulse md:w-[18px] md:h-[18px]" />
            <span className="text-white text-[9px] sm:text-[11px] md:text-xs font-extrabold uppercase tracking-[0.15em] sm:tracking-[0.25em]">Cập nhật bảng giá ưu đãi hằng ngày</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-[72px] lg:text-[88px] font-black text-white mb-8 sm:mb-12 leading-[1.2] tracking-tight italic uppercase"
          >
            Kho <span className="text-[#EE4D2D]">Tủ Sấy UV</span> <br className="hidden md:block"/>
            <span className="relative inline-block mt-2 md:mt-4">Giá Tận Gốc Online</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-200 text-base sm:text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto mb-12 sm:mb-20 leading-[1.6] sm:leading-[1.8] font-medium italic px-4 sm:px-6 opacity-90"
          >
            Phân phối sỉ lẻ tủ sấy tia cực tím đa năng <br className="hidden md:block"/> 
            cho phòng khám và Spa.
          </motion.p>
          
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })} 
            className="group bg-[#EE4D2D] text-white px-12 sm:px-16 md:px-24 py-5 sm:py-6 md:py-8.5 rounded-[2rem] sm:rounded-[3rem] font-black text-lg sm:text-xl shadow-2xl shadow-orange-500/30 hover:bg-white hover:text-[#EE4D2D] transition-all transform hover:-translate-y-2 flex items-center justify-center gap-3 sm:gap-4 uppercase italic mx-auto active:scale-95"
          >
            Xem Ưu Đãi Ngay <ChevronRight className="w-6 h-6 md:w-9 md:h-9 group-hover:translate-x-2 md:group-hover:translate-x-3 transition-transform duration-300" />
          </motion.button>
        </div>
      </section>

      {/* Catalog Section - Adjusted Leading to prevent overlap */}
      <section id="catalog" className="py-20 md:py-32 lg:py-48 bg-gray-50/60 min-h-[900px] border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 md:mb-32 gap-10 md:gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <div className="inline-block bg-[#EE4D2D]/10 text-[#EE4D2D] px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-xl sm:rounded-2xl text-[10px] sm:text-[12px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-8 sm:mb-12">
                Authorized Distribution
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-[76px] font-black text-gray-950 mb-8 sm:mb-10 tracking-tight uppercase italic leading-[1.2]">
                Catalog Sản <br className="hidden sm:block"/> Phẩm Ưu Đãi
              </h2>
              <div className="flex flex-col gap-2 sm:gap-3 mt-4 sm:mt-6">
                <p className="text-[#EE4D2D] text-base sm:text-lg md:text-xl font-bold italic uppercase tracking-wider">
                  ⚠️ Ưu đãi kết thúc sau:
                </p>
                <div className="flex gap-3 sm:gap-4 items-center">
                  <div className="flex flex-col items-center">
                    <div className="bg-[#EE4D2D] text-white text-2xl sm:text-3xl md:text-4xl font-black rounded-lg sm:rounded-xl w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center shadow-lg shadow-orange-500/30">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <span className="text-gray-500 font-bold mt-1.5 sm:mt-2 text-[10px] sm:text-xs md:text-sm uppercase tracking-wider">Giờ</span>
                  </div>
                  <span className="text-[#EE4D2D] text-2xl sm:text-3xl md:text-4xl font-black mb-6 sm:mb-7">:</span>
                  <div className="flex flex-col items-center">
                    <div className="bg-[#EE4D2D] text-white text-2xl sm:text-3xl md:text-4xl font-black rounded-lg sm:rounded-xl w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center shadow-lg shadow-orange-500/30">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <span className="text-gray-500 font-bold mt-1.5 sm:mt-2 text-[10px] sm:text-xs md:text-sm uppercase tracking-wider">Phút</span>
                  </div>
                  <span className="text-[#EE4D2D] text-2xl sm:text-3xl md:text-4xl font-black mb-6 sm:mb-7">:</span>
                  <div className="flex flex-col items-center">
                    <div className="bg-[#EE4D2D] text-white text-2xl sm:text-3xl md:text-4xl font-black rounded-lg sm:rounded-xl w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center shadow-lg shadow-orange-500/30 animate-pulse">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <span className="text-gray-500 font-bold mt-1.5 sm:mt-2 text-[10px] sm:text-xs md:text-sm uppercase tracking-wider">Giây</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex overflow-x-auto gap-3 sm:gap-4 pb-6 sm:pb-10 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-8 sm:px-14 py-4 sm:py-6 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm md:text-base transition-all duration-400 border-2 ${
                    activeCategory === cat 
                      ? 'bg-[#EE4D2D] border-[#EE4D2D] text-white shadow-xl shadow-orange-200/50' 
                      : 'bg-white border-transparent text-gray-400 hover:bg-gray-100 hover:text-gray-950'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 md:py-64">
              <div className="w-16 h-16 md:w-24 md:h-24 border-4 md:border-[7px] border-orange-50 border-t-[#EE4D2D] rounded-full animate-spin mb-8 md:mb-14"></div>
              <p className="text-gray-400 font-black uppercase tracking-[0.2em] md:tracking-[0.4em] animate-pulse italic text-xs md:text-base">Đang đồng bộ danh mục từ tổng kho...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-10 md:gap-14">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onClick={setSelectedProduct} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Real Photos Section */}
      <section className="py-16 md:py-32 bg-gray-950 text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-6xl mx-auto mb-10 md:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl md:text-[56px] lg:text-[64px] font-black tracking-tight uppercase italic leading-[1.2] mb-4">
              Ảnh Sản Phẩm <span className="text-[#EE4D2D]">Thực Tế</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg md:text-xl font-medium leading-[1.7] italic max-w-2xl mx-auto px-4">
              Hình ảnh thực tế các dòng tủ sấy tiệt trùng UV được phân phối trực tiếp từ tổng kho đến tay khách hàng.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {REAL_PHOTOS.map((photo, idx) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                key={idx} 
                className="relative group overflow-hidden rounded-3xl aspect-[4/3] bg-gray-900"
              >
                <img 
                  src={photo} 
                  alt={`Ảnh thực tế tủ sấy UV ${idx + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us - Adjusted Leading to 1.2 */}
      <section className="py-24 md:py-48 lg:py-64 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-6xl mx-auto mb-16 md:mb-32 lg:mb-40"
          >
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[82px] font-black text-gray-950 tracking-tight uppercase italic leading-[1.2] mb-2 sm:mb-4">
              Lợi thế cạnh tranh tại
            </h2>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[82px] font-black text-[#EE4D2D] tracking-tight uppercase italic leading-[1.2]">
              Tổng Kho Tủ Sấy UV
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-14">
            {WHY_US.map((item, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                key={idx} 
                className="bg-gray-50/70 p-10 sm:p-12 md:p-16 rounded-[3rem] md:rounded-[4.5rem] hover:bg-orange-50/60 transition-all duration-700 group border border-transparent hover:border-orange-100 flex flex-col items-center text-center"
              >
                <div className="bg-white w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-10 md:mb-14 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                  {item.icon}
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-950 mb-6 md:mb-8 tracking-normal uppercase italic leading-tight">{item.title}</h3>
                <p className="text-gray-500 font-medium leading-[1.6] sm:leading-[1.8] italic text-sm sm:text-base md:text-lg opacity-80 px-2 md:px-4">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection />

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-500 py-24 md:py-48 border-t border-gray-900 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-12 sm:mb-16 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            {LOGO_URL ? (
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white rounded-xl sm:rounded-2xl p-2 shadow-lg">
                <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
              </div>
            ) : (
              <ShieldCheck className="text-[#EE4D2D] w-12 h-12 sm:w-16 sm:h-16" />
            )}
            <span className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
              TỔNG KHO <span className="text-[#EE4D2D]">UV</span>
            </span>
          </div>
          <p className="text-base sm:text-xl md:text-2xl opacity-60 mb-12 sm:mb-20 italic max-w-5xl mx-auto leading-[1.6] sm:leading-[1.8] tracking-normal px-4 sm:px-0">
            Mạng lưới phân phối tủ sấy tiệt trùng UV hàng đầu Việt Nam. <br className="hidden md:block"/> Cam kết sản phẩm chính hãng, chất lượng cao & mức giá tối ưu nhất cho đối tác.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto mb-16 sm:mb-20 text-center px-4 sm:px-0">
            <div className="bg-gray-900/50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-800 hover:border-gray-700 transition-colors">
              <h4 className="text-white font-black uppercase tracking-widest mb-3 sm:mb-4 text-xs sm:text-sm">Hotline Hỗ Trợ</h4>
              <a href="tel:0369333910" className="text-[#EE4D2D] font-black text-2xl sm:text-3xl hover:text-white transition-colors">0369333910</a>
            </div>
            <div className="bg-gray-900/50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-800 hover:border-gray-700 transition-colors">
              <h4 className="text-white font-black uppercase tracking-widest mb-4 text-sm">Chi Nhánh Hà Nội</h4>
              <p className="text-gray-400 font-medium text-lg leading-relaxed">369 Tô Hiệu<br/>Cầu Giấy, Hà Nội</p>
            </div>
            <div className="bg-gray-900/50 p-8 rounded-3xl border border-gray-800 hover:border-gray-700 transition-colors">
              <h4 className="text-white font-black uppercase tracking-widest mb-4 text-sm">Chi Nhánh TP.HCM</h4>
              <p className="text-gray-400 font-medium text-lg leading-relaxed">310 Tô Hiến Thành<br/>Quận 10, Hồ Chí Minh</p>
            </div>
          </div>
          
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
          className="fixed bottom-14 right-14 bg-[#EE4D2D] text-white p-6.5 rounded-[1.8rem] shadow-2xl z-[70] hover:scale-110 active:scale-90 transition-all border-2 border-white/10 hidden md:block"
        >
          <ArrowUp size={36} />
        </button>
      )}

      {/* Floating Call CTA */}
      <a 
        href={`tel:${CONTACT.phone}`}
        className="fixed bottom-8 left-8 md:bottom-14 md:left-14 z-[70] group flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-[#EE4D2D] rounded-full animate-ping opacity-60 duration-1000"></div>
        <div className="relative bg-[#EE4D2D] text-white p-4 md:p-5 rounded-full shadow-2xl transition-transform duration-300 group-hover:scale-110 border-2 border-white/20 flex items-center justify-center">
          <Phone size={28} className="md:w-8 md:h-8" />
        </div>
      </a>

      {/* Product Details Modal */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};

export default App;
