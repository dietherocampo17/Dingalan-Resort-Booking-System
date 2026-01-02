import React from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonMenu,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonMenuToggle,
    IonSplitPane,
    IonButtons,
    IonMenuButton,
    IonAvatar
} from '@ionic/react';
import { Route, Switch, Redirect, useRouteMatch } from 'react-router-dom';
import {
    statsChart,
    business,
    people,
    calendar,
    card,
    star,
    settings,
    logOut
} from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ResortManagement from '../pages/admin/ResortManagement';
import EmployeeManagement from '../pages/admin/EmployeeManagement';
import AllBookings from '../pages/admin/AllBookings';
import PaymentManagement from '../pages/admin/PaymentManagement';
import ReviewManagement from '../pages/admin/ReviewManagement';
import SystemSettings from '../pages/admin/SystemSettings';

const AdminLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const { path } = useRouteMatch();

    const menuItems = [
        { title: 'Dashboard', url: `${path}/dashboard`, icon: statsChart },
        { title: 'Resorts', url: `${path}/resorts`, icon: business },
        { title: 'Employees', url: `${path}/employees`, icon: people },
        { title: 'All Bookings', url: `${path}/bookings`, icon: calendar },
        { title: 'Payments', url: `${path}/payments`, icon: card },
        { title: 'Reviews', url: `${path}/reviews`, icon: star },
        { title: 'Settings', url: `${path}/settings`, icon: settings },
    ];

    return (
        <IonSplitPane contentId="admin-main" when="md">
            <IonMenu contentId="admin-main" type="overlay">
                <IonHeader>
                    <IonToolbar color="dark">
                        <IonTitle>Admin Panel</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent color="dark">
                    <div className="admin-profile-section">
                        <IonAvatar>
                            <img src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=6366f1&color=fff`} alt="Admin" />
                        </IonAvatar>
                        <h3>{user?.name}</h3>
                        <p>System Administrator</p>
                    </div>
                    <IonList lines="none" className="admin-menu">
                        {menuItems.map((item) => (
                            <IonMenuToggle key={item.url} autoHide={false}>
                                <IonItem routerLink={item.url} routerDirection="none" detail={false} color="dark">
                                    <IonIcon slot="start" icon={item.icon} />
                                    <IonLabel>{item.title}</IonLabel>
                                </IonItem>
                            </IonMenuToggle>
                        ))}
                        <IonItem button onClick={logout} color="dark">
                            <IonIcon slot="start" icon={logOut} color="danger" />
                            <IonLabel color="danger">Logout</IonLabel>
                        </IonItem>
                    </IonList>
                </IonContent>
            </IonMenu>

            <IonPage id="admin-main">
                <IonHeader>
                    <IonToolbar color="dark">
                        <IonButtons slot="start">
                            <IonMenuButton />
                        </IonButtons>
                        <IonTitle>Resort Management System</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <Switch>
                    <Route exact path={`${path}/dashboard`} component={AdminDashboard} />
                    <Route exact path={`${path}/resorts`} component={ResortManagement} />
                    <Route exact path={`${path}/employees`} component={EmployeeManagement} />
                    <Route exact path={`${path}/bookings`} component={AllBookings} />
                    <Route exact path={`${path}/payments`} component={PaymentManagement} />
                    <Route exact path={`${path}/reviews`} component={ReviewManagement} />
                    <Route exact path={`${path}/settings`} component={SystemSettings} />
                    <Route exact path={path}>
                        <Redirect to={`${path}/dashboard`} />
                    </Route>
                </Switch>
            </IonPage>
        </IonSplitPane>
    );
};

export default AdminLayout;
