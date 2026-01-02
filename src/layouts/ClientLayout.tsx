import React from 'react';
import {
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    IonRouterOutlet
} from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import { home, search, calendar, person } from 'ionicons/icons';

// Client Pages
import HomePage from '../pages/client/HomePage';
import ExplorePage from '../pages/client/ExplorePage';
import ResortDetailPage from '../pages/client/ResortDetailPage';
import BookingsPage from '../pages/client/BookingsPage';
import ProfilePage from '../pages/client/ProfilePage';
import BookingFlowPage from '../pages/client/BookingFlowPage';

const ClientLayout: React.FC = () => {
    return (
        <IonTabs>
            <IonRouterOutlet>
                <Route exact path="/client/home" component={HomePage} />
                <Route exact path="/client/explore" component={ExplorePage} />
                <Route exact path="/client/resort/:id" component={ResortDetailPage} />
                <Route exact path="/client/book/:resortId/:roomId" component={BookingFlowPage} />
                <Route exact path="/client/bookings" component={BookingsPage} />
                <Route exact path="/client/profile" component={ProfilePage} />
                <Route exact path="/client">
                    <Redirect to="/client/home" />
                </Route>
            </IonRouterOutlet>

            <IonTabBar slot="bottom" className="client-tab-bar">
                <IonTabButton tab="home" href="/client/home">
                    <IonIcon icon={home} />
                    <IonLabel>Home</IonLabel>
                </IonTabButton>
                <IonTabButton tab="explore" href="/client/explore">
                    <IonIcon icon={search} />
                    <IonLabel>Explore</IonLabel>
                </IonTabButton>
                <IonTabButton tab="bookings" href="/client/bookings">
                    <IonIcon icon={calendar} />
                    <IonLabel>Bookings</IonLabel>
                </IonTabButton>
                <IonTabButton tab="profile" href="/client/profile">
                    <IonIcon icon={person} />
                    <IonLabel>Profile</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    );
};

export default ClientLayout;
