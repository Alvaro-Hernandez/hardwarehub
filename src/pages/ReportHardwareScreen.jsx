import PropTypes from "prop-types";
import NavBarComponent from "../components/NavbarComponent";

const ReportHardwareScreen = ({ onSignOut }) => {
    return (
        <div>
            <NavBarComponent onSignOut={onSignOut} />
            <h1>Soy administrador.</h1>
        </div>
    )
}

ReportHardwareScreen.propTypes = {
    onSignOut: PropTypes.func.isRequired,
};

export default ReportHardwareScreen;