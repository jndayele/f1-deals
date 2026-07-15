import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import Login from '@/pages/Login';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import AdminLayout from '@/components/admin/AdminLayout';
import Dashboard from '@/pages/Dashboard';
import CarForm from '@/pages/CarForm';
import CarDetail from '@/pages/CarDetail';
import ManageListings from '@/pages/ManageListings';
import Reviews from '@/pages/Reviews';
import AdminSettings from '@/pages/AdminSettings';

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/cars" element={<ManageListings />} />
                <Route path="/cars/new" element={<CarForm />} />
                <Route path="/cars/:id" element={<CarDetail />} />
                <Route path="/cars/:id/edit" element={<CarForm />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/settings" element={<AdminSettings />} />
              </Route>
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App