'use client';

import React from 'react';
import Image from 'next/image';

const WealthconLogo = ({ size = 48, className = '' }) => (
  <div
    style={{
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}
    className={className}
  >
    <Image
      src="/logo.svg"
      alt="Wealthcon Logo"
      width={size}
      height={size}
      priority
      style={{ objectFit: 'contain' }}
    />
  </div>
);

export default WealthconLogo;
