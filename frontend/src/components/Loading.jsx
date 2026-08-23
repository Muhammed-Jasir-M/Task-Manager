import React from 'react';
import { Sparkles } from 'lucide-react';

const Loading = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[60vh] w-full text-center">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
        <Sparkles className="absolute inset-0 m-auto h-5 w-5 text-indigo-400" />
      </div>
      <p className="mt-4 text-sm text-slate-400 font-medium">{text}</p>
    </div>
  );
};

export default Loading;