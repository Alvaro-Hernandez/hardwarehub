import PropTypes from "prop-types";
import Modal from 'react-modal';
import "../styles/confirmationModalStyle.css";

Modal.setAppElement('#root');

function ConfirmationModal({ isOpen, onRequestClose, onConfirm, message, title }) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Confirmation Modal"
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
            <div className="confirmation-modal">
                <h2>{title}</h2>
                <p>{message}</p>
                <div className="button-container">
                    <button className="create-button" onClick={onConfirm}>Aceptar</button>
                    <button className="cancel-button" onClick={onRequestClose}>Cancelar</button>
                </div>
            </div>
        </Modal>
    );
}

ConfirmationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
};

export default ConfirmationModal;
