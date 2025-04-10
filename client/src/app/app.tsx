import AuthProvider from '../providers/AuthProvider';
import AppRouter from '../routes/routes';

export function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
