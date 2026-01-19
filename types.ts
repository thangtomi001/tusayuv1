
import React from 'react';

export type Category = string;

export type BadgeType = 'Deal hot' | 'Bán chạy' | 'Giảm sâu';

export interface Product {
  id: string;
  name: string;
  category: Category;
  originalPrice: number;
  discountedPrice: number;
  imageUrl: string;
  affiliateUrl: string;
  badges: BadgeType[];
}

export interface WhyUsPoint {
  title: string;
  description: string;
  icon: React.ReactNode;
}
