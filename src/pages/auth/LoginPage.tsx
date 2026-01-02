import React, { useState } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonText,
    IonSegment,
    IonSegmentButton,
    IonSpinner
} from '@ionic/react';
import { mailOutline, lockClosedOutline, personOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

const LoginPage: React.FC = () => {
    const history = useHistory();
    const location = useLocation();
    const { login, signup } = useAuth();

    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const params = new URLSearchParams(location.search);
    const redirectUrl = params.get('redirect') || '/client/home';

    const handleSubmit = async () => {
        setError('');
        setIsLoading(true);

        try {
            if (mode === 'login') {
                const user = await login(email, password);
                if (user) {
                    if (user.role === 'admin') {
                        history.replace('/admin/dashboard');
                    } else if (user.role === 'employee') {
                        history.replace('/employee/dashboard');
                    } else {
                        history.replace('/client/home');
                    }
                } else {
                    setError('Invalid email or password');
                }
            } else {
                if (!name.trim()) {
                    setError('Please enter your name');
                    setIsLoading(false);
                    return;
                }
                const success = await signup(name, email, password);
                if (success) {
                    history.replace('/client/home');
                } else {
                    setError('Email already exists');
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const demoLogins = [
        { label: 'Guest', email: 'guest@example.com', password: 'guest123' },
        { label: 'Staff', email: 'employee@resort.com', password: 'employee123' },
        { label: 'Admin', email: 'admin@resort.com', password: 'admin123' },
    ];

    const handleDemoLogin = (email: string, password: string) => {
        setEmail(email);
        setPassword(password);
        setMode('login');
    };

    return (
        <IonPage>
            <IonContent className="login-content">
                <div className="login-container">
                    {/* Header */}
                    <div className="login-header">
                        <div className="logo">
                            <span className="logo-icon">🏝️</span>
                            <h1>ResortBook</h1>
                        </div>
                        <p>Discover and book amazing resorts</p>
                    </div>

                    {/* Segment */}
                    <IonSegment value={mode} onIonChange={e => setMode(e.detail.value as 'login' | 'signup')}>
                        <IonSegmentButton value="login">
                            <IonLabel>Sign In</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="signup">
                            <IonLabel>Sign Up</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>

                    {/* Form */}
                    <div className="login-form">
                        {mode === 'signup' && (
                            <div className="input-group">
                                <IonIcon icon={personOutline} />
                                <IonInput
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onIonInput={e => setName(e.detail.value!)}
                                />
                            </div>
                        )}

                        <div className="input-group">
                            <IonIcon icon={mailOutline} />
                            <IonInput
                                type="email"
                                placeholder="Email"
                                value={email}
                                onIonInput={e => setEmail(e.detail.value!)}
                            />
                        </div>

                        <div className="input-group">
                            <IonIcon icon={lockClosedOutline} />
                            <IonInput
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onIonInput={e => setPassword(e.detail.value!)}
                            />
                            <IonButton fill="clear" onClick={() => setShowPassword(!showPassword)}>
                                <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                            </IonButton>
                        </div>

                        {error && (
                            <div className="error-message">
                                <IonText color="danger">{error}</IonText>
                            </div>
                        )}

                        <IonButton
                            expand="block"
                            className="submit-btn"
                            onClick={handleSubmit}
                            disabled={isLoading || !email || !password}
                        >
                            {isLoading ? <IonSpinner /> : (mode === 'login' ? 'Sign In' : 'Create Account')}
                        </IonButton>

                        {mode === 'login' && (
                            <IonButton fill="clear" className="forgot-btn">
                                Forgot Password?
                            </IonButton>
                        )}
                    </div>

                    {/* Demo Accounts */}
                    <div className="demo-section">
                        <p>Quick Demo Login:</p>
                        <div className="demo-buttons">
                            {demoLogins.map((demo) => (
                                <IonButton
                                    key={demo.label}
                                    fill="outline"
                                    size="small"
                                    onClick={() => handleDemoLogin(demo.email, demo.password)}
                                >
                                    {demo.label}
                                </IonButton>
                            ))}
                        </div>
                    </div>

                    {/* Skip */}
                    <IonButton
                        fill="clear"
                        className="skip-btn"
                        onClick={() => history.replace('/client/home')}
                    >
                        Continue as Guest
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default LoginPage;
