
import React from 'react';
import { Product, WhyUsPoint } from './types';
import { ShieldCheck, Zap, TrendingUp, RotateCcw, Award } from 'lucide-react';

/**
 * URL Google Sheet được chuyển đổi sang định dạng CSV để website có thể đọc được dữ liệu.
 * Dựa trên link: https://docs.google.com/spreadsheets/d/e/2PACX-1vRbNK9b5-GWuRl4yLJBBgXoEht-fZGugORleRU9_0zB5UOV7w9rcJ3OHWmTu_yqJJ5fKBvIcPtmADor/pubhtml?gid=0&single=true
 */
export const LOGO_URL = "https://aistudio.google.com/_/upload/0ed2d710-b3a8-4220-911c-f5f720e3d2ab/attachment/1775539169.858624000/blobstore/prod/makersuite/spanner_managed/global::000054e2ea70026d:0000015f:2:000054e2ea70026d:0000000000000001::57c60d145fad0b16:000001f1d5a018bc:00064ed7ed7d69ef";
export const HERO_BG_URL = "https://aistudio.google.com/_/upload/0ed2d710-b3a8-4220-911c-f5f720e3d2ab/attachment/1775540869.87420000/blobstore/prod/makersuite/spanner_managed/global::000054e2ea70026d:0000015f:2:000054e2ea70026d:0000000000000001::fe50090b3283345c:000001f1d5a018bc:00064ed852c6cdbf";

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
  "https://aistudio.google.com/_/upload/0ed2d710-b3a8-4220-911c-f5f720e3d2ab/attachment/1775537147.244854000/blobstore/prod/makersuite/spanner_managed/global::000054e2ea70026d:0000015f:2:000054e2ea70026d:0000000000000001::6d4317c23a9e8d62:000001f1d5a018bc:00064ed774eb654f",
  "https://aistudio.google.com/_/upload/0ed2d710-b3a8-4220-911c-f5f720e3d2ab/attachment/1775537147.244854000/blobstore/prod/makersuite/spanner_managed/global::000054e2ea70026d:0000015f:2:000054e2ea70026d:0000000000000001::f64381da5da2afa5:000001f1d5a018bc:00064ed774eb654f",
  "https://aistudio.google.com/_/upload/0ed2d710-b3a8-4220-911c-f5f720e3d2ab/attachment/1775537147.244854000/blobstore/prod/makersuite/spanner_managed/global::000054e2ea70026d:0000015f:2:000054e2ea70026d:0000000000000001::5487576074dfa754:000001f1d5a018bc:00064ed774eb654f",
  "https://aistudio.google.com/_/upload/0ed2d710-b3a8-4220-911c-f5f720e3d2ab/attachment/1775537147.244854000/blobstore/prod/makersuite/spanner_managed/global::000054e2ea70026d:0000015f:2:000054e2ea70026d:0000000000000001::32cb4cfe4b249f06:000001f1d5a018bc:00064ed774eb654f",
  "https://aistudio.google.com/_/upload/0ed2d710-b3a8-4220-911c-f5f720e3d2ab/attachment/1775537147.244854000/blobstore/prod/makersuite/spanner_managed/global::000054e2ea70026d:0000015f:2:000054e2ea70026d:0000000000000001::1107a27c56659678:000001f1d5a018bc:00064ed774eb654f",
  "https://aistudio.google.com/_/upload/0ed2d710-b3a8-4220-911c-f5f720e3d2ab/attachment/1775537147.244854000/blobstore/prod/makersuite/spanner_managed/global::000054e2ea70026d:0000015f:2:000054e2ea70026d:0000000000000001::87ff0c24015974b0:000001f1d5a018bc:00064ed774eb654f"
];
