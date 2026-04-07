
import React, { useState } from 'react';
import { Product } from '../types';
import { ExternalLink, ImageOff } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imgError, setImgError] = useState(false);

  const formatPrice = (price: number) => {
    if (!price || price === 0) return "Liên hệ giá";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getBadgeClass = (badge: string) => {
    switch (badge) {
      case 'Deal hot': return 'bg-red-500 text-white';
      case 'Bán chạy': return 'bg-orange-500 text-white';
      case 'Giảm sâu': return 'bg-purple-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const isSale = product.originalPrice > product.discountedPrice && product.discountedPrice > 0;
  const discountPercent = isSale 
    ? Math.round((1 - product.discountedPrice / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full relative"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50 flex items-center justify-center">
        {!imgError ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            onError={() => setImgError(true)}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-4 bg-gray-50">
            <ImageOff size={44} strokeWidth={1} />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-center px-4 leading-relaxed">Hình ảnh đang cập nhật</span>
          </div>
        )}
        
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.badges.map((badge) => (
            <span key={badge} className={`px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider shadow-lg ${getBadgeClass(badge)}`}>
              {badge}
            </span>
          ))}
          {isSale && (
            <span className="bg-yellow-400 text-gray-950 px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase shadow-lg animate-pulse">
              -{discountPercent}%
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4 md:p-6 flex flex-col flex-grow bg-white">
        <h3 className="text-sm md:text-base font-bold text-gray-800 line-clamp-2 mb-4 h-[3rem] group-hover:text-[#EE4D2D] transition-colors leading-[1.45] tracking-tight">
          {product.name}
        </h3>
        
        <div className="mt-auto">
          <div className="flex flex-col mb-5 min-h-[56px] justify-end">
            {isSale ? (
              <>
                <span className="text-[11px] md:text-xs text-gray-400 line-through font-semibold opacity-60 tracking-tighter">
                  {formatPrice(product.originalPrice)}
                </span>
                <div className="text-lg md:text-2xl font-black text-[#EE4D2D] tracking-tighter italic leading-none mt-2">
                  {formatPrice(product.discountedPrice)}
                </div>
              </>
            ) : (
              <div className="text-lg md:text-2xl font-black text-gray-900 tracking-tighter italic leading-none">
                {formatPrice(product.discountedPrice || product.originalPrice)}
              </div>
            )}
          </div>
          
          <a 
            href={product.affiliateUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 bg-[#EE4D2D] text-white py-4 rounded-2xl font-black text-xs md:text-sm hover:bg-gray-950 transition-all shadow-xl shadow-orange-100 active:scale-95 transform uppercase italic tracking-wider"
          >
            Mua Ngay <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
