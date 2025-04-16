import AuthProvider from './apps/auth/AuthProvider';
import DialogApp from './apps/dialog/DialogApp';
import AppRouter from './apps/routes/routes';

export function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <DialogApp />
    </AuthProvider>
  );
}
