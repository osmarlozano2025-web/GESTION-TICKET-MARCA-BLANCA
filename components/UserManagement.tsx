
import React, { useState } from 'react';
import { Header } from './Header';
import { AppUser, UserPermission } from '../types';

const MODULES = [
  'Dashboard', 'Tickets', 'Materiales', 'Clientes', 
  'Usuarios', 'Flota', 'Caja Chica', 'Reportes', 'Configuración'
];

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<AppUser[]>([
    { 
      id: '1', 
      name: 'Alex Operador', 
      email: 'alex@techops.pro',
      role: 'Administrador Maestro', 
      group: 'Dirección Central',
      permissions: MODULES.map(m => ({ module: m, view: true, edit: true })) 
    },
    { 
      id: '2', 
      name: 'Juan Díaz', 
      email: 'juan.diaz@techops.pro',
      role: 'Técnico Senior', 
      group: 'Zona Norte',
      permissions: [
        { module: 'Dashboard', view: true, edit: false },
        { module: 'Tickets', view: true, edit: true },
        { module: 'Caja Chica', view: true, edit: true }
      ] 
    },
    { 
      id: '3', 
      name: 'Miguel Rojas', 
      email: 'm.rojas@techops.pro',
      role: 'Coordinador Logística', 
      group: 'Abastecimiento',
      permissions: [
        { module: 'Materiales', view: true, edit: true },
        { module: 'Flota', view: true, edit: true }
      ] 
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);

  const openNewUserModal = () => {
    setCurrentUser({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      email: '',
      role: '',
      group: '',
      permissions: MODULES.map(m => ({ module: m, view: false, edit: false }))
    });
    setIsModalOpen(true);
  };

  const openEditUser = (user: AppUser) => {
    // Clonamos profundamente para evitar mutaciones directas antes de guardar
    setCurrentUser(JSON.parse(JSON.stringify(user)));
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!currentUser || !currentUser.name || !currentUser.email) {
      alert("Por favor complete al menos el nombre y el correo.");
      return;
    }
    
    setUsers(prevUsers => {
      const exists = prevUsers.find(u => u.id === currentUser.id);
      if (exists) {
        return prevUsers.map(u => u.id === currentUser.id ? currentUser : u);
      }
      return [...prevUsers, currentUser];
    });
    
    setIsModalOpen(false);
  };

  const togglePermission = (moduleName: string, type: 'view' | 'edit') => {
    if (!currentUser) return;
    
    const updatedPermissions = [...currentUser.permissions];
    const permIndex = updatedPermissions.findIndex(p => p.module === moduleName);
    
    if (permIndex === -1) {
      updatedPermissions.push({ 
        module: moduleName, 
        view: type === 'view', 
        edit: type === 'edit' 
      });
    } else {
      const p = updatedPermissions[permIndex];
      const newVal = !p[type];
      
      if (type === 'edit' && newVal) {
        p.edit = true;
        p.view = true; // Si puede editar, obligatoriamente puede ver
      } else if (type === 'view' && !newVal) {
        p.view = false;
        p.edit = false; // Si no puede ver, no puede editar
      } else {
        p[type] = newVal;
      }
    }
    
    setCurrentUser({ ...currentUser, permissions: updatedPermissions });
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background-dark/95">
      <Header title="Administración de Usuarios" breadcrumbs={[{ label: 'Usuarios' }]} />
      <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Panel de <span className="text-primary">Control de Identidades</span></h2>
            <p className="text-slate-500 text-sm mt-1">Gestión de roles empresariales, grupos operativos y matriz de accesos.</p>
          </div>
          <button 
            onClick={openNewUserModal}
            className="bg-primary text-black font-black px-6 py-2.5 rounded-lg text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">person_add</span>
            Nuevo Usuario
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user.id} className="bg-card-dark border border-white/5 rounded-2xl p-6 hover:border-primary/30 transition-all group relative overflow-hidden flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-12 rounded-2xl bg-slate-800 flex items-center justify-center font-black text-primary border border-white/10 shadow-lg shrink-0">
                  {user.name ? user.name.split(' ').map(n => n[0]).join('') : '?'}
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-bold truncate">{user.name || 'Sin Nombre'}</h3>
                  <p className="text-[10px] text-primary font-black uppercase tracking-widest truncate">{user.role || 'Sin Rol'}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="material-symbols-outlined text-sm">group</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{user.group || 'Sin Grupo'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="material-symbols-outlined text-sm">alternate_email</span>
                  <span className="text-xs truncate font-mono">{user.email}</span>
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-white/5 flex-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex justify-between">
                  Accesos: 
                  <span className="text-primary">{user.permissions.filter(p => p.view).length} activos</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {user.permissions.filter(p => p.view).slice(0, 4).map(p => (
                    <span key={p.module} className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-bold text-white/60 border border-white/5">
                      {p.module}
                    </span>
                  ))}
                  {user.permissions.filter(p => p.view).length > 4 && (
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-bold text-primary/60 border border-white/5">
                      +{user.permissions.filter(p => p.view).length - 4} más
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button 
                  onClick={() => openEditUser(user)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-[10px] font-black uppercase text-white/40 hover:bg-primary hover:text-black transition-all border border-white/5 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">edit_note</span>
                  Editar Usuario
                </button>
                <button 
                  onClick={() => setUsers(prev => prev.filter(u => u.id !== user.id))}
                  className="px-3 rounded-xl bg-white/5 text-slate-500 hover:text-red-500 border border-white/5 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Configuración/Creación */}
      {isModalOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-card-dark border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
                  {users.find(u => u.id === currentUser.id) ? 'Perfil de' : 'Nuevo'} <span className="text-primary">Usuario</span>
                </h3>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Asignación de rol empresarial y grupo operativo</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-primary font-black uppercase tracking-widest ml-1">Nombre Completo</label>
                  <input 
                    type="text" 
                    value={currentUser.name}
                    onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
                    placeholder="Ej: Roberto Pérez"
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-primary font-black uppercase tracking-widest ml-1">Email Corporativo</label>
                  <input 
                    type="email" 
                    value={currentUser.email}
                    onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
                    placeholder="ejemplo@techops.pro"
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary outline-none transition-all font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-primary font-black uppercase tracking-widest ml-1">Rol en la Organización</label>
                  <input 
                    type="text" 
                    value={currentUser.role}
                    onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
                    placeholder="Eje: Técnico Nivel 3"
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-primary font-black uppercase tracking-widest ml-1">Grupo Operativo</label>
                  <input 
                    type="text" 
                    value={currentUser.group}
                    onChange={(e) => setCurrentUser({...currentUser, group: e.target.value})}
                    placeholder="Eje: Zona Bajío / Mantenimiento"
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest">Matriz de Permisos Específicos</h4>
                  <div className="flex gap-12 text-[9px] font-black uppercase text-slate-500 mr-4">
                    <span>Ver</span>
                    <span>Editar</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {MODULES.map(moduleName => {
                    const perm = currentUser.permissions.find(p => p.module === moduleName) || { module: moduleName, view: false, edit: false };
                    return (
                      <div key={moduleName} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group/row">
                        <div className="flex items-center gap-3">
                           <span className={`material-symbols-outlined text-sm ${perm.view ? 'text-primary' : 'text-slate-600'}`}>
                             {perm.view ? 'visibility' : 'visibility_off'}
                           </span>
                           <span className="text-sm font-bold text-white/80">{moduleName}</span>
                        </div>
                        <div className="flex gap-12 mr-3">
                          <button 
                            onClick={() => togglePermission(moduleName, 'view')}
                            className={`size-6 rounded-md border flex items-center justify-center transition-all ${perm.view ? 'bg-primary border-primary text-black shadow-[0_0_10px_rgba(242,162,13,0.4)]' : 'border-white/10 text-transparent hover:border-primary/50'}`}
                          >
                            <span className="material-symbols-outlined text-[16px] font-black">check</span>
                          </button>
                          <button 
                            onClick={() => togglePermission(moduleName, 'edit')}
                            className={`size-6 rounded-md border flex items-center justify-center transition-all ${perm.edit ? 'bg-accent-blue border-accent-blue text-black shadow-[0_0_10px_rgba(99,179,237,0.4)]' : 'border-white/10 text-transparent hover:border-accent-blue/50'}`}
                          >
                            <span className="material-symbols-outlined text-[16px] font-black">edit_square</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 bg-white/[0.02] border-t border-white/5 flex gap-4 shrink-0">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
              >
                Descartar
              </button>
              <button 
                onClick={handleSave}
                className="flex-[2] py-4 bg-primary text-black text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm font-black">save</span>
                Guardar Configuración
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
