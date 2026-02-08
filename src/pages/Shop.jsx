import React from 'react';
import { Bot, Code2 } from 'lucide-react';

const Shop = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="bg-gray-900 text-blue-400 p-6 rounded-3xl shadow-2xl mb-6 animate-pulse">
        <Bot size={64} className="mx-auto mb-4" />
        <h2 className="text-xl font-mono font-bold tracking-tighter">
          &gt; SYSTEM_STATUS: PENDING
        </h2>
      </div>
      
      <p className="text-gray-500 font-mono text-sm max-w-xs">
        /* I will add functions here when I know how to make bots and automations with Python */
      </p>
      
      <div className="mt-8 flex gap-2">
        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
        <div className="h-2 w-2 bg-blue-500 rounded-full opacity-50"></div>
        <div className="h-2 w-2 bg-blue-500 rounded-full opacity-20"></div>
      </div>
    </div>
  );
};

export default Shop;

