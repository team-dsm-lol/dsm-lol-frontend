import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from './components/guards/AuthGuard';
import { LoginPage } from './pages/LoginPage';
import { RiotRegisterPage } from './pages/RiotRegisterPage';
import { HomePage } from './pages/HomePage';
import { TeamCreatePage } from './pages/TeamCreatePage';
import { ProfilePage } from './pages/ProfilePage';
import { TeamsPage } from './pages/TeamsPage';
import { Layout } from './components/layout/Layout';

function App() {
  return (
    <Routes>
      {/* 인증이 필요 없는 페이지들 */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* 인증이 필요한 페이지들 */}
      <Route
        path="/*"
        element={
          <AuthGuard>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/riot-register" element={<RiotRegisterPage />} />
                <Route path="/team/create" element={<TeamCreatePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/teams" element={<TeamsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </AuthGuard>
        }
      />
    </Routes>
  );
}

export default App; 