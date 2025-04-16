import CircularProgress from '@mui/material/CircularProgress';
import { Suspense } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Layout } from '../layout/Layout';
import ConfigRoute from './config.routes';
import { allRoutes } from './list.routes';

export default function AppRouter() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <Router>
        <Routes>
          {allRoutes.map((route) => (
            <Route
              key={route.id}
              path={route.path}
              element={
                <ConfigRoute auth={route.auth}>
                  {route.header !== false ? (
                    <Layout>{route.element}</Layout>
                  ) : (
                    <>{route.element}</>
                  )}
                </ConfigRoute>
              }
            />
          ))}
        </Routes>
      </Router>
    </Suspense>
  );
}
