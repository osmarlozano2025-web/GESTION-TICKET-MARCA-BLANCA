
import React, { useState, useEffect, useRef } from 'react';
import { Header } from './Header';
import { CompanySettings } from '../types';

export const SettingsView: React.FC = () => {
  const [companySettings, setCompanySettings] = useState<CompanySettings>(() => {
    const saved = localStorage.getItem('company_settings');
    return saved ? JSON.parse(saved) : {
      name: 'Impulso Digital',
      tagline: 'Estrategia Operativa',
      logoUrl: '/logo.png',
      primaryColor: '#f2a20d'
    };
  });

  const logoInputRef = useRef<HTMLInputElement>(null);

  const saveSettings = (newSettings: CompanySettings) => {
    setCompanySettings(newSettings);
    localStorage.setItem('company_settings', JSON.stringify(newSettings));
    window.dispatchEvent(new Event('company_settings_updated'));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        saveSettings({ ...companySettings, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background-dark/95">
      <Header title="Configuración del Sistema" breadcrumbs={[{ label: 'Ajustes' }]} />
      <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">

        <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* SECCIÓN 1: Perfil de la Empresa (Marca Blanca) */}
          <div className="bg-card-dark p-8 rounded-3xl border border-white/5 space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <span className="material-symbols-outlined text-primary">branding_watermark</span>
              <h3 className="text-white font-black uppercase tracking-widest text-sm">Perfil de la Empresa <span className="text-primary/50 text-[10px] ml-2">(Marca Blanca)</span></h3>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 rounded-2xl group hover:border-primary/40 transition-all relative overflow-hidden bg-black/20">
                {companySettings.logoUrl ? (
                  <img src={companySettings.logoUrl} className="h-20 w-auto mb-4 object-contain" alt="Logo Preview" />
                ) : (
                  <span className="material-symbols-outlined text-4xl text-white/10 mb-2 group-hover:text-primary transition-colors">image</span>
                )}
                <button
                  onClick={() => logoInputRef.current?.click()}
                  className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                >
                  {companySettings.logoUrl ? 'Cambiar Logotipo' : 'Cargar Logotipo'}
                </button>
                <input type="file" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                <p className="text-[9px] text-slate-600 font-bold mt-2 uppercase">PNG o SVG recomendado (256x256)</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-primary font-black uppercase tracking-widest ml-1">Nombre Comercial</label>
                <input
                  type="text"
                  value={companySettings.name}
                  onChange={(e) => saveSettings({ ...companySettings, name: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary outline-none transition-all font-bold"
                  placeholder="Ej: Mi Empresa Tech"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-primary font-black uppercase tracking-widest ml-1">Eslogan del Software</label>
                <input
                  type="text"
                  value={companySettings.tagline}
                  onChange={(e) => saveSettings({ ...companySettings, tagline: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary outline-none transition-all"
                  placeholder="Ej: Gestión Técnica Total"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: Perfil de Administrador */}
          <div className="bg-card-dark p-8 rounded-3xl border border-white/5 space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <span className="material-symbols-outlined text-primary">person</span>
              <h3 className="text-white font-black uppercase tracking-widest text-sm">Perfil de Administrador</h3>
            </div>
            <div className="flex items-center gap-6">
              <div className="size-20 rounded-2xl bg-slate-800 border-2 border-primary overflow-hidden shadow-lg">
                <img src="https://picsum.photos/seed/admin/200/200" className="w-full h-full object-cover" alt="Perfil" />
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold text-white">Alex Operador</p>
                <p className="text-sm text-primary font-bold uppercase tracking-widest">Master Admin</p>
                <button className="text-[10px] text-accent-blue font-bold uppercase mt-2 hover:underline">Cambiar Imagen</button>
              </div>
            </div>
            <div className="pt-4 space-y-4">
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Email de Acceso</p>
                <p className="text-sm text-white font-mono">alex@impulsodigital.com</p>
              </div>
              <button className="w-full py-3 bg-white/5 text-white font-black text-[10px] uppercase rounded-xl border border-white/10 hover:bg-white/10 transition-all">Cambiar Contraseña</button>
            </div>
          </div>

          {/* SECCIÓN 3: Control Global de Operaciones y Usuarios */}
          <div className="md:col-span-2 bg-card-dark p-8 rounded-3xl border border-white/5 space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <span className="material-symbols-outlined text-primary">security_update_good</span>
              <h3 className="text-white font-black uppercase tracking-widest text-sm">Control Maestro de Privacidad y Geolocalización</h3>
            </div>

            <p className="text-slate-500 text-xs leading-relaxed">
              Configuración de visibilidad y reporte de datos para toda la fuerza técnica asignada al sistema.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  label: 'Geolocalización Global',
                  desc: 'Habilitar rastreo GPS para todos los técnicos activos.',
                  icon: 'share_location',
                  active: true
                },
                {
                  label: 'Visibilidad Inter-Equipos',
                  desc: 'Permitir que técnicos vean la ubicación de sus compañeros.',
                  icon: 'group_work',
                  active: false
                },
                {
                  label: 'Reportes Automáticos',
                  desc: 'Generar consolidados de actividad cada 24 horas.',
                  icon: 'summarize',
                  active: true
                },
                {
                  label: 'Alertas de SLA Proactivas',
                  desc: 'Notificar a dirección cuando un ticket supere el 80% del SLA.',
                  icon: 'notification_important',
                  active: true
                }
              ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-black/40 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-xl">{pref.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-none mb-1">{pref.label}</p>
                      <p className="text-[10px] text-slate-500 leading-tight pr-4">{pref.desc}</p>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all ${pref.active ? 'bg-primary' : 'bg-white/10'}`}>
                    <div className={`size-4 bg-background-dark rounded-full shadow-lg transform transition-transform ${pref.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-end">
              <button className="px-8 py-3 bg-primary text-black font-black text-[10px] uppercase rounded-xl shadow-[0_0_20px_rgba(242,162,13,0.3)] hover:scale-105 transition-all">
                Guardar Configuración Global
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
