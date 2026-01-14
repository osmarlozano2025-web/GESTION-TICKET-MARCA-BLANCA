
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TicketsList } from './components/TicketsList';
import { TicketFlowWrapper } from './components/TicketFlow';
import { Step1, Step2, Step3, Step4, Step5, Step6 } from './components/Steps';
import { ClientsList } from './components/ClientsList';
import { UserManagement } from './components/UserManagement';
import { FleetView } from './components/FleetView';
import { SettingsView } from './components/SettingsView';
import { MaterialsRequests } from './components/MaterialsRequests';
import { PettyCash } from './components/PettyCash';
import { EmailBudgetsHistory } from './components/EmailBudgetsHistory';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-sans selection:bg-primary/30">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tickets" element={<TicketsList />} />
            <Route path="/email-budgets" element={<EmailBudgetsHistory />} />
            
            <Route path="/step1" element={
              <TicketFlowWrapper currentStep={1}>
                <Step1 />
              </TicketFlowWrapper>
            } />
            <Route path="/step2" element={
              <TicketFlowWrapper currentStep={2}>
                <Step2 />
              </TicketFlowWrapper>
            } />
            <Route path="/step3" element={
              <TicketFlowWrapper currentStep={3}>
                <Step3 />
              </TicketFlowWrapper>
            } />
            <Route path="/step4" element={
              <TicketFlowWrapper currentStep={4}>
                <Step4 />
              </TicketFlowWrapper>
            } />
            <Route path="/step5" element={
              <TicketFlowWrapper currentStep={5}>
                <Step5 />
              </TicketFlowWrapper>
            } />
            <Route path="/step6" element={
              <TicketFlowWrapper currentStep={6}>
                <Step6 />
              </TicketFlowWrapper>
            } />

            <Route path="/clients" element={<ClientsList />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/materials" element={<MaterialsRequests />} />
            <Route path="/fleet" element={<FleetView />} />
            <Route path="/petty-cash" element={<PettyCash />} />
            <Route path="/settings" element={<SettingsView />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
