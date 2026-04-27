
import React from 'react';
import { Product, WhyUsPoint } from './types';
import { ShieldCheck, Zap, TrendingUp, RotateCcw, Award } from 'lucide-react';

import logoImg from './public/logo.png';
import heroImg from './public/bg-hero.jpg';
import anh1Img from './public/anh1.jpg';
import anh2Img from './public/anh2.jpg';
import anh3Img from './public/anh3.jpg';
import anh4Img from './public/anh4.jpg';
import anh5Img from './public/anh5.jpg';
import anh6Img from './public/anh6.jpg';

/**
 * URL Google Sheet được chuyển đổi sang định dạng CSV để website có thể đọc được dữ liệu.
 * Dựa trên link: https://docs.google.com/spreadsheets/d/e/2PACX-1vRbNK9b5-GWuRl4yLJBBgXoEht-fZGugORleRU9_0zB5UOV7w9rcJ3OHWmTu_yqJJ5fKBvIcPtmADor/pubhtml?gid=0&single=true
 */
export const LOGO_URL = logoImg;
export const HERO_BG_URL = heroImg;

export const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRbNK9b5-GWuRl4yLJBBgXoEht-fZGugORleRU9_0zB5UOV7w9rcJ3OHWmTu_yqJJ5fKBvIcPtmADor/pub?gid=0&single=true&output=csv";

// ĐƯỜNG DẪN WEB APP TỪ GOOGLE APPS SCRIPT
export const ORDER_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwTBXJpKQhdw7TElLYqW2e2dnqz7lbYEYLthgQdt_vvmtPfNemqncoEuekHCgnJyw9J/exec"; 

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
  anh1Img,
  anh2Img,
  anh3Img,
  anh4Img,
  anh5Img,
  anh6Img
];
