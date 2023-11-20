export const validateForm = (
  formData,
  setErrors,
  setErrorMessage,
  setIsErrorModalOpen
) => {
  const newErrors = {};
  let isValid = true;

  // Lista de todos los campos requeridos para validación
  const requiredFields = {
    id: "ID",
    anoFabricacion: "Año de Fabricación",
    sistemaOperativo: "Sistema Operativo",
    cpu: "CPU",
    actualizaciones: "Actualizaciones y Parches",
    softwareInstalado: "Software Instalado",
    direccionIP: "Dirección IP",
    usuarios: "Usuarios",
    politicas: "Políticas",
    registroEventos: "Registros de Eventos",
    hallazgos: "Hallazgos",
    solucion: "Solución",
  };

  // Verifica cada campo y agrega un mensaje de error si está vacío
  for (const [key, fieldName] of Object.entries(requiredFields)) {
    if (!formData[key]) {
      newErrors[key] = `El campo ${fieldName} es requerido.`;
      isValid = false;
    } else if (
      key === "usuarios" &&
      typeof formData[key] === "number" &&
      formData[key] === 0
    ) {
      newErrors[key] = `El campo ${fieldName} no puede ser igual a cero.`;
      isValid = false;
    }
  }

  // Actualizar el estado de errores con los errores encontrados
  setErrors(newErrors);

  // Si hay errores, configura el mensaje y muestra el modal de error
  if (!isValid) {
    setErrorMessage("Por favor completa todos los campos requeridos.");
    setIsErrorModalOpen(true);
  }

  return isValid;
};
