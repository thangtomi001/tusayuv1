import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus } from 'lucide-react';

const FAQS = [
  {
    question: 'Nhiệt độ 105°C ở ngăn dưới có "đạt tiệt trùng" không? Có loại cao hơn không?',
    answer: 'Dạ đúng, ngăn dưới sấy khô tối đa 105°C. Cần nói rõ: tủ này <span class="font-bold text-white">không phải máy tiệt trùng thay thế nồi hấp/autoclave</span>. Vai trò đúng là sau khi dụng cụ đã được tiệt trùng bằng thiết bị chuyên dụng, cho vào tủ sấy khô hoàn toàn, có UV+Ozone hỗ trợ khử khuẩn bề mặt, rồi bảo quản khô ráo trước khi dùng lại. Có dòng công nghiệp cỡ lớn nhiệt độ cao hơn cho khối lượng lớn — gọi hotline để được tư vấn đúng nhu cầu.'
  },
  {
    question: 'Mẫu RN65 để bàn có sấy và khử khuẩn cùng lúc không?',
    answer: 'Có 3 chế độ để chọn: <span class="font-bold text-white">chỉ sấy khô</span>, <span class="font-bold text-white">chỉ UV+Ozone</span>, hoặc <span class="font-bold text-white">tự động cả hai liên tiếp</span>. Khác với dòng đứng 2 ngăn chạy đồng thời 2 mức nhiệt riêng biệt, RN65 gọn hơn, phù hợp nơi ít dụng cụ.'
  },
  {
    question: 'Chưa biết chọn mẫu nào — dựa vào đâu để chọn đúng?',
    answer: 'Chọn theo số ghế/khối lượng dụng cụ: <span class="font-bold text-white">1-2 ghế → RN65</span>, <span class="font-bold text-white">2-3 ghế → RN138</span>, <span class="font-bold text-white">3-5 ghế → RN280</span>, <span class="font-bold text-white">5+ ghế hoặc khối lượng lớn → RN380</span>. Đây là gợi ý theo dung tích — gọi hotline 0369 333 910 để xác nhận lại theo đúng thực tế trước khi đặt.'
  },
  {
    question: 'Hỏng thì bảo hành thế nào, mua online có sợ không đúng hàng?',
    answer: 'Bảo hành 2 năm cho cả tủ và bóng đèn UV, có lỗi trong thời gian này được hỗ trợ đổi/sửa qua hotline 0369 333 910. Với đơn hàng: nhận hàng, kiểm tra kỹ đúng mẫu đúng chất lượng rồi mới thanh toán — không đúng ý không cần lấy hàng.'
  }
];

const FAQSection: React.FC = () => {
  // Open all FAQs by default to match the design
  const [openIndices, setOpenIndices] = useState<number[]>(FAQS.map((_, i) => i));

  const toggleFAQ = (index: number) => {
    if (openIndices.includes(index)) {
      setOpenIndices(openIndices.filter(i => i !== index));
    } else {
      setOpenIndices([...openIndices, index]);
    }
  };

  return (
    <section className="py-20 md:py-32 bg-[#0F1115] border-t border-gray-900">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 md:mb-16"
        >
          <div className="text-gray-400 font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-4">
            Câu Hỏi Thường Gặp
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
            Trước khi gọi, xem qua <br className="hidden sm:block" /> 4 câu hỏi này
          </h2>
        </motion.div>

        <div className="flex flex-col gap-4 md:gap-6">
          {FAQS.map((faq, index) => {
            const isOpen = openIndices.includes(index);
            
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={index}
                className={`border border-gray-800 rounded-2xl md:rounded-3xl overflow-hidden transition-colors duration-300 ${isOpen ? 'bg-[#181B21] border-gray-700' : 'bg-[#181B21]/50 hover:bg-[#181B21] hover:border-gray-700 cursor-pointer'}`}
                onClick={() => !isOpen && toggleFAQ(index)}
              >
                <button 
                  className="w-full px-6 md:px-8 py-6 md:py-8 flex items-start justify-between text-left gap-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFAQ(index);
                  }}
                >
                  <h3 className="text-lg md:text-xl font-bold text-white leading-snug">
                    {faq.question}
                  </h3>
                  <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'text-[#00C9B1] hover:bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                    {isOpen ? <X size={20} strokeWidth={2.5} /> : <Plus size={20} strokeWidth={2.5} />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 md:px-8 pb-8 pt-0">
                        <p 
                          className="text-gray-400 text-sm md:text-base leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: faq.answer }}
                        ></p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
