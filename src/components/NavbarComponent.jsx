import { useState } from "react";
import PropTypes from "prop-types";
import ErrorModal from "./MessageErrorModalComponent";
import logoFull from "../assets/logo.png";
import '../styles/navStyle.css';

const NavBarComponent = ({ onSignOut }) => {
    const [isErrorModalOpen, setErrorModalOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);  // Controla el estado del menú de hamburguesa.
    const [errorMsg, setErrorMsg] = useState("");

    const handleSignOut = () => {
        try {
            onSignOut();
        } catch (error) {
            setErrorMsg("Error al cerrar sesión.");
            setErrorModalOpen(true);
        }
    };

    return (
        <nav>
            <div className="navbar">
                <div className="logo">
                    <img className="full-logo" src={logoFull} alt="CartiLife" />
                </div>
                <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
                    ☰
                </button>
                <div className={`links ${menuOpen ? 'open' : ''}`}>
                    <a href="https://www.unan.edu.ni/" className="nav-link">UNAN-Managua</a>
                    <a href="mailto:alvaropineda606@gmail.com?subject=Consulta desde la página web" className="nav-link">Contactanos</a>
                    <button onClick={handleSignOut} className="signout-btn">Cerrar Sesion</button>
                </div>
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
