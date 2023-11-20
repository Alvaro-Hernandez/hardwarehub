import { useState } from "react";
import { useLocation } from "wouter";
import { auth, db } from "../services/FirebaseServices";
import loginImg from "../assets/logoImag2.png";
import ErrorModal from "../components/MessageErrorModalComponent";
import '../styles/loginStyle.css';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [, setLocation] = useLocation();
    const [isErrorModalOPen, setIsErrorModalOpen] = useState(false);

    // Funcion para el manejo de errores
    const getErrorMessage = (errorCode) => {
        switch (errorCode) {
            case 'auth/user-not-found':
                return 'El usuario no existe, Por favor, verifica tus credenciales';
            case 'auth/wrong-password':
                return 'La contraseña es incorrecta. Por favor, intenta de nuevo.';
            case 'auth/invalid-email':
                return 'El correo electrónico no es válido. Por favor, introduce un correo electrónico válido.';
            default:
                return 'Ocurrio un error inesperado. Por favor, intenta de nuevo.';
        }
    }

    // Funcion para el maanejo de acceso
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Una vez autenticado, hay que consultar la colección de datos para obtener el rol del usuario
            const userDoc = await db.collection("usuarios").doc(user.uid).get();
            const userData = userDoc.data();
            console.log(userData);

            if (userData.role === 'admin') {
                setLocation("/admin");
            } else if (userData.role === 'invitado') {
                setLocation("/guest")
            }
        } catch (error) {
            const customErrorMessage = getErrorMessage(error.code);
            setError(customErrorMessage);
            setIsErrorModalOpen(true);
        }
    };

    //Funcion para el cierre del modal de error
    const closeErrorModal = () => {
        setIsErrorModalOpen(false);
    }

    return (
        <div className="loginContainer">
            <div className="loginImage">
                <img src={loginImg} alt="HardwareHub" />
            </div>
            <div className="loginContent">
                <h1 className="welcomeText">Bienvenidos</h1>
                <p className="loginText">Inicio de Sesión</p>
                <form className="loginForm" onSubmit={handleLogin}>
                    <input type="email"
                        placeholder="Correo Electrónico"
                        className="loginInput" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input type="password"
                        placeholder="Contraseña"
                        className="loginInput"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="loginButton">Iniciar Sesión</button>
                </form>
                {isErrorModalOPen && (
                    <ErrorModal
                        isOpen={isErrorModalOPen}
                        errorMessage={error}
                        onRequestClose={closeErrorModal}
                        title="Error Inicio de Sesion"
                    />
                )}
            </div>
        </div>
    );
};

export default LoginScreen;
