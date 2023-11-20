import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import PropTypes from 'prop-types';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Collapse, Typography, Paper, Button, TextField } from '@mui/material';
import defaultImg from '../assets/defautlimg.png';
import portada from '../assets/portada.png';


function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

function Row({ row }) {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const [open, setOpen] = useState(false);

  // Funcion para convertir la imagen en Base64
  const convertImageToBase64 = (url, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  };


  // Generar PDF por pc
  const downloadPdf = () => {
    const pdf = new jsPDF({ orientation: 'portrait' });

    const loadImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    };

    loadImage(portada)
      .then((backgroundImage) => {
        pdf.addImage(backgroundImage, 'PNG', 0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);
        pdf.setFont('times', 'roman');
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(20);
        pdf.text('Usuario de Reporte: Admin', 50, 70);
        pdf.text('Firma:_____________________', 50, 230);
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
        pdf.text(`Fecha de Reporte: ${formattedDate}`, 50, 90);
        pdf.addPage();

        const imageUrl = defaultImg;

        convertImageToBase64(imageUrl, (base64Img) => {
          pdf.addImage(base64Img, 'PNG', 20, 15, 50, 50);
          pdf.setFontSize(14);
          pdf.text('Información Detallada Del Equipo Seleccionado Con Su Respectivo Hallazgo', 20, 70);
          pdf.setTextColor(0, 0, 0);
          // Dividir la tabla en dos partes con 5 columnas cada una
          pdf.autoTable({
            startY: 80,
            head: [['ID', 'Año de Fabricación', 'Sistema Operativo', 'CPU', 'Actualizaciones']],
            body: [
              [row.id, row.anoFabricacion, row.sistemaOperativo, row.cpu, row.actualizaciones],
            ],
          });

          pdf.autoTable({
            startY: pdf.previousAutoTable.finalY + 10, // Iniciar la segunda parte debajo de la primera
            head: [['Software Instalado', 'Dirección IP', 'Usuarios', 'Políticas', 'Registro de Eventos']],
            body: [
              [row.softwareInstalado, row.direccionIP, row.usuarios, row.politicas, row.registroEventos],
            ],
          });

          pdf.autoTable({
            startY: 140,
            head: [['HALLAZGO', 'SOLUCION']],
            body: [
              [row.hallazgos,row.solucion]
            ],
          });

          pdf.save(`${row.id}.pdf`);
        });
      })
      .catch((error) => {
        console.error('Error loading background image:', error);
      });
  };


  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">{row.id}</TableCell>
        {!isMobile && <TableCell>{row.sistemaOperativo}</TableCell>}
        <TableCell>{row.cpu}</TableCell>
        {!isMobile && <TableCell>{row.usuarios}</TableCell>}
        {!isMobile && <TableCell>{row.politicas}</TableCell>}
        <TableCell>
          <Button onClick={downloadPdf} variant="contained" size="small" style={{ backgroundColor: '#D15656', color: 'white' }}>Descargar PDF</Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">Detalles Completos</Typography>
              <Table size="small" aria-label="details">
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">Imagen</TableCell>
                    <TableCell>
                      <img
                        src={row.imagen || defaultImg}
                        alt="Imagen del Hardware"
                        style={{ maxWidth: '100px' }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">ID</TableCell>
                    <TableCell>{row.id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Año de Fabricación</TableCell>
                    <TableCell>{row.anoFabricacion}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Sistema Operativo</TableCell>
                    <TableCell>{row.sistemaOperativo}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">CPU</TableCell>
                    <TableCell>{row.cpu}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Actualizaciones</TableCell>
                    <TableCell>{row.actualizaciones}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Software Instalado</TableCell>
                    <TableCell>{row.softwareInstalado}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Dirección IP</TableCell>
                    <TableCell>{row.direccionIP}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Registro de Eventos</TableCell>
                    <TableCell>{row.registroEventos}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Hallazgos</TableCell>
                    <TableCell>{row.hallazgos}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Solucion</TableCell>
                    <TableCell>{row.solucion}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

// Definición de PropTypes para Row
Row.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    anoFabricacion: PropTypes.string,
    sistemaOperativo: PropTypes.string.isRequired,
    cpu: PropTypes.string.isRequired,
    actualizaciones: PropTypes.string,
    softwareInstalado: PropTypes.string,
    direccionIP: PropTypes.string,
    usuarios: PropTypes.string.isRequired,
    politicas: PropTypes.string.isRequired,
    registroEventos: PropTypes.string,
    hallazgos: PropTypes.string,
    solucion: PropTypes.string,
    imagen: PropTypes.any,
  }).isRequired
};

