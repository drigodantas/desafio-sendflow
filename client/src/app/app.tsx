import AuthProvider from '../providers/auth.provider';
import AppRouter from '../routes/routes';

export function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
