"use client";

import Image from 'next/image';

export default function AlpineLogo({ className, style }) {
  return (
    <Image 
      src="/assets/logo_transparent.png" 
      alt="Alpine Corporation Logo - Industrial Power Tools Supplier India" 
      width={200}
      height={80}
      priority
      className={className} 
      style={{ 
        display: 'block',
        maxWidth: '100%',
        height: 'auto',
        ...style 
      }} 
    />
  );
}
