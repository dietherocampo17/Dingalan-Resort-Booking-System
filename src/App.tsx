import { Redirect, Route, Switch } from 'react-router-dom';
import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 */
/* import '@ionic/react/css/palettes/dark.system.css'; */

/* Theme variables */
import './theme/variables.css';

/* Context */
import { AuthProvider, useAuth } from './context/AuthContext';

/* Layouts */
import ClientLayout from './layouts/ClientLayout';
import EmployeeLayout from './layouts/EmployeeLayout';
import AdminLayout from './layouts/AdminLayout';

/* Auth Pages */
import LoginPage from './pages/auth/LoginPage';

setupIonicReact();

const AppRoutes: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }

  return (
    <IonReactRouter basename="/Dingalan-Resort-Booking-System">
      <Switch>
        {/* Auth Routes */}
        <Route path="/auth" component={LoginPage} />

        {/* Client Routes - accessible to all */}
        <Route path="/client" component={ClientLayout} />

        {/* Employee Routes - for employees and admins */}
        <Route
          path="/employee"
          render={() =>
            user?.role === 'employee' || user?.role === 'admin'
              ? <EmployeeLayout />
              : <Redirect to="/auth/login" />
          }
        />

        {/* Admin Routes - for admins only */}
        <Route
          path="/admin"
          render={() =>
            user?.role === 'admin'
              ? <AdminLayout />
              : <Redirect to="/auth/login" />
          }
        />

        {/* Default redirect based on role */}
        <Route exact path="/">
          {user?.role === 'admin' ? (
            <Redirect to="/admin/dashboard" />
          ) : user?.role === 'employee' ? (
            <Redirect to="/employee/dashboard" />
          ) : (
            <Redirect to="/client/home" />
          )}
        </Route>

        {/* Fallback */}
        <Redirect to="/client/home" />
      </Switch>
    </IonReactRouter>
  );
};

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </IonApp>
);

export default App;