export function CollapsibleTable({ rows }) {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const [filter, setFilter] = useState('');

  const filteredRows = rows.filter(row =>
    row.sistemaOperativo.toLowerCase().includes(filter.toLowerCase()) ||
    row.cpu.toLowerCase().includes(filter.toLowerCase()) ||
    row.id.toLowerCase().includes(filter.toLowerCase())
      // Agrega el campo 'id' al filtro
  );
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Descargar todos los equipos en pdf
  const downloadAllPdf = () => {
    const pdf = new jsPDF({ orientation: 'portrait' });

    const loadImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    };

    loadImage(portada)
      .then((backgroundImage) => {
        // Agregar la imagen de fondo solo en la primera página (portada)
        pdf.addImage(backgroundImage, 'PNG', 0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);
        pdf.setFont('times', 'roman');
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(20);
        pdf.text('Usuario de Reporte: Admin', 50, 70);
        pdf.text('Firma:_____________________', 50, 230);
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
        pdf.text(`Fecha de Reporte: ${formattedDate}`, 50, 90);

        // Resto de la lógica para cada página, similar a downloadPdf
        filteredRows.forEach((row) => {
          pdf.addPage();

          pdf.setFont('times', 'roman');
          pdf.setTextColor(0, 0, 0);
          pdf.setFontSize(14);
          pdf.text('Información Detallada Del Equipo', 10, 15);
          pdf.setTextColor(0, 0, 0);
          pdf.autoTable({
            startY: 20,
            head: [['ID', 'Año de Fabricación', 'Sistema Operativo', 'CPU', 'Actualizaciones']],
            body: [
              [row.id, row.anoFabricacion, row.sistemaOperativo, row.cpu, row.actualizaciones],
            ],
          });

          pdf.autoTable({
            startY: pdf.previousAutoTable.finalY + 10,
            head: [['Software Instalado', 'Dirección IP', 'Usuarios', 'Políticas', 'Registro de Eventos']],
            body: [
              [row.softwareInstalado, row.direccionIP, row.usuarios, row.politicas, row.registroEventos],
            ],
          });

          pdf.autoTable({
            startY: 140,
            head: [['HALLAZGO', 'SOLUCION']],
            body: [
              [row.hallazgos,row.solucion]
            ],
          });
        });

        pdf.save('todos_los_equipos.pdf');
      })
      .catch((error) => {
        console.error('Error loading background image:', error);
      });
  };


  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <TextField
          type="text"
          placeholder="Buscar por PC"
          value={filter}
          onChange={handleFilterChange}
          style={{ margin: '20px', width: '80%', maxWidth: '300px' }}
        />
        <Button
          onClick={downloadAllPdf}
          variant="contained"
          size="small"
          style={{ backgroundColor: '#D15656', color: 'white', marginTop: '10px' }}
        >
          Descargar Todos
        </Button>
      </div>

      <TableContainer component={Paper} className='table-container'>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>ID</TableCell>
              {!isMobile && <TableCell>Sistema Operativo</TableCell>}
              <TableCell>CPU</TableCell>
              {!isMobile && <TableCell>Usuarios</TableCell>}
              {!isMobile && <TableCell>Políticas</TableCell>}
              <TableCell>PDF</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <Row key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

// Definición de PropTypes para CollapsibleTable
CollapsibleTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object).isRequired
};
