import PropTypes from "prop-types";
import NavBarComponent from "../components/NavbarComponent";

const AdminScreen = ({ onSignOut }) => {
    return (
        <div>
            <NavBarComponent onSignOut={onSignOut} />
            <h1>Soy administrador.</h1>
        </div>
    )
}

AdminScreen.propTypes = {
    onSignOut: PropTypes.func.isRequired,
};

export default AdminScreen;