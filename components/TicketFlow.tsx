
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { STEPS } from '../constants';

interface TicketFlowProps {
  children: React.ReactNode;
  currentStep: number;
}

export const TicketFlowWrapper: React.FC<TicketFlowProps> = ({ children, currentStep }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-background-dark custom-scrollbar">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2 -z-10"></div>
          {STEPS.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-2">
              <div 
                className={`size-10 rounded-full flex items-center justify-center text-sm font-bold border-4 border-background-dark outline outline-1 transition-all duration-300
                  ${s.id < currentStep ? 'bg-emerald-500 outline-emerald-500' : s.id === currentStep ? 'bg-primary outline-primary scale-110 shadow-[0_0_15px_rgba(242,162,13,0.3)]' : 'bg-surface-dark outline-white/10 opacity-50'}
                `}
              >
                {s.id < currentStep ? <span className="material-symbols-outlined text-sm">check</span> : s.id}
              </div>
              <span className={`text-[10px] uppercase font-bold tracking-widest ${s.id === currentStep ? 'text-primary' : 'text-white/40'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
};
