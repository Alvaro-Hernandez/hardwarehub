import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { db, storage } from "../services/FirebaseServices";
import 'font-awesome/css/font-awesome.min.css';
import NavBarComponent from "../components/NavbarComponent";
import ConfirmationModal from "../components/ConfirmationModal";
import Autocomplete from "../components/AutoCompleteComponent";
import ErrorModal from "../components/MessageErrorModalComponent";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import defaultImg from "../assets/defautlimg.png";
import "../styles/managementStyle.css";


const ManagementHardwareScreen = ({ onSignOut }) => {
    const [previewImage, setPreviewImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [documents, setDocuments] = useState([]);
    const [selectedDocId, setSelectedDocId] = useState(null);

    const fileRef = useRef(null);
    const [formData, setFormData] = useState({
        id: "",
        anoFabricacion: "",
        sistemaOperativo: "",
        cpu: "",
        actualizaciones: "",
        softwareInstalado: "",
        direccionIP: "",
        usuarios: "",
        politicas: "",
        registroEventos: "",
        hallazgos: "",
        imagen: null
    });

    //Carga de lista de documentos
    useEffect(() => {
        const fetchData = async () => {
            const snapshot = await db.collection('hardware').get();
            const docsArray = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDocuments(docsArray);
        }

        fetchData();
    }, []);

    // Funcion para cargar el documento
    const handleDocumentClick = (document) => {
        setSelectedDocId(document.id);
        setFormData(document);
        if (document.imagen) {
            setPreviewImage(document.imagen);
        } else {
            setPreviewImage(null);
        }
    };


    const handleImageChange = e => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, imagen: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    }

    const handleImageClick = () => {
        fileRef.current.click();
    };

    const handleSaveData = () => {
        setIsModalOpen(true);
    };

    const handleConfirm = async () => {
        setIsModalOpen(false);

        try {

            let imageURL = null;

            if (formData.imagen) {
                const imageRef = storage.ref(`images/${formData.imagen.name}`);
                await imageRef.put(formData.imagen);
                imageURL = await imageRef.getDownloadURL();
            }

            // Si un documento ha sido seleccionado, actualizarlo. 
            if (selectedDocId) {
                await db.collection('hardware').doc(selectedDocId).update({
                    ...formData,
                    imagen: imageURL
                });

                // Si no, crear uno nuevo si el ID está presente.
            } else if (formData.id) {
                await db.collection('hardware').doc(formData.id).set({
                    ...formData,
                    imagen: imageURL
                });
            } else {
                throw new Error("Por favor proporciona un ID válido para la máquina.");
            }

            setFormData({
                id: "",
                anoFabricacion: "",
                sistemaOperativo: "",
                cpu: "",
                actualizaciones: "",
                softwareInstalado: "",
                direccionIP: "",
                usuarios: "",
                politicas: "",
                registroEventos: "",
                hallazgos: "",
                imagen: null
            });

            setPreviewImage(null);

            // Mostrar el toast de éxito
            toast.success("Guardado Exitoso", { position: toast.POSITION.BOTTOM_RIGHT });



        } catch (error) {
            setErrorMessage(error.message);
            setIsErrorModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="management-container">
            <div className="navContainer">
                <NavBarComponent onSignOut={onSignOut} />
            </div>
            <div className="content-wrapper">
                <div className="sidebar">
                    <Autocomplete
                        data={documents.map(doc => doc.id)}
                        onSelect={selectedItem => {
                            const selectedDocument = documents.find(doc => doc.id === selectedItem);
                            handleDocumentClick(selectedDocument);
                        }}
                    />
                </div>
                <div className="details">
                    <div className="details-list">
                        <form>
                            <div className="form-row">
                                {/* Columna de imagen */}
                                <div>
                                    <input
                                        type="file"
                                        onChange={handleImageChange}
                                        ref={fileRef}
                                        style={{ display: 'none' }}
                                    />
                                    <div onClick={handleImageClick} style={{ cursor: 'pointer', width: '200px', height: '200px', borderRadius: '10px' }}>
                                        <img
                                            src={previewImage || defaultImg}
                                            alt="Clic para cargar imagen"
                                            style={{ width: '100%', height: '100%', borderRadius: '10px' }}
                                        />
                                    </div>
                                </div>
                                {/* Columna de inputs */}
                                <div className="form-column">
                                    <div className="label-input-group">
                                        <label>ID:</label>
                                        <input type="text" value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })} />
                                    </div>
                                    <div className="label-input-group">
                                        <label>Año de Fabricación:</label>
                                        <input type="text" value={formData.anoFabricacion} onChange={e => setFormData({ ...formData, anoFabricacion: e.target.value })} />
                                    </div>
                                    <div className="label-input-group">
                                        <label>Sistema Operativo:</label>
                                        <input type="text" value={formData.sistemaOperativo} onChange={e => setFormData({ ...formData, sistemaOperativo: e.target.value })} />
                                    </div>
                                </div>
                                {/* Columna de textarea */}
                                <div className="form-column textarea">
                                    <label>CPU</label>
                                    <textarea value={formData.cpu} onChange={e => setFormData({ ...formData, cpu: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-column textarea">
                                    <label>Actualizaciones y Parches</label>
                                    <textarea value={formData.actualizaciones} onChange={e => setFormData({ ...formData, actualizaciones: e.target.value })} />
                                </div>
                                {/* Columna para Software Instalado */}
                                <div className="form-column textarea">
                                    <label>Software Instalado</label>
                                    <textarea value={formData.softwareInstalado} onChange={e => setFormData({ ...formData, softwareInstalado: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-row">
                                {/* Columna para otros campos */}
                                <div className="form-column">
                                    <div className="label-input-group">
                                        <label>Dirección IP:</label>
                                        <input type="text" value={formData.direccionIP} onChange={e => setFormData({ ...formData, direccionIP: e.target.value })} />
                                    </div>
                                    <div className="label-input-group">
                                        <label>Usuarios:</label>
                                        <input type="text" value={formData.usuarios} onChange={e => setFormData({ ...formData, usuarios: e.target.value })} />
                                    </div>
                                    <div className="label-input-group">
                                        <label>Políticas:</label>
                                        <input type="text" value={formData.politicas} onChange={e => setFormData({ ...formData, politicas: e.target.value })} />
                                    </div>
                                </div>


                                {/* Otra columna para Registro de Eventos */}
                                <div className="form-column textarea">
                                    <label>Registros de Eventos</label>
                                    <textarea value={formData.registroEventos} onChange={e => setFormData({ ...formData, registroEventos: e.target.value })} />
                                </div>
                                {/* Otra columna para Hallazgos */}
                                <div className="form-column textarea">
                                    <label>Hallazgos</label>
                                    <textarea value={formData.hallazgos} onChange={e => setFormData({ ...formData, hallazgos: e.target.value })} />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="actions">
                        <button className="btn-add">
                            <i className="fa fa-plus"></i>
                        </button>
                        <button className="btn-edit">
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn-save" onClick={handleSaveData}>
                            <i className="fa fa-floppy-o"></i>
                        </button>
                        <button className="btn-delete">
                            <i className="fa fa-trash"></i>
                        </button>
                        <button className="btn-cancel">
                            <i className="fa fa-ban"></i>
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                onConfirm={handleConfirm}
                message="¿Estás seguro de que deseas guardar estos datos?"
                title="Confirmar guardado"
            />

            <ToastContainer />

            <ErrorModal
                isOpen={isErrorModalOpen}
                onRequestClose={() => setIsErrorModalOpen(false)}
                errorMessage={errorMessage}
                title="Error al guardar"
            />
        </div>
    );
};


ManagementHardwareScreen.propTypes = {
    onSignOut: PropTypes.func.isRequired
};

export default ManagementHardwareScreen;
