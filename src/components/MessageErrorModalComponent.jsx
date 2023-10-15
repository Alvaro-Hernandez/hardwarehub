import PropTypes from "prop-types";
import Modal from 'react-modal';
import "../styles/errorModalStyle.css";

Modal.setAppElement('#root');

function ErrorModal({ isOpen, onRequestClose, errorMessage }) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Error Modal"
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
                content: {
                    border: 'none',
                    background: 'none'
                }
            }}
        >
            <div className="error-modal">
                <h2>Error de inicio de sesión</h2>
                <p>{errorMessage}</p>
                <button onClick={onRequestClose}>Cerrar</button>
            </div>
        </Modal>
    );
}

ErrorModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    errorMessage: PropTypes.string.isRequired,
};

export default ErrorModal;
