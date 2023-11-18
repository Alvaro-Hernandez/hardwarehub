import { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Collapse, Typography, Paper, Button } from '@mui/material';
import PropTypes from 'prop-types';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import defaultImg from '../assets/defautlimg.png';

function Row({ row }) {
  const [open, setOpen] = useState(false);

  // Funcion para convertir la imagen en Base64
  const convertImageToBase64 = (url, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      const reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  };

    //Funcion para descargar PDF
  const downloadPdf = () => {
    const pdf = new jsPDF();

    // Define la imagen que se va a utilizar
    const imageUrl = row.imagen || defaultImg;

    convertImageToBase64(imageUrl, (base64Img) => {
      // Agrega la imagen al PDF
      pdf.addImage(base64Img, 'PNG', 10, 10, 50, 50); // Ajusta las coordenadas y el tamaño según necesites

      // Agrega la tabla de datos
      pdf.text('Detalles del Hardware', 10, 70); // Ajusta la posición del texto según necesites
      pdf.autoTable({
        startY: 80, // Asegúrate de que la tabla comience debajo de la imagen
        head: [['ID', 'Año de Fabricación', 'Sistema Operativo', 'CPU', 'Actualizaciones', 'Software Instalado', 'Dirección IP', 'Usuarios', 'Políticas', 'Registro de Eventos', 'Hallazgos']],
        body: [
          [row.id, row.anoFabricacion, row.sistemaOperativo, row.cpu, row.actualizaciones, row.softwareInstalado, row.direccionIP, row.usuarios, row.politicas, row.registroEventos, row.hallazgos]
        ],
      });

      pdf.save(`${row.id}.pdf`);
    });
  }
  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">{row.id}</TableCell>
        <TableCell>{row.sistemaOperativo}</TableCell>
        <TableCell>{row.cpu}</TableCell>
        <TableCell>{row.usuarios}</TableCell>
        <TableCell>{row.politicas}</TableCell>
        <TableCell>
        <Button onClick={downloadPdf} variant="contained" size="small">Descargar PDF</Button>
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
      imagen: PropTypes.any,
    }).isRequired
  };

export function CollapsibleTable({ rows }) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>ID</TableCell>
            <TableCell>Sistema Operativo</TableCell>
            <TableCell>CPU</TableCell>
            <TableCell>Usuarios</TableCell>
            <TableCell>Políticas</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

CollapsibleTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object).isRequired
};
