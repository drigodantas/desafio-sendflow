import CircularProgress from '@mui/material/CircularProgress';
import { Suspense } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Layout } from '../layout/Layout';
import ConfigRoute from './config.routes';
import { listRoutes } from './list.routes';

export default function AppRouter() {
  return (
    <Suspense
      fallback={
        <div>
          <CircularProgress />
        </div>
      }
    >
      <Router>
        <Routes>
          {listRoutes.map((route) => (
            <Route
              key={route.id}
              element={
                <ConfigRoute auth={route.auth}>
                  {route.auth ? (
                    <Layout>{route.element}</Layout>
                  ) : (
                    <>{route.element}</>
                  )}
                </ConfigRoute>
              }
              path={route.path}
            />
          ))}
        </Routes>
      </Router>
    </Suspense>
  );
}
