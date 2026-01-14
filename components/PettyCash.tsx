
import React, { useState } from 'react';
import { Header } from './Header';
import { PettyCashEntry } from '../types';

export const PettyCash: React.FC = () => {
  const [expenses, setExpenses] = useState<PettyCashEntry[]>([
    { 
      id: 'EXP-992', 
      ticketId: '#TK-8829', 
      amount: 45.00, 
      concept: 'Compra Flexible 1/2"', 
      voucherNumber: 'FAC-2291', 
      date: '2024-10-24',
      detailedDescription: 'Se compraron 2 conectores flexibles para la reparación de la fuga en el baño de empleados. Se utilizó también cinta aislante.',
      evidenceImage: 'https://picsum.photos/seed/voucher1/400/600'
    },
    { 
      id: 'EXP-993', 
      ticketId: '#TK-9102', 
      amount: 12.50, 
      concept: 'Tornillería Inox', 
      voucherNumber: 'NOT-0032', 
      date: '2024-10-23',
      detailedDescription: 'Pack de tornillos autoroscantes para fijar canaleta exterior de fachada.',
      evidenceImage: 'https://picsum.photos/seed/voucher2/400/600'
    },
  ]);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<PettyCashEntry | null>(null);

  const openDetail = (expense: PettyCashEntry) => {
    setSelectedExpense(expense);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background-dark/95">
      {/* Header limpio sin buscador ni nuevo ticket */}
      <Header title="Control Central de Caja Chica" breadcrumbs={[{ label: 'Finanzas' }]} showActions={false} />
      
      <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
              Rendición de <span className="text-primary">Campo</span>
            </h2>
            <p className="text-slate-500 text-xs mt-2 font-bold uppercase tracking-widest">
              Vista de auditoría para gastos cargados por los técnicos en tickets operativos
            </p>
          </div>
        </div>

        <div className="bg-card-dark border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-white/10">
                  <th className="px-6 py-5">Concepto / Fecha</th>
                  <th className="px-6 py-5">Ticket Vinculado</th>
                  <th className="px-6 py-5">Monto Neto</th>
                  <th className="px-6 py-5">Nº Comprobante</th>
                  <th className="px-6 py-5 text-center">Estado Doc.</th>
                  <th className="px-6 py-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{exp.concept}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{exp.id} • {exp.date}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2.5 py-1 rounded bg-primary/10 text-primary text-[10px] font-black border border-primary/20">{exp.ticketId}</span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-lg font-black font-mono text-white">${exp.amount.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-5 font-bold text-xs text-slate-400 uppercase tracking-widest">
                      {exp.voucherNumber}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className={`material-symbols-outlined text-lg ${exp.evidenceImage ? 'text-emerald-500' : 'text-slate-700'}`}>
                          {exp.evidenceImage ? 'check_circle' : 'cancel'}
                        </span>
                        <span className="text-[9px] font-black uppercase text-slate-500">{exp.evidenceImage ? 'Cargado' : 'Faltante'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => openDetail(exp)}
                        className="size-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition-all border border-white/5"
                      >
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL DE DETALLE: VISTA ADMINISTRADOR (AUDITORÍA) */}
      {isDetailModalOpen && selectedExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fadeIn">
          <div className="bg-card-dark border border-white/10 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20">
                  <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Detalle de <span className="text-primary">Gasto Rendido</span></h3>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">ID: {selectedExpense.id} • Registrado el {selectedExpense.date}</p>
                </div>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="size-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
              <div className="flex-1 p-8 space-y-8 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest">Ticket Origen</p>
                    <p className="text-lg font-black text-white">{selectedExpense.ticketId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest">Monto de Operación</p>
                    <p className="text-3xl font-black text-white font-mono">${selectedExpense.amount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-primary font-black uppercase tracking-widest">Concepto Declarado</p>
                  <p className="text-sm text-white/90 font-bold">{selectedExpense.concept}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] text-primary font-black uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">inventory</span>
                    Desglose de Compra / Detalle de Desperdicio
                  </p>
                  <div className="p-5 bg-white/[0.03] border border-white/10 rounded-2xl">
                    <p className="text-xs text-white/70 italic leading-relaxed font-medium">
                      {selectedExpense.detailedDescription || 'No se proporcionó un desglose detallado para esta carga.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                   <span className="material-symbols-outlined text-emerald-500">verified</span>
                   <div>
                     <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Validación de Documento</p>
                     <p className="text-[11px] text-white/60 font-bold">Comprobante Nº: {selectedExpense.voucherNumber}</p>
                   </div>
                </div>
              </div>

              {/* Panel de Imagen de Factura */}
              <div className="w-full md:w-80 p-8 bg-black/40 border-l border-white/5 flex flex-col items-center justify-center space-y-4">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Evidencia Fotográfica</p>
                <div className="w-full aspect-[3/4] bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-2xl group relative cursor-pointer">
                   {selectedExpense.evidenceImage ? (
                     <img src={selectedExpense.evidenceImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Evidencia Factura" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-700">
                       <span className="material-symbols-outlined text-6xl">image_not_supported</span>
                     </div>
                   )}
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button className="bg-primary text-black font-black p-3 rounded-full shadow-lg"><span className="material-symbols-outlined">zoom_in</span></button>
                   </div>
                </div>
                <button className="w-full py-3 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">print</span> Imprimir Rendición
                </button>
              </div>
            </div>
            
            <div className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-center">
               <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="px-16 py-3 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/60 rounded-xl hover:bg-white/10 transition-all border border-white/10"
               >
                Cerrar Expediente
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
