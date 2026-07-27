import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { Layout } from "./components/layout";
import {
  DashboardPages,
  AcademicSpacesPages,
  SchedulePages,
  LostObjectsPages,
  LoginPages,
  AdminSpacesPages,
  ProfilePage
} from "./pages";
import { PrivateRoutes } from "./routes/private.routes";

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
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
