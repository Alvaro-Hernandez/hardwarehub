import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { db, storage } from "../services/FirebaseServices";
import "font-awesome/css/font-awesome.min.css";
import Select from "react-select";
import NavBarComponent from "../components/NavbarComponent";
import ConfirmationModal from "../components/ConfirmationModal";
import ErrorModal from "../components/MessageErrorModalComponent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import defaultImg from "../assets/defautlimg.png";
import "../styles/managementStyle.css";
import { validateForm } from "../functions/validateForms";

const ManagementHardwareScreen = ({ onSignOut }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileRef = useRef(null);
  const [formErrors, setFormErrors] = useState(false);
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
    imagen: null,
  });

  //Estado de botones
  const [isButtonsDisabled, setButtonsDisabled] = useState({
    new: false,
    edit: true,
    delete: true,
    save: true,
    cancel: true,
  });

  //Carga de lista de documentos
  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await db.collection("hardware").get();
      const docsArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDocuments(docsArray);
    };

    fetchData();
  }, []);

  // Funcion para cargar el documento
  const handleDocumentClick = (document) => {
    setIsUpdating(true);
    setIsEditable(false);
    setSelectedDocId(document.id);
    setFormData(document);
    if (document.imagen) {
      setPreviewImage(document.imagen);
    } else {
      setPreviewImage(defaultImg);
    }
    setButtonsDisabled({
      new: false,
      edit: false,
      delete: false,
      save: true,
      cancel: false,
    });
  };

  //Funcion para nuevo registro
  const handleNewClick = () => {
    setPreviewImage(defaultImg);
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
      imagen: null,
    });
    setSelectedDocId(null);
    setIsEditable(true);
    setButtonsDisabled({
      new: true,
      edit: true,
      delete: true,
      save: false,
      cancel: false,
    });
  };

  //Funcion para editar
  const handleEditClick = () => {
    setIsEditable(true);
    setButtonsDisabled({
      new: true,
      edit: true,
      delete: true,
      save: false,
      cancel: false,
    });
  };

  //Funcion para eliminar un documento
  const handleDeleteClick = () => {
    if (selectedDocId) {
      setIsDeleting(true);
      setIsModalOpen(true);
    } else {
      setErrorMessage("Por favor, selecciona un registro para eliminar.");
      setIsErrorModalOpen(true);
    }
  };

  //Funcion para cancelar las acciones:
  const handleCancelClick = () => {
    setPreviewImage(defaultImg);
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
      imagen: null,
    });
    setIsEditable(false);
    setIsUpdating(false);
    setSelectedDocId(null);
    setFormErrors({});
    setButtonsDisabled({
      new: false,
      edit: true,
      delete: true,
      save: true,
      cancel: true,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imagen: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    fileRef.current.click();
  };

  const handleSaveData = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    setIsModalOpen(false);

    //Validar formulario antes de cualquier operacion
    const isFormValid = validateForm(
      formData,
      setFormErrors,
      setErrorMessage,
      setIsErrorModalOpen
    );

    // Si el formulario no es validacion, detener ejecucion
    if (!isFormValid) return;

    // Si está en modo eliminación
    if (isDeleting) {
      try {
        //Paso 1. Para eliminar la imagen es obtener la URL de la imagen del documento
        const docRef = await db.collection("hardware").doc(selectedDocId).get();
        const imageUrl = docRef.data().imagen;

        //Solo proceder si hay una imagen en el documento
        if (imageUrl) {
          //Paso 2. Usar la URL para obtener la referencia a la imagen en el Storage
          const imageRef = storage.refFromURL(imageUrl);

          //Paso 3.Eliminar la imagen del Storage
          await imageRef.delete();
        }

        // Paso 4. Eliminar el documento
        await db.collection("hardware").doc(selectedDocId).delete();

        // Limpia el formulario y recarga los documentos
        setSelectedDocId(null);
        setPreviewImage(null);
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
          imagen: null,
        });

        //Cargar la lista
        const fetchData = async () => {
          const snapshot = await db.collection("hardware").get();
          const docsArray = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setDocuments(docsArray);
        };

        fetchData();

        toast.success("Registro eliminado exitosamente", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });

        setIsDeleting(false);
        setIsUpdating(false);
      } catch (error) {
        setErrorMessage(error.message);
        setIsErrorModalOpen(true);
      } finally {
        setIsDeleting(false);
        setIsUpdating(false);
      }
    }
    // Si no está en modo eliminación (Actualización/Guardado)
    else {
      try {
        let imageURL = null;

        // Si una nueva imagen fue seleccionada, cargarla y obtener su URL
        if (formData.imagen && formData.imagen instanceof File) {
          const imageRef = storage.ref(`images/${formData.imagen.name}`);
          await imageRef.put(formData.imagen);
          imageURL = await imageRef.getDownloadURL();
        }

        // Si un documento ha sido seleccionado, actualizarlo
        if (selectedDocId) {
          if (imageURL) {
            await db
              .collection("hardware")
              .doc(selectedDocId)
              .update({
                ...formData,
                imagen: imageURL,
              });
          } else {
            // eslint-disable-next-line no-unused-vars
            const { imagen, ...rest } = formData; // Excluye imagen de formData
            await db.collection("hardware").doc(selectedDocId).update(rest);
          }

          //Cargar la lista
          const fetchData = async () => {
            const snapshot = await db.collection("hardware").get();
            const docsArray = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setDocuments(docsArray);
          };

          fetchData();

          toast.success("Actualizado exitosamente", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        }
        // Si no, crear uno nuevo si el ID está presente
        else if (formData.id) {
          await db
            .collection("hardware")
            .doc(formData.id)
            .set({
              ...formData,
              imagen: imageURL,
            });

          //Cargar la lista
          const fetchData = async () => {
            const snapshot = await db.collection("hardware").get();
            const docsArray = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setDocuments(docsArray);
          };

          fetchData();

          toast.success("Guardado exitosamente", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        } else {
          throw new Error(
            "Por favor proporciona un ID válido para la máquina."
          );
        }

        setPreviewImage(null);
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
          imagen: null,
        });
      } catch (error) {
        setErrorMessage(error.message);
        setIsErrorModalOpen(true);
      }
    }

    setButtonsDisabled({
      new: false,
      edit: false,
      delete: false,
      save: true,
      cancel: true,
    });
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
          <Select
            options={documents.map((doc) => ({ value: doc.id, label: doc.id }))}
            value={
              formData.id ? { value: formData.id, label: formData.id } : null
            }
            onChange={(selectedOption) => {
              const selectedDocument = documents.find(
                (doc) => doc.id === selectedOption.value
              );
              handleDocumentClick(selectedDocument);
            }}
            placeholder="Selecciona o busca un ID"
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
                    disabled={!isEditable}
                    style={{ display: "none" }}
                  />
                  <div
                    onClick={handleImageClick}
                    style={{
                      cursor: "pointer",
                      width: "200px",
                      height: "200px",
                      borderRadius: "10px",
                    }}
                  >
                    <img
                      src={previewImage || defaultImg}
                      alt="Clic para cargar imagen"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "10px",
                      }}
                    />
                  </div>
                </div>
                {/* Columna de inputs */}
                <div className="form-column">
                  <div className="label-input-group">
                    <label>ID:</label>
                    <input
                      type="text"
                      value={formData.id}
                      onChange={(e) =>
                        setFormData({ ...formData, id: e.target.value })
                      }
                      disabled={!!selectedDocId || !isEditable}
                      className={formErrors.id ? "input-error" : ""}
                    />
                    {formErrors.id && (
                      <span className="error-message">{formErrors.id}</span>
                    )}
                  </div>
                  <div className="label-input-group">
                    <label>Año de Fabricación:</label>
                    <input
                      type="text"
                      value={formData.anoFabricacion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          anoFabricacion: e.target.value,
                        })
                      }
                      disabled={!isEditable}
                      className={formErrors.anoFabricacion ? "input-error" : ""}
                    />
                    {formErrors.anoFabricacion && (
                      <span className="error-message">
                        {formErrors.anoFabricacion}
                      </span>
                    )}
                  </div>
                  <div className="label-input-group">
                    <label>Sistema Operativo:</label>
                    <input
                      type="text"
                      value={formData.sistemaOperativo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sistemaOperativo: e.target.value,
                        })
                      }
                      disabled={!isEditable}
                      className={
                        formErrors.sistemaOperativo ? "input-error" : ""
                      }
                    />
                    {formErrors.sistemaOperativo && (
                      <span className="error-message">
                        {formErrors.sistemaOperativo}
                      </span>
                    )}
                  </div>
                </div>
                {/* Columna de textarea */}
                <div className="form-column textarea">
                  <label>CPU</label>
                  <textarea
                    value={formData.cpu}
                    onChange={(e) =>
                      setFormData({ ...formData, cpu: e.target.value })
                    }
                    disabled={!isEditable}
                    className={
                      formErrors.softwareInstalado ? "textarea-error" : ""
                    }
                  />
                  {formErrors.softwareInstalado && (
                    <span className="error-message">
                      {formErrors.softwareInstalado}
                    </span>
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="form-column textarea">
                  <label>Actualizaciones y Parches</label>
                  <textarea
                    value={formData.actualizaciones}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        actualizaciones: e.target.value,
                      })
                    }
                    disabled={!isEditable}
                    className={
                      formErrors.actualizaciones ? "textarea-error" : ""
                    }
                  />
                  {formErrors.actualizaciones && (
                    <span className="error-message">
                      {formErrors.actualizaciones}
                    </span>
                  )}
                </div>
                {/* Columna para Software Instalado */}
                <div className="form-column textarea">
                  <label>Software Instalado</label>
                  <textarea
                    value={formData.softwareInstalado}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        softwareInstalado: e.target.value,
                      })
                    }
                    disabled={!isEditable}
                    className={
                      formErrors.softwareInstalado ? "textarea-error" : ""
                    }
                  />
                  {formErrors.softwareInstalado && (
                    <span className="error-message">
                      {formErrors.softwareInstalado}
                    </span>
                  )}
                </div>
              </div>
              <div className="form-row">
                {/* Columna para otros campos */}
                <div className="form-column">
                  <div className="label-input-group">
                    <label>Dirección IP:</label>
                    <input
                      type="text"
                      value={formData.direccionIP}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          direccionIP: e.target.value,
                        })
                      }
                      disabled={!isEditable}
                      className={formErrors.direccionIP ? "input-error" : ""}
                    />
                    {formErrors.direccionIP && (
                      <span className="error-message">
                        {formErrors.direccionIP}
                      </span>
                    )}
                  </div>
                  <div className="label-input-group">
                    <label>Usuarios:</label>
                    <input
                      type="text"
                      value={formData.usuarios}
                      onChange={(e) =>
                        setFormData({ ...formData, usuarios: e.target.value })
                      }
                      disabled={!isEditable}
                      className={formErrors.usuarios ? "input-error" : ""}
                    />
                    {formErrors.usuarios && (
                      <span className="error-message">
                        {formErrors.usuarios}
                      </span>
                    )}
                  </div>
                  <div className="label-input-group">
                    <label>Políticas:</label>
                    <input
                      type="text"
                      value={formData.politicas}
                      onChange={(e) =>
                        setFormData({ ...formData, politicas: e.target.value })
                      }
                      disabled={!isEditable}
                      className={formErrors.politicas ? "input-error" : ""}
                    />
                    {formErrors.politicas && (
                      <span className="error-message">
                        {formErrors.politicas}
                      </span>
                    )}
                  </div>
                </div>

                {/* Otra columna para Registro de Eventos */}
                <div className="form-column textarea">
                  <label>Registros de Eventos</label>
                  <textarea
                    value={formData.registroEventos}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        registroEventos: e.target.value,
                      })
                    }
                    disabled={!isEditable}
                    className={
                      formErrors.registroEventos ? "textarea-error" : ""
                    }
                  />
                  {formErrors.registroEventos && (
                    <span className="error-message">
                      {formErrors.registroEventos}
                    </span>
                  )}
                </div>
                {/* Otra columna para Hallazgos */}
                <div className="form-column textarea">
                  <label>Hallazgos</label>
                  <textarea
                    value={formData.hallazgos}
                    onChange={(e) =>
                      setFormData({ ...formData, hallazgos: e.target.value })
                    }
                    disabled={!isEditable}
                    className={formErrors.hallazgos ? "textarea-error" : ""}
                  />
                  {formErrors.hallazgos && (
                    <span className="error-message">
                      {formErrors.hallazgos}
                    </span>
                  )}
                </div>
              </div>
            </form>
          </div>
          <div className="actions">
            <button
              className="btn-add"
              onClick={handleNewClick}
              disabled={isButtonsDisabled.new}
            >
              <i className="fa fa-plus"></i>
            </button>
            <button
              className="btn-edit"
              onClick={handleEditClick}
              disabled={isButtonsDisabled.edit}
            >
              <i className="fa fa-pencil"></i>
            </button>
            <button
              className="btn-delete"
              onClick={handleDeleteClick}
              disabled={isButtonsDisabled.delete}
            >
              <i className="fa fa-trash"></i>
            </button>
            <button
              className="btn-save"
              onClick={handleSaveData}
              disabled={isButtonsDisabled.save}
            >
              <i className="fa fa-floppy-o"></i>
            </button>
            <button
              className="btn-cancel"
              onClick={handleCancelClick}
              disabled={isButtonsDisabled.cancel}
            >
              <i className="fa fa-ban"></i>
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        onConfirm={handleConfirm}
        message={
          isDeleting
            ? "¿Estás seguro de que deseas eliminar este registro?"
            : isUpdating
            ? "¿Desea actualizar la información de la PC?"
            : "¿Estás seguro de que deseas guardar estos datos?"
        }
        title={
          isDeleting
            ? "Confirmar eliminación"
            : isUpdating
            ? "Confirmar actualización"
            : "Confirmar guardado"
        }
      />

      <ToastContainer />

      <ErrorModal
        isOpen={isErrorModalOpen}
        onRequestClose={() => setIsErrorModalOpen(false)}
        errorMessage={errorMessage}
        title="Error Inesperado"
      />
    </div>
  );
};

ManagementHardwareScreen.propTypes = {
  onSignOut: PropTypes.func.isRequired,
};

export default ManagementHardwareScreen;
