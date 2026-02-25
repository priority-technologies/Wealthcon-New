'use client';

import React from 'react';

export default function Typography({
  tag: Tag = 'p',
  size = 'text-base',
  weight = 'font-normal',
  color = 'text-gray-900',
  className = '',
  children,
  ...props
}) {
  return (
    <Tag className={`${size} ${weight} ${color} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
