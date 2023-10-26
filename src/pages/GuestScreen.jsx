import PropTypes from "prop-types";
import NavBarComponent from "../components/NavbarComponent";

const GuestScreen = ({ onSignOut }) => {
    return (
        <div>
            <NavBarComponent onSignOut={onSignOut} />
            <h1>Soy administrador.</h1>
        </div>
    )
}

GuestScreen.propTypes = {
    onSignOut: PropTypes.func.isRequired,
};

export default GuestScreen;