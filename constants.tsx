
import React from 'react';

export const STEPS = [
  { id: 1, label: 'Apertura', path: '/step1' },
  { id: 2, label: 'Planificación', path: '/step2' },
  { id: 3, label: 'Ejecución', path: '/step3' },
  { id: 4, label: 'Presupuesto', path: '/step4' },
  { id: 5, label: 'Control', path: '/step5' },
  { id: 6, label: 'Facturación', path: '/step6' }
];

export const MOCK_TICKETS = [
  { id: '#TK-8829', storeId: 'STR-404', location: 'Centro Histórico', status: 'Pendiente', type: 'Correctivo', category: 'Civil', group: 'Grupo A', technician: 'Juan Díaz', initials: 'JD', priority: 'Media' },
  { id: '#TK-8830', storeId: 'STR-215', location: 'Plaza Norte', status: 'Aprobado', type: 'Preventivo', category: 'Eléctrico', group: 'Grupo B', technician: 'Juana Silva', initials: 'JS', priority: 'Alta' },
  { id: '#TK-8831', storeId: 'STR-102', location: 'Terminal Este', status: 'En Proceso', type: 'Emergencia', category: 'Civil', group: 'Grupo A', technician: 'Miguel Rojas', initials: 'MR', priority: 'Crítica' },
  { id: '#TK-8832', storeId: 'STR-505', location: 'Portal 10', status: 'Cerrado', type: 'Correctivo', category: 'Eléctrico', group: 'Grupo B', technician: 'Carla M.', initials: 'CM', priority: 'Baja' },
  { id: '#TK-8833', storeId: 'STR-301', location: 'Mall San Angel', status: 'Pendiente', type: 'Preventivo', category: 'Civil', group: 'Grupo A', technician: 'Juan Díaz', initials: 'JD', priority: 'Media' },
  { id: '#TK-8834', storeId: 'STR-991', location: 'Tienda Express', status: 'Aprobado', type: 'Emergencia', category: 'Eléctrico', group: 'Grupo B', technician: 'Miguel Rojas', initials: 'MR', priority: 'Alta' },
];
