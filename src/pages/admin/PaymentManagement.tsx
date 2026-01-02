import React from 'react';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonBadge, IonButton } from '@ionic/react';
import './PaymentManagement.css';

const PaymentManagement: React.FC = () => {
    const payments = [
        { id: '1', guest: 'John Traveler', amount: 16500, method: 'GCash', status: 'completed', date: '2024-12-25' },
        { id: '2', guest: 'Maria Santos', amount: 8000, method: 'Card', status: 'pending', date: '2024-12-28' },
        { id: '3', guest: 'Carlos Reyes', amount: 12000, method: 'Bank', status: 'refunded', date: '2024-12-20' },
    ];

    return (
        <IonContent className="payment-management">
            <div className="page-header">
                <h1>Payment Management</h1>
                <p>Track and manage all payments</p>
            </div>

            <div className="stats-row">
                <IonCard className="stat-card"><IonCardContent><span className="value">₱45,500</span><span className="label">Total Revenue</span></IonCardContent></IonCard>
                <IonCard className="stat-card"><IonCardContent><span className="value">2</span><span className="label">Pending</span></IonCardContent></IonCard>
                <IonCard className="stat-card"><IonCardContent><span className="value">1</span><span className="label">Refunds</span></IonCardContent></IonCard>
            </div>

            <IonCard className="payments-card">
                <IonCardHeader><IonCardTitle>Recent Transactions</IonCardTitle></IonCardHeader>
                <IonCardContent>
                    <IonList lines="none">
                        {payments.map(p => (
                            <IonItem key={p.id} className="payment-item">
                                <IonLabel>
                                    <h3>{p.guest}</h3>
                                    <p>{p.method} · {new Date(p.date).toLocaleDateString()}</p>
                                </IonLabel>
                                <div slot="end" className="payment-end">
                                    <span className="amount">₱{p.amount.toLocaleString()}</span>
                                    <IonBadge color={p.status === 'completed' ? 'success' : p.status === 'pending' ? 'warning' : 'medium'}>{p.status}</IonBadge>
                                </div>
                            </IonItem>
                        ))}
                    </IonList>
                </IonCardContent>
            </IonCard>
        </IonContent>
    );
};

export default PaymentManagement;
