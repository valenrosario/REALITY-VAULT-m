import React from 'react';
import { MARQUEE_TEXT } from '../../constants';

const NewsMarquee = () => (
  <div className="bg-pink-500 dark:bg-pink-700 text-white py-1.5 overflow-hidden border-b-2 border-pink-700 dark:border-pink-900 relative z-50 transition-colors">
    <div className="animate-marquee font-gravity text-sm font-bold tracking-widest uppercase">
      {MARQUEE_TEXT}
    </div>
  </div>
);

export default NewsMarquee;
