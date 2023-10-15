import { useState, useEffect } from "react";
import { Route, Switch } from "wouter";
import SplashScreen from "../pages/SplashScreen";
import LoginScreen from "../pages/LoginScreen";
import HomeScreen from "../pages/HomeScreen";
import AdminScreen from "../pages/AdminScreen";
import { auth, db } from "../services/FirebaseServices";

const AppRouter = () => {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [role, setRole] = useState("");
    const [initialCheckDone, setInitialCheckDone] = useState(false);

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

        } catch (error) {

            console.error("Error al cerrar sesión:", error);
        }
    }

    if (!initialCheckDone) {
        return null;
    }

    return (
        <Switch>
            <Route path="/" component={() => <SplashScreen />} />
            <Route path="/login">
                {!isLoggedIn ? <LoginScreen /> : role === "admin" ? <AdminScreen onSignOut={handleSignOut} /> : <LoginScreen />}
            </Route>
            <Route path="/home">
                {role === "invitado" && isLoggedIn ? <HomeScreen onSignOut={handleSignOut} /> : <LoginScreen />}
            </Route>
            <Route path="/admin">
                {role === "admin" && isLoggedIn ? <AdminScreen onSignOut={handleSignOut} /> : <LoginScreen />}
            </Route>
        </Switch>
    );
};

export default AppRouter;
