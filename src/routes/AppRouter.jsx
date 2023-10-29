import { useState, useEffect } from "react";
import { Route, Switch } from "wouter";
import { useLocation } from "wouter";
import { auth, db } from "../services/FirebaseServices";
import SplashScreen from "../pages/SplashScreen";
import LoginScreen from "../pages/LoginScreen";
import HomeScreen from "../pages/HomeScreen";
import GuestScreen from "../pages/GuestScreen";
import ManagementHardwareScreen from "../pages/ManagementHardwareScreen";
import ReportHardwareScreen from "../pages/ReportHardwareScreen";

const AppRouter = () => {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [role, setRole] = useState("");
    const [initialCheckDone, setInitialCheckDone] = useState(false);
    const [, setLocation] = useLocation();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                const userDoc = await db.collection("usuarios").doc(currentUser.uid).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    setRole(userData.role);
                    setLoggedIn(true);
                }
            } else {
                setRole("");
                setLoggedIn(false);
            }
            setInitialCheckDone(true);
        });

        return () => unsubscribe();
    }, []);

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            setLoggedIn(false);
            setRole("");
            setLocation("/login");

        } catch (error) {

            console.error("Error al cerrar sesión:", error);
        }
    }

    if (!initialCheckDone) {
        return null;
    }

    return (
        <Switch>
            <Route path="/" component={SplashScreen} />
            <Route path="/login">
                <LoginScreen onSignOut={isLoggedIn && role === "admin" ? handleSignOut : undefined} />
            </Route>
            <Route path="/guest">
                {() => {
                    if (role === "invitado" && isLoggedIn) {
                        return <GuestScreen onSignOut={handleSignOut} />;
                    }
                    return <LoginScreen />;
                }}
            </Route>
            <Route path="/admin">
                {() => {
                    if (role === "admin" && isLoggedIn) {
                        return <HomeScreen onSignOut={handleSignOut} />;
                    }
                    return <LoginScreen />;
                }}
            </Route>
            <Route path="/managementHardware">
                <ManagementHardwareScreen onSignOut={handleSignOut} />
            </Route>
            <Route path="/reportHardWare">
                <ReportHardwareScreen onSignOut={handleSignOut} />
            </Route>
        </Switch>
    );
};

export default AppRouter;
