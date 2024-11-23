const express = require('express');
const cors = require('cors');
const path = require('path');

// Importar solo los routers que se están usando
const categoriasRouter = require('./src/routers/categorias.routers');
const productosRouter = require('./src/routers/productos.routers');
const reviewsRouter = require('./src/routers/reviews.routers');
const usuariosRouter = require('./src/routers/usuarios.routers');

const app = express();
const port = process.env.PORT || 5000;

// Middlewares esenciales
app.use(express.json());
app.use(cors());

// Configuración de rutas de archivos
const basePath = path.resolve(__dirname);
const uploadsPath = path.join(basePath, 'src', 'uploads');

// Servir archivos estáticos
app.use('/uploads', express.static(uploadsPath));
app.use(express.static(path.join(basePath, 'src', 'pages')));

// Manejo de archivos de uploads
app.get('/uploads/:filename', (req, res) => {
    const filePath = path.join(uploadsPath, req.params.filename);
    
    if (!filePath.startsWith(uploadsPath)) {
        return res.status(403).send('Acceso denegado');
    }

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('Archivo no encontrado');
    }

    res.sendFile(filePath);
});

// Ruta principal
app.get('', (req, res) => {
    res.sendFile(path.join(basePath, 'src', 'pages', 'index.html'));
});

// Rutas API
app.use('/api', categoriasRouter);
app.use('/api', productosRouter);
app.use('/api', reviewsRouter);
app.use('/api', usuariosRouter);

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});