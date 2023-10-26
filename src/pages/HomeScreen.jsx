import PropTypes from "prop-types";
import NavBarComponent from "../components/NavbarComponent";
import CardFunction from "../components/CardFunctionComponent";
import imgGestion from "../assets/gestionHardware.png";
import imgInforme from "../assets/informeHardware.png";
import '../styles/homeStyle.css';

const HomeScreen = ({ onSignOut }) => {
    return (
        <div className="homeScreenContainer">
            <div className="navContainer">
                <NavBarComponent onSignOut={onSignOut} />
            </div>
            <div className="itemContainer">
                <div className="cardsContainer">
                    <CardFunction
                        imageSrc={imgGestion}
                        text="Gestión de Hardware"
                        route="/managementHardware"
                    />
                    <CardFunction
                        imageSrc={imgInforme}
                        text="Informe de Hardware"
                        route="/reportHardWare"
                    />
                </div>
            </div>
        </div>
    )
}

HomeScreen.propTypes = {
    onSignOut: PropTypes.func.isRequired,
};


export default HomeScreen;