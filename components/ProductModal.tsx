import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, ShieldCheck, ChevronRight, CheckCircle2, ShoppingCart, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Product } from '../types';
import { ORDER_SCRIPT_URL } from '../constants';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'features'>('specs');
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  if (!product) return null;

  const currentMainImage = mainImage || product.imageUrl;
  
  const allImages = [product.imageUrl, ...(product.additionalImages || [])].filter(Boolean);

  const formatPrice = (price: number) => {
    if (!price || price === 0) return "Liên hệ";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const isSale = product.originalPrice > product.discountedPrice && product.discountedPrice > 0;

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    try {
      // Gửi trực tiếp đến email thông qua formsubmit.co
      const response = await fetch("https://formsubmit.co/ajax/huuthang12021@gmail.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          "Họ và tên": formData.name,
          "Số điện thoại": formData.phone,
          "Địa chỉ nhận hàng": formData.address,
          "Mẫu sản phẩm": product.name,
          "Tổng thanh toán": formatPrice(product.discountedPrice),
          "_subject": "Đơn hàng mới: " + product.name + " từ " + formData.name,
          "_template": "table"
        })
      });

      // Nếu thành công sẽ trả về ok
      if (response.ok) {
        setSubmitSuccess(true);
      } else {
        throw new Error("Response not OK");
      }

    } catch (error) {
      console.error(error);
      alert('Không thể gửi thông tin. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowOrderForm(false);
    setSubmitSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" onClick={handleClose}>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm"
        ></motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-20 bg-white/80 backdrop-blur-md p-2.5 rounded-full text-gray-500 hover:text-gray-950 hover:bg-gray-100 transition-colors shadow-sm"
          >
            <X size={24} />
          </button>

          <div className="flex-1 overflow-y-auto no-scrollbar relative flex overflow-x-hidden">
            
            {/* ---------------- PRODUCT DETAILS PAGE ---------------- */}
            <motion.div 
              animate={{ x: showOrderForm ? '-100%' : '0%' }}
              transition={{ ease: "easeInOut", duration: 0.4 }}
              className="w-full flex-shrink-0 flex flex-col md:flex-row min-h-full"
            >
              {/* Left Column: Images */}
              <div className="w-full md:w-1/2 bg-gray-50 p-6 md:p-10 flex flex-col gap-6">
                <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-sm flex items-center justify-center relative p-4 group">
                  <img 
                    src={currentMainImage} 
                    alt={product.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                     {product.badges.map(badge => (
                        <span key={badge} className="bg-[#EE4D2D] text-white px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg">
                          {badge}
                        </span>
                     ))}
                  </div>
                </div>
                
                {/* Thumbnails */}
                {allImages.length > 1 && (
                  <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                    {allImages.map((img, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setMainImage(img)}
                        className={`flex-shrink-0 w-20 h-20 bg-white rounded-2xl p-2 border-2 transition-all overflow-hidden ${
                          currentMainImage === img ? 'border-[#EE4D2D] shadow-md' : 'border-transparent hover:border-orange-200'
                        }`}
                      >
                        <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Details */}
              <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col">
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                  {product.category}
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight tracking-tight mb-6">
                  {product.name}
                </h2>
                
                <div className="flex items-end gap-4 mb-8 pb-8 border-b border-gray-100">
                  <div className="text-3xl md:text-5xl font-black text-[#EE4D2D] tracking-tighter italic">
                    {formatPrice(product.discountedPrice)}
                  </div>
                  {isSale && (
                    <div className="text-lg md:text-xl text-gray-400 font-bold line-through opacity-60 mb-1">
                      {formatPrice(product.originalPrice)}
                    </div>
                  )}
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-gray-200 mb-6">
                  <button 
                    onClick={() => setActiveTab('specs')}
                    className={`pb-3 font-bold text-sm md:text-base uppercase tracking-wider transition-colors border-b-2 ${
                      activeTab === 'specs' ? 'border-[#EE4D2D] text-[#EE4D2D]' : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Thông số kỹ thuật
                  </button>
                  <button 
                    onClick={() => setActiveTab('features')}
                    className={`pb-3 font-bold text-sm md:text-base uppercase tracking-wider transition-colors border-b-2 ${
                      activeTab === 'features' ? 'border-[#EE4D2D] text-[#EE4D2D]' : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Chức năng nổi bật
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 text-gray-600 font-medium leading-relaxed rounded-2xl bg-gray-50 p-6 shadow-inner text-sm md:text-base mb-8">
                  {activeTab === 'specs' ? (
                    <div className="whitespace-pre-line">
                      {product.specifications || (
                         `• Dung tích: {Liên hệ}\n• Công suất: {Liên hệ}\n• Nguồn điện: 220V/50Hz\n• Chất liệu: Hợp kim cao cấp\n• Bảo hành: 12-24 tháng chính hãng`
                      ).replace(/\{Liên hệ\}/g, "đang cập nhật")}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {product.features?.split('\n').filter(Boolean).length ? (
                        product.features.split('\n').map((line, i) => (
                           <div key={i} className="flex gap-3 items-start">
                             <CheckCircle2 size={18} className="text-[#EE4D2D] shrink-0 mt-0.5" />
                             <span className="text-gray-700">{line.replace(/^- /, '')}</span>
                           </div>
                        ))
                      ) : (
                        <>
                          <div className="flex gap-3"><CheckCircle2 size={18} className="text-[#EE4D2D] shrink-0 mt-0.5" /><span>Tiệt trùng 99.9% bằng tia UV công nghệ mới.</span></div>
                          <div className="flex gap-3"><CheckCircle2 size={18} className="text-[#EE4D2D] shrink-0 mt-0.5" /><span>Sấy khô tuần hoàn tự động, không lo đọng nước.</span></div>
                          <div className="flex gap-3"><CheckCircle2 size={18} className="text-[#EE4D2D] shrink-0 mt-0.5" /><span>Màn hình cảm ứng hiện đại, dễ thao tác.</span></div>
                          <div className="flex gap-3"><CheckCircle2 size={18} className="text-[#EE4D2D] shrink-0 mt-0.5" /><span>Thiết kế sang trọng, tối ưu không gian lưu trữ.</span></div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Guarantee */}
                <div className="flex items-center gap-3 bg-green-50 text-green-700 p-4 rounded-2xl mb-6 text-sm font-bold">
                  <ShieldCheck size={20} className="shrink-0" />
                  Cam kết hàng chính hãng 100%. Bảo hành theo tiêu chuẩn nhà sản xuất.
                </div>
              </div>
            </motion.div>

            {/* ---------------- ORDER FORM PAGE ---------------- */}
            <motion.div 
              animate={{ x: showOrderForm ? '-100%' : '0%' }}
              transition={{ ease: "easeInOut", duration: 0.4 }}
              className="w-full flex-shrink-0 bg-white p-6 md:p-10 flex flex-col h-full"
            >
              <div className="flex items-center mb-8 pb-6 border-b border-gray-100">
                <button 
                  onClick={() => setShowOrderForm(false)}
                  className="mr-4 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
                >
                  <ArrowLeft size={24} />
                </button>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900">Thông tin mua hàng</h2>
                  <p className="text-gray-500 font-medium mt-1">Điền thông tin để nhân viên tư vấn gọi lại xác nhận đơn hàng</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 md:gap-12 flex-1">
                {submitSuccess ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-green-50 rounded-[2rem] border border-green-100 h-[400px]">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Đặt hàng thành công!</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Cảm ơn bạn đã quan tâm. Thông tin của bạn đã được ghi nhận. Nhân viên tư vấn sẽ liên hệ lại với bạn trong thời gian sớm nhất qua số điện thoại <strong>{formData.phone}</strong>.
                    </p>
                    <button 
                      onClick={handleClose}
                      className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                    >
                      Tiếp tục mua sắm
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Left: Input Form */}
                    <form id="orderForm" onSubmit={handleOrderSubmit} className="flex-1 space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Họ và tên *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Nhập tên của bạn"
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]/20 focus:border-[#EE4D2D] transition-all font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Số điện thoại *</label>
                        <input 
                          type="tel" 
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="Nhập số điện thoại liên hệ"
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]/20 focus:border-[#EE4D2D] transition-all font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Địa chỉ nhận hàng *</label>
                        <textarea 
                          required
                          rows={3}
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          placeholder="Nhập số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]/20 focus:border-[#EE4D2D] transition-all font-medium resize-none"
                        ></textarea>
                      </div>
                    </form>

                    {/* Right: Order Summary */}
                    <div className="w-full md:w-[350px] bg-gray-50 p-6 md:p-8 rounded-[2rem] h-fit">
                      <h3 className="font-bold text-lg text-gray-900 mb-6 uppercase tracking-wider flex items-center gap-2">
                        <ShoppingCart size={20} className="text-[#EE4D2D]" />
                        Tóm tắt đơn hàng
                      </h3>
                      
                      <div className="flex gap-4 mb-6">
                        <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shadow-sm flex-shrink-0 p-1">
                          <img src={currentMainImage} alt={product.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <div className="font-bold text-gray-900 leading-tight line-clamp-2">{product.name}</div>
                          <div className="text-gray-500 text-sm mt-1">Số lượng: 1</div>
                        </div>
                      </div>

                      <div className="space-y-4 border-t border-gray-200 pt-6">
                        <div className="flex justify-between text-gray-600 font-medium">
                          <span>Tạm tính</span>
                          <span>{formatPrice(product.discountedPrice)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 font-medium">
                          <span>Phí vận chuyển</span>
                          <span className="text-green-600 font-bold">Miễn phí</span>
                        </div>
                        <div className="flex justify-between items-end border-t border-gray-200 mt-4 pt-6">
                          <span className="text-gray-900 font-bold uppercase tracking-wider">Tổng cộng</span>
                          <span className="text-2xl md:text-3xl font-black text-[#EE4D2D] italic">{formatPrice(product.discountedPrice)}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sticky Footer CTA */}
          <div className="bg-white border-t border-gray-100 p-4 md:p-6 flex justify-between items-center z-10 shrink-0 relative overflow-hidden">
             
             {/* Product Details Footer Content */}
             <motion.div 
               className="w-full flex justify-between items-center"
               animate={{ y: showOrderForm ? '-200%' : '0%', opacity: showOrderForm ? 0 : 1 }}
               transition={{ ease: "easeInOut", duration: 0.3 }}
             >
               <div className="hidden md:block">
                 <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tổng cộng:</div>
                 <div className="text-xl font-black text-gray-950 italic">{formatPrice(product.discountedPrice)}</div>
               </div>
               <button 
                  onClick={() => setShowOrderForm(true)}
                  className="w-full md:w-auto flex-1 md:flex-none flex items-center justify-center gap-3 bg-[#EE4D2D] text-white px-12 py-5 rounded-[1.5rem] font-black text-base hover:bg-[#d64124] transition-all shadow-xl shadow-orange-200 active:scale-95 transform uppercase italic tracking-wider"
                >
                  Mua Ngay <ChevronRight size={20} className="group-hover:translate-x-1" />
                </button>
             </motion.div>

             {/* Order Form Footer Content */}
             <motion.div 
               className="absolute inset-0 w-full h-full p-4 md:p-6 flex items-center bg-white"
               initial={{ y: '200%', opacity: 0 }}
               animate={{ y: showOrderForm && !submitSuccess ? '0%' : '200%', opacity: showOrderForm && !submitSuccess ? 1 : 0 }}
               transition={{ ease: "easeInOut", duration: 0.3 }}
             >
               <button 
                  form="orderForm"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 bg-[#EE4D2D] text-white px-12 py-5 rounded-[1.5rem] font-black text-base hover:bg-[#d64124] transition-all shadow-xl shadow-orange-200 active:scale-95 transform uppercase italic tracking-wider disabled:opacity-70 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>Đang Gửi <Loader2 size={20} className="animate-spin" /></>
                  ) : (
                    <>Gửi Yêu Cầu Đặt Hàng <ChevronRight size={20} className="group-hover:translate-x-1" /></>
                  )}
                </button>
             </motion.div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductModal;
