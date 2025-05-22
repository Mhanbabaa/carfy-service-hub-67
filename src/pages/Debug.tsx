import React from 'react';
import { BrandModelCheck } from '@/components/debug/BrandModelCheck';

const Debug = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Debug Tools</h1>
      <div className="grid grid-cols-1 gap-6">
        <BrandModelCheck />
      </div>
    </div>
  );
};

export default Debug; 