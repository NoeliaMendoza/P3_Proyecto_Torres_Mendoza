import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { Layout } from "./components/layout";
import { PWAStatus } from "./components/common/PWAStatus";
import { PrivateRoutes } from "./routes/private.routes";

const LoginPages = lazy(() => import("./pages/login").then((module) => ({ default: module.LoginPages })));
const DashboardPages = lazy(() => import("./pages/dashboard").then((module) => ({ default: module.DashboardPages })));
const AcademicSpacesPages = lazy(() => import("./pages/academic-spaces").then((module) => ({ default: module.AcademicSpacesPages })));
const SchedulePages = lazy(() => import("./pages/schedule").then((module) => ({ default: module.SchedulePages })));
const LostObjectsPages = lazy(() => import("./pages/lost-objects").then((module) => ({ default: module.LostObjectsPages })));
const AdminSpacesPages = lazy(() => import("./pages/admin-spaces").then((module) => ({ default: module.AdminSpacesPages })));
const AdminReservationsPage = lazy(() => import("./pages/admin-reservations").then((module) => ({ default: module.AdminReservationsPage })));
const ProfilePage = lazy(() => import("./pages/profile/profile").then((module) => ({ default: module.ProfilePage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <PWAStatus />
        <Suspense fallback={<div className="pwa-loading" role="status">Cargando ESPEConnect…</div>}>
          <Routes>
          <Route path="/login" element={<LoginPages />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoutes>
                <Layout>
                  <DashboardPages />
                </Layout>
              </PrivateRoutes>
            }
          />
          <Route
            path="/espacios"
            element={
              <PrivateRoutes>
                <Layout>
                  <AcademicSpacesPages />
                </Layout>
              </PrivateRoutes>
            }
          />
          <Route
            path="/horarios"
            element={
              <PrivateRoutes>
                <Layout>
                  <SchedulePages />
                </Layout>
              </PrivateRoutes>
            }
          />
          <Route
            path="/objetos-perdidos"
            element={
              <PrivateRoutes>
                <Layout>
                  <LostObjectsPages />
                </Layout>
              </PrivateRoutes>
            }
          />
          <Route
            path="/perfil"
            element={
              <PrivateRoutes>
                <Layout>
                  <ProfilePage />
                </Layout>
              </PrivateRoutes>
            }
          />
          <Route
            path="/admin/reservas"
            element={
              <PrivateRoutes rolesPermitidos={['admin']}>
                <Layout>
                  <AdminReservationsPage />
                </Layout>
              </PrivateRoutes>
            }
          />
          <Route
            path="/admin/espacios"
            element={
              <PrivateRoutes rolesPermitidos={['admin']}>
                <Layout>
                  <AdminSpacesPages />
                </Layout>
              </PrivateRoutes>
            }
          />
          <Route path="*" element={<LoginPages />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
