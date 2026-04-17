
import React from 'react';
import { Product, WhyUsPoint } from './types';
import { ShieldCheck, Zap, TrendingUp, RotateCcw, Award } from 'lucide-react';

/**
 * URL Google Sheet được chuyển đổi sang định dạng CSV để website có thể đọc được dữ liệu.
 * Dựa trên link: https://docs.google.com/spreadsheets/d/e/2PACX-1vRbNK9b5-GWuRl4yLJBBgXoEht-fZGugORleRU9_0zB5UOV7w9rcJ3OHWmTu_yqJJ5fKBvIcPtmADor/pubhtml?gid=0&single=true
 */
export const LOGO_URL = "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200&auto=format&fit=crop";
export const HERO_BG_URL = "/bg-hero.jpg";

export const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRbNK9b5-GWuRl4yLJBBgXoEht-fZGugORleRU9_0zB5UOV7w9rcJ3OHWmTu_yqJJ5fKBvIcPtmADor/pub?gid=0&single=true&output=csv";

export const PRODUCTS: Product[] = [
  {
    id: 'fallback-1',
    name: 'Đang kết nối kho dữ liệu...',
    category: 'Tất cả',
    originalPrice: 0,
    discountedPrice: 0,
    imageUrl: 'https://via.placeholder.com/400',
    affiliateUrl: '#',
    badges: []
  }
];

export const WHY_US: WhyUsPoint[] = [
  {
    title: 'Hàng Chính Hãng 100%',
    description: 'Cam kết mọi sản phẩm tủ sấy UV đều là hàng nhập khẩu chính ngạch, đầy đủ CO/CQ.',
    icon: <Award className="w-8 h-8 text-orange-500" />
  },
  {
    title: 'Giá Sỉ Tận Gốc',
    description: 'Lợi thế tổng kho giúp chúng tôi mang đến mức giá cạnh tranh nhất cho khách hàng lẻ và đại lý.',
    icon: <TrendingUp className="w-8 h-8 text-orange-500" />
  },
  {
    title: 'Bảo Hành 12 Tháng',
    description: 'Chế độ hậu mãi chu đáo, hỗ trợ thay thế linh kiện chính hãng trọn đời sản phẩm.',
    icon: <RotateCcw className="w-8 h-8 text-orange-500" />
  },
  {
    title: 'Giao Hàng Siêu Tốc',
    description: 'Hỗ trợ giao hàng hỏa tốc trong ngày tại các thành phố lớn và ship COD toàn quốc.',
    icon: <Zap className="w-8 h-8 text-orange-500" />
  }
];

export const REAL_PHOTOS = [
  "/anh1.jpg",
  "/anh2.jpg",
  "/anh3.jpg",
  "/anh4.jpg",
  "/anh5.jpg",
  "/anh6.jpg"
];
