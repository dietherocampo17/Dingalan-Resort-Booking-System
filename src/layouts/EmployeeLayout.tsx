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
    IonBadge
} from '@ionic/react';
import { Route, Switch, Redirect, useRouteMatch } from 'react-router-dom';
import {
    home,
    calendar,
    bed,
    people,
    notifications,
    logOut
} from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';

// Employee Pages
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';
import BookingManagement from '../pages/employee/BookingManagement';
import GuestManagement from '../pages/employee/GuestManagement';
import AvailabilityManagement from '../pages/employee/AvailabilityManagement';

const EmployeeLayout: React.FC = () => {
    const { logout } = useAuth();
    const { path } = useRouteMatch();

    const menuItems = [
        { title: 'Dashboard', url: `${path}/dashboard`, icon: home },
        { title: 'Bookings', url: `${path}/bookings`, icon: calendar, badge: 3 },
        { title: 'Availability', url: `${path}/availability`, icon: bed },
        { title: 'Guests', url: `${path}/guests`, icon: people },
    ];

    return (
        <IonSplitPane contentId="employee-main" when="md">
            <IonMenu contentId="employee-main" type="overlay" className="employee-menu-drawer">
                <IonHeader>
                    <IonToolbar color="primary">
                        <IonTitle>Staff Portal</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonList lines="none" className="employee-menu">
                        {menuItems.map((item) => (
                            <IonMenuToggle key={item.url} autoHide={false}>
                                <IonItem routerLink={item.url} routerDirection="none" detail={false}>
                                    <IonIcon slot="start" icon={item.icon} />
                                    <IonLabel>{item.title}</IonLabel>
                                    {item.badge && (
                                        <IonBadge color="danger" slot="end">{item.badge}</IonBadge>
                                    )}
                                </IonItem>
                            </IonMenuToggle>
                        ))}
                        <IonItem button onClick={logout}>
                            <IonIcon slot="start" icon={logOut} />
                            <IonLabel>Logout</IonLabel>
                        </IonItem>
                    </IonList>
                </IonContent>
            </IonMenu>

            <IonPage id="employee-main">
                <IonHeader>
                    <IonToolbar color="primary">
                        <IonButtons slot="start">
                            <IonMenuButton />
                        </IonButtons>
                        <IonTitle>Resort Staff</IonTitle>
                        <IonButtons slot="end">
                            <IonIcon icon={notifications} style={{ fontSize: '24px', marginRight: '16px' }} />
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <Switch>
                    <Route exact path={`${path}/dashboard`} component={EmployeeDashboard} />
                    <Route exact path={`${path}/bookings`} component={BookingManagement} />
                    <Route exact path={`${path}/availability`} component={AvailabilityManagement} />
                    <Route exact path={`${path}/guests`} component={GuestManagement} />
                    <Route exact path={path}>
                        <Redirect to={`${path}/dashboard`} />
                    </Route>
                </Switch>
            </IonPage>
        </IonSplitPane>
    );
};

export default EmployeeLayout;
