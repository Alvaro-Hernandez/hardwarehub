import { useState } from "react";
import PropTypes from "prop-types";
import ErrorModal from "./MessageErrorModalComponent";
// import '../styles/navStyle.css';
// import logo from "../assets/logo.png";

const NavBarComponent = ({ onSignOut }) => {

    const [isErrorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSignOunt = () => {
        try {
            onSignOut(); // Notifica al componente padre que el usuario ha "cerrado sesión"
        } catch (error) {
            setErrorMsg("Error al cerrar sesión.");
            setErrorModalOpen(true);
        }
    };

    return (
        <nav>
            <div className="navbar">
                <div className="logo">
                    {/* <img src={logo} alt="CartiLife" /> */}
                </div>
                <button onClick={handleSignOunt} className="signout-btn">Cerrar Sesion</button>
            </div>
            <ErrorModal
                isOpen={isErrorModalOpen}
                onRequestClose={() => setErrorModalOpen(false)}
                errorMessage={errorMsg}
            />
        </nav>
    )
}

NavBarComponent.propTypes = {
    onSignOut: PropTypes.func.isRequired,
};

export default NavBarComponent;