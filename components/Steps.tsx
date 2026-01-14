
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.service';

const Card: React.FC<{ children: React.ReactNode; title?: string; subtitle?: string }> = ({ children, title, subtitle }) => (
  <div className="bg-card-dark border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-fadeIn">
    {(title || subtitle) && (
      <div className="bg-white/[0.03] border-b border-white/10 p-5">
        {title && <h2 className="text-lg font-bold text-white">{title}</h2>}
        {subtitle && <p className="text-[11px] text-primary uppercase font-bold tracking-widest mt-1">{subtitle}</p>}
      </div>
    )}
    <div className="p-6 space-y-6">
      {children}
    </div>
  </div>
);

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="text-label-blue text-[10px] font-black uppercase tracking-[0.15em] block mb-2">{children}</label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-primary outline-none transition-all placeholder:text-white/20 font-bold" />
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <select {...props} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-primary outline-none transition-all" />
);

export const Step1: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    priority: 'Media',
    description: '',
    type: 'Correctivo'
  });
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    setLoading(true);
    try {
      const result = await api.createTicket({
        priority: formData.priority,
        description: formData.description,
        type: formData.type,
        status: 'Pendiente'
      });
      if (result.success) {
        localStorage.setItem('current_ticket_id', result.id);
        navigate('/step2');
      }
    } catch (e) {
      console.error("Error creating ticket", e);
      navigate('/step2');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <span className="bg-primary/20 text-primary text-[10px] font-black px-2 py-1 rounded border border-primary/30 uppercase tracking-widest">Fase Inicial</span>
        <h1 className="text-white text-4xl font-black mt-2 uppercase italic tracking-tighter">Apertura de <span className="text-primary">Ticket</span></h1>
      </div>
      <Card title="Datos de la Incidencia" subtitle="Información técnica base">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <Label>ID de Referencia</Label>
            <Input placeholder="Automático" disabled value="Generado por sistema" />
          </div>
          <div className="space-y-1">
            <Label>Nivel de Prioridad</Label>
            <Select value={formData.priority} onChange={(e: any) => setFormData({ ...formData, priority: e.target.value })}>
              <option value="Baja">Baja (SLA 48h)</option>
              <option value="Media">Media (SLA 24h)</option>
              <option value="Alta">Alta (SLA 4h)</option>
              <option value="Crítica">Crítica (SLA 2h)</option>
            </Select>
          </div>
          <div className="md:col-span-2 space-y-1">
            <Label>Descripción del Fallo</Label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-primary outline-none h-32 transition-all placeholder:text-white/20"
              placeholder="Detalle el problema observado en sitio..."
            ></textarea>
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
          <button onClick={() => navigate('/tickets')} className="px-6 py-2.5 text-white/40 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">Cancelar</button>
          <button
            onClick={handleNext}
            disabled={loading}
            className={`bg-primary text-background-dark px-10 py-3 rounded-lg font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(242,162,13,0.2)] hover:scale-[1.02] transition-all ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? 'Guardando...' : 'Siguiente Paso'} <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export const Step2: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    const id = localStorage.getItem('current_ticket_id');
    if (id) {
      await api.updateTicket({ id, status: 'Aprobado' });
    }
    navigate('/step3');
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <span className="bg-accent-blue/20 text-accent-blue text-[10px] font-black px-2 py-1 rounded border border-accent-blue/30 uppercase tracking-widest">Fase Logística</span>
        <h1 className="text-white text-4xl font-black mt-2 uppercase italic tracking-tighter">Planificación <span className="text-accent-blue">Técnica</span></h1>
      </div>
      <Card title="Asignación y Calendario" subtitle="Gestión de recursos humanos">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <Label>Especialista Asignado</Label>
            <Select>
              <option>Juan Díaz - Senior Electricista</option>
              <option>Juana Silva - Redes y Conectividad</option>
              <option>Miguel Rojas - Infraestructura</option>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Fecha Programada</Label>
            <Input type="date" />
          </div>
          <div className="md:col-span-2 space-y-1">
            <Label>Herramientas Requeridas</Label>
            <div className="flex flex-wrap gap-2">
              {['Escalera 3m', 'Multímetro Fluke', 'Kit de Soldadura', 'Cable Cat6'].map(item => (
                <div key={item} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 hover:border-primary cursor-pointer transition-colors">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <button onClick={() => navigate('/step1')} className="flex items-center gap-2 px-6 py-2.5 text-white/40 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">
            <span className="material-symbols-outlined text-sm font-bold">arrow_back</span> Atrás
          </button>
          <button onClick={handleConfirm} disabled={loading} className="bg-primary text-background-dark px-10 py-3 rounded-lg font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(242,162,13,0.2)] hover:scale-[1.02] transition-all">
            {loading ? 'Confirmando...' : 'Confirmar Plan'} <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export const Step3: React.FC = () => {
  const navigate = useNavigate();
  const [arrived, setArrived] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFinishWork = async () => {
    setLoading(true);
    const id = localStorage.getItem('current_ticket_id');
    if (id) {
      await api.updateTicket({ id, status: 'En Proceso' });
    }
    navigate('/step4');
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <span className="bg-orange-500/20 text-orange-500 text-[10px] font-black px-2 py-1 rounded border border-orange-500/30 uppercase tracking-widest">En Operación</span>
        <h1 className="text-white text-4xl font-black mt-2 uppercase italic tracking-tighter">Ejecución <span className="text-orange-500">Operativa</span></h1>
      </div>

      <Card title="Evidencias en Sitio" subtitle="Registro fotográfico y GPS">
        <div className={`p-5 rounded-xl border transition-all duration-500 flex items-center justify-between ${arrived ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-black/40 border-white/10'}`}>
          <div className="flex items-center gap-4">
            <div className={`size-12 rounded-full flex items-center justify-center ${arrived ? 'bg-emerald-500 text-black' : 'bg-white/5 text-white/20'}`}>
              <span className="material-symbols-outlined text-2xl">{arrived ? 'task_alt' : 'location_on'}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white">{arrived ? 'Check-in Realizado' : 'Validación GPS Requerida'}</p>
              <p className="text-xs text-white/40">{arrived ? 'Ubicación confirmada a las 14:32' : 'Debe estar a menos de 100m de la tienda'}</p>
            </div>
          </div>
          {!arrived && (
            <button onClick={() => setArrived(true)} className="bg-primary text-black font-black px-6 py-2 rounded text-[10px] uppercase tracking-widest shadow-lg hover:bg-primary/90 transition-all active:scale-95">
              Confirmar Llegada
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label>Estado Inicial (Antes)</Label>
            <div className="aspect-video bg-black/60 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer group hover:border-primary/50 transition-all">
              <span className="material-symbols-outlined text-4xl text-white/10 group-hover:text-primary transition-colors">add_a_photo</span>
              <p className="text-[10px] font-bold text-white/20 group-hover:text-white/40 uppercase mt-2">Subir Imagen</p>
            </div>
          </div>
          <div className="space-y-3">
            <Label>Resultado Final (Después)</Label>
            <div className="aspect-video bg-black/60 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer group hover:border-primary/50 transition-all">
              <span className="material-symbols-outlined text-4xl text-white/10 group-hover:text-primary transition-colors">photo_library</span>
              <p className="text-[10px] font-bold text-white/20 group-hover:text-white/40 uppercase mt-2">Subir Imagen</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Notas de Intervención</Label>
          <textarea className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white h-24 outline-none focus:border-primary transition-all" placeholder="Especifique las reparaciones realizadas..."></textarea>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <button onClick={() => navigate('/step2')} className="flex items-center gap-2 px-6 py-2.5 text-white/40 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">
            <span className="material-symbols-outlined text-sm font-bold">arrow_back</span> Atrás
          </button>
          <button onClick={handleFinishWork} disabled={loading} className="bg-primary text-background-dark px-10 py-3 rounded-lg font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl hover:scale-[1.02] transition-all">
            {loading ? 'Enviando...' : 'Finalizar Trabajo'} <span className="material-symbols-outlined text-sm font-bold">send</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export const Step4: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleBudget = async () => {
    setLoading(true);
    const id = localStorage.getItem('current_ticket_id');
    if (id) {
      await api.updateTicket({ id, budget_amount: 225, budget_status: 'PE' });
    }
    navigate('/step5');
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <span className="bg-emerald-500/20 text-emerald-500 text-[10px] font-black px-2 py-1 rounded border border-emerald-500/30 uppercase tracking-widest">Fase Administrativa</span>
        <h1 className="text-white text-4xl font-black mt-2 uppercase italic tracking-tighter">Presupuesto y <span className="text-emerald-500">Costos</span></h1>
      </div>
      <Card title="Desglose de Inversión" subtitle="Materiales y Mano de Obra">
        <div className="space-y-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-white/40 uppercase tracking-widest border-b border-white/10">
                <th className="pb-3 font-black">Descripción</th>
                <th className="pb-3 font-black text-center">Cant.</th>
                <th className="pb-3 font-black text-right">Precio Unit.</th>
                <th className="pb-3 font-black text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="text-white/80">
              <tr className="border-b border-white/5">
                <td className="py-4 font-bold">Repuesto Ventilador Industrial 12"</td>
                <td className="py-4 text-center">2</td>
                <td className="py-4 text-right">$45.00</td>
                <td className="py-4 text-right font-mono">$90.00</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-4 font-bold">Mano de Obra - Servicio Urgente</td>
                <td className="py-4 text-center">1</td>
                <td className="py-4 text-right">$120.00</td>
                <td className="py-4 text-right font-mono">$120.00</td>
              </tr>
              <tr>
                <td className="py-4 font-bold">Materiales de Fijación</td>
                <td className="py-4 text-center">1</td>
                <td className="py-4 text-right">$15.00</td>
                <td className="py-4 text-right font-mono">$15.00</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t border-white/20">
                <td colSpan={3} className="pt-6 text-right font-black uppercase text-white/40">Total Estimado</td>
                <td className="pt-6 text-right text-2xl font-black text-primary font-mono">$225.00</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <button onClick={() => navigate('/step3')} className="flex items-center gap-2 px-6 py-2.5 text-white/40 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">
            <span className="material-symbols-outlined text-sm font-bold">arrow_back</span> Atrás
          </button>
          <button onClick={handleBudget} disabled={loading} className="bg-primary text-background-dark px-10 py-3 rounded-lg font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl hover:scale-[1.02] transition-all">
            {loading ? 'Procesando...' : 'Enviar a Revisión'} <span className="material-symbols-outlined text-sm font-bold">receipt_long</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export const Step5: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSolve = async () => {
    setLoading(true);
    const id = localStorage.getItem('current_ticket_id');
    if (id) {
      await api.updateTicket({ id, status: 'Solucionado' });
    }
    navigate('/step6');
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <span className="bg-purple-500/20 text-purple-500 text-[10px] font-black px-2 py-1 rounded border border-purple-500/30 uppercase tracking-widest">Control de Calidad</span>
        <h1 className="text-white text-4xl font-black mt-2 uppercase italic tracking-tighter">Validación y <span className="text-purple-500">Control</span></h1>
      </div>
      <Card title="Checklist de Cierre" subtitle="Aseguramiento técnico">
        <div className="space-y-4">
          {[
            'Limpieza del área de trabajo realizada',
            'Funcionalidad del equipo verificada con el cliente',
            'Firma de conformidad obtenida digitalmente',
            'Evidencia fotográfica cargada correctamente'
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-primary/50 cursor-pointer transition-colors">
              <input type="checkbox" className="size-5 rounded border-white/20 bg-black/40 text-primary focus:ring-primary" />
              <span className="text-sm font-bold text-white/70">{item}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <button onClick={() => navigate('/step4')} className="flex items-center gap-2 px-6 py-2.5 text-white/40 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">
            <span className="material-symbols-outlined text-sm font-bold">arrow_back</span> Atrás
          </button>
          <button onClick={handleSolve} disabled={loading} className="bg-primary text-background-dark px-10 py-3 rounded-lg font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl hover:scale-[1.02] transition-all">
            {loading ? 'Finalizando...' : 'Cerrar Técnico'} <span className="material-symbols-outlined text-sm font-bold">verified</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export const Step6: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClose = async () => {
    setLoading(true);
    const id = localStorage.getItem('current_ticket_id');
    if (id) {
      await api.updateTicket({ id, status: 'Cerrado' });
      localStorage.removeItem('current_ticket_id');
    }
    navigate('/tickets');
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="mb-4 text-center">
        <div className="inline-flex size-20 rounded-full bg-emerald-500 text-black items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-bounce">
          <span className="material-symbols-outlined text-4xl font-black">done_all</span>
        </div>
        <h1 className="text-white text-5xl font-black uppercase italic tracking-tighter mb-2">Ticket <span className="text-emerald-500">Finalizado</span></h1>
        <p className="text-slate-500 font-bold text-sm uppercase tracking-[0.2em]">Facturación y Conciliación Pendiente</p>
      </div>
      <Card title="Resumen de Facturación" subtitle="Generación de documentos">
        <div className="bg-black/60 p-8 rounded-2xl border border-white/10 text-center space-y-6">
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">Total Neto</p>
              <p className="text-3xl font-mono font-black text-white">$225.00</p>
            </div>
            <div className="h-10 w-px bg-white/10"></div>
            <div className="text-center">
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">Impuestos (16%)</p>
              <p className="text-3xl font-mono font-black text-white/60">$36.00</p>
            </div>
          </div>
          <div className="pt-6">
            <p className="text-[10px] text-primary uppercase font-black tracking-[0.3em] mb-2">Total Facturado</p>
            <p className="text-6xl font-mono font-black text-primary">$261.00</p>
          </div>
          <div className="flex gap-4 pt-8">
            <button className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-colors">
              <span className="material-symbols-outlined">download</span> Descargar PDF
            </button>
            <button className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-colors">
              <span className="material-symbols-outlined">mail</span> Enviar Cliente
            </button>
          </div>
        </div>
        <div className="flex justify-center pt-8">
          <button onClick={handleClose} disabled={loading} className="bg-primary text-background-dark px-16 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all">
            {loading ? 'Terminando...' : 'Volver al Panel Principal'}
          </button>
        </div>
      </Card>
    </div>
  );
};
