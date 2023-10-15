import PropTypes from "prop-types";
import NavBarComponent from "../components/NavbarComponent";
// import '../styles/homeStyle.css';

const HomeScreen = ({ onSignOut }) => {
    return (
        <div className="homeScreenContainer">
            <div className="navContainer">
                <NavBarComponent onSignOut={onSignOut} />
            </div>
        </div>
    )
}

HomeScreen.propTypes = {
    onSignOut: PropTypes.func.isRequired,
};


export default HomeScreen;