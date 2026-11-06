/**
 * EduCash — Componente Raiz da Aplicação (Fase 3: Autenticação de Alunos)
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { NavViewType } from './components/Navbar';
import { AppShell } from './components/AppShell';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { LessonPage } from './pages/LessonPage';
import { LandingPage } from './pages/LandingPage';

type ViewType = NavViewType;

const MainApp: React.FC = () => {
  const { isRecoveryMode } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('b0000000-0000-0000-0000-000000000001');

  // Sincronização com hash da URL para permitir navegação direta, testes e recuperação de senha
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const search = window.location.search;
      if (
        hash.includes('reset-password') ||
        hash.includes('type=recovery') ||
        hash.includes('error_code=otp_expired') ||
        search.includes('type=recovery') ||
        search.includes('recovery=true')
      ) {
        setCurrentView('reset-password');
        return;
      }
      if (['home', 'login', 'register', 'forgot', 'reset-password', 'dashboard', 'lesson'].includes(hash)) {
        setCurrentView(hash as ViewType);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Exibe a tela de redefinição de senha quando o Supabase Auth dispara evento de recuperação
  useEffect(() => {
    if (isRecoveryMode) {
      setCurrentView('reset-password');
    }
  }, [isRecoveryMode]);

  const navigateTo = (view: ViewType) => {
    setCurrentView(view);
    window.location.hash = view === 'home' ? '' : view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    navigateTo('lesson');
  };

  return (
    <AppShell currentView={currentView} onNavigate={navigateTo}>
      {currentView === 'home' && (
        <LandingPage
          onNavigateRegister={() => navigateTo('register')}
          onNavigateLogin={() => navigateTo('login')}
          onNavigateDashboard={() => navigateTo('dashboard')}
        />
      )}

        {currentView === 'login' && (
          <LoginPage
            onSuccess={() => navigateTo('dashboard')}
            onNavigateRegister={() => navigateTo('register')}
            onNavigateForgot={() => navigateTo('forgot')}
          />
        )}

        {currentView === 'register' && (
          <RegisterPage
            onSuccess={() => navigateTo('dashboard')}
            onNavigateLogin={() => navigateTo('login')}
          />
        )}

        {currentView === 'forgot' && (
          <ForgotPasswordPage onNavigateLogin={() => navigateTo('login')} />
        )}

        {currentView === 'reset-password' && (
          <ResetPasswordPage
            onSuccess={() => navigateTo('login')}
            onNavigateLogin={() => navigateTo('login')}
            onNavigateForgot={() => navigateTo('forgot')}
          />
        )}

        {currentView === 'dashboard' && (
          <ProtectedRoute onNavigateLogin={() => navigateTo('login')}>
            <DashboardPage onStartLesson={handleStartLesson} />
          </ProtectedRoute>
        )}

        {currentView === 'lesson' && (
          <ProtectedRoute onNavigateLogin={() => navigateTo('login')}>
            <LessonPage
              lessonId={selectedLessonId}
              onBackToDashboard={() => navigateTo('dashboard')}
            />
          </ProtectedRoute>
        )}
    </AppShell>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
