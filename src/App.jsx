import { Navigate, Route, Routes } from 'react-router-dom';
import CommandPalette from './components/CommandPalette';
import ToastContainer from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import OnboardingStartPage from './pages/OnboardingStartPage';
import OnboardingConnectPage from './pages/OnboardingConnectPage';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import CreateHomePage from './pages/dashboard/CreateHomePage';
import HomePage from './pages/dashboard/HomePage';
import CreatePostPage from './pages/dashboard/CreatePostPage';
import PostsPage from './pages/dashboard/PostsPage';
import CalendarPage from './pages/dashboard/CalendarPage';
import ConnectionsPage from './pages/dashboard/ConnectionsPage';
import StudioPage from './pages/dashboard/StudioPage';
import ApiKeysPage from './pages/dashboard/ApiKeysPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import BulkToolsPage from './pages/dashboard/BulkToolsPage';
import TeamsPage from './pages/dashboard/TeamsPage';
import BillingPage from './pages/dashboard/BillingPage';

export default function App() {
  return (
    <>
      <CommandPalette />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/onboarding/start" element={<ProtectedRoute><OnboardingStartPage /></ProtectedRoute>} />
        <Route path="/onboarding/connect" element={<ProtectedRoute><OnboardingConnectPage /></ProtectedRoute>} />
        <Route
          path="/app"
          element={(
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={<HomePage />} />
          <Route path="create" element={<CreateHomePage />} />
          <Route path="create/:type" element={<CreatePostPage />} />
          <Route path="calendar" element={<Navigate to="/app/posts/calendar" replace />} />
          <Route path="posts/calendar" element={<CalendarPage />} />
          <Route path="posts" element={<PostsPage />} />
          <Route path="posts/:filter" element={<PostsPage />} />
          <Route path="connections" element={<ConnectionsPage />} />
          <Route path="studio" element={<StudioPage />} />
          <Route path="bulk-tools" element={<BulkToolsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="api-keys" element={<ApiKeysPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="billing" element={<BillingPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
