const db = require("../db/db");
const jwt = require('jsonwebtoken'); // Si planeas usar JWT para la autenticación
const multer = require('multer');
const path = require('path');

// Configurar multer para el almacenamiento de avatars
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/avatars/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: Solo se permiten archivos de imagen!'));
    }
}).single('avatar');

const createUser = (req, res) => {
    upload(req, res, async function(err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        const { 
            nombre, 
            email, 
            contrasena,
            edad,
            pais,
            genero,
            newsletter,
            role
        } = req.body;

        let avatar = null;
        if (req.file) {
            avatar = `/uploads/avatars/${req.file.filename}`;
        }

        // Validación de campos requeridos
        if (!nombre || !email || !contrasena) {
            return res.status(400).json({ 
                message: 'Nombre, email y contraseña son campos requeridos' 
            });
        }

        // Verificar si el email ya existe en la base de datos
        db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (results.length > 0) {
                return res.status(400).json({ message: 'El email ya está registrado' });
            }

            // Insertar el nuevo usuario con el rol por defecto 'user'
            const query = `
                INSERT INTO usuarios 
                (nombre, email, contrasena, edad, pais, genero, newsletter, avatar, role) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            db.query(
                query, 
                [nombre, email, contrasena, edad, pais, genero, newsletter, avatar, role || 'user'],
                (err, results) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.status(201).json({ 
                        message: 'Usuario creado exitosamente', 
                        userId: results.insertId 
                    });
                }
            );
        });
    });
};

const loginUser = (req, res) => {
    const { email, contrasena } = req.body;

    db.query('SELECT * FROM usuarios WHERE email = ? AND contrasena = ?', [email, contrasena], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Email o contraseña incorrectos' });
        }

        const user = results[0];
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, 'secreto_super_seguro', { expiresIn: '1h' });

        res.status(200).json({ message: 'Login exitoso', token, role: user.role });
    });
};

const createAdmin = (req, res) => {
    const { nombre, email, contrasena } = req.body;

    if (req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Solo el superadmin puede crear administradores' });
    }

    const userData = {
        nombre,
        email,
        contrasena,
        role: 'admin'
    };

    db.query('INSERT INTO usuarios SET ?', userData, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ 
            message: 'Administrador creado exitosamente', 
            adminId: results.insertId 
        });
    });
};

const obtenerPerfil = (req, res) => {
    const userId = req.user.id;
    console.log('Token decodificado:', req.user); // Para depuración
    console.log('Obteniendo perfil para usuario:', userId);

    if (!userId) {
        return res.status(400).json({ error: 'ID de usuario no proporcionado' });
    }

    db.query(
        'SELECT id, nombre, email, edad, pais, genero, avatar, role FROM usuarios WHERE id = ?', 
        [userId], 
        (err, results) => {
            if (err) {
                console.error('Error en la consulta:', err);
                return res.status(500).json({ error: 'Error al obtener el perfil' });
            }
            
            if (!results || results.length === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            console.log('Resultados de la consulta:', results[0]); // Para depuración
            res.status(200).json(results[0]);
        }
    );
};

const actualizarPerfil = (req, res) => {
    const userId = req.user.id;
    const { nombre, email, edad, pais, genero } = req.body;

    // Manejo de la imagen de perfil
    let avatar = null;
    if (req.file) {
        avatar = `/uploads/avatars/${req.file.filename}`;
    }

    const updateFields = [];
    const values = [];

    if (nombre) {
        updateFields.push('nombre = ?');
        values.push(nombre);
    }
    if (email) {
        updateFields.push('email = ?');
        values.push(email);
    }
    if (edad) {
        updateFields.push('edad = ?');
        values.push(edad);
    }
    if (pais) {
        updateFields.push('pais = ?');
        values.push(pais);
    }
    if (genero) {
        updateFields.push('genero = ?');
        values.push(genero);
    }
    if (avatar) {
        updateFields.push('avatar = ?');
        values.push(avatar);
    }

    values.push(userId);

    if (updateFields.length === 0) {
        return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    const query = `UPDATE usuarios SET ${updateFields.join(', ')} WHERE id = ?`;

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Error en la actualización:', err);
            return res.status(500).json({ error: 'Error al actualizar el perfil' });
        }

        // Obtener el perfil actualizado
        db.query('SELECT id, nombre, email, edad, pais, genero, avatar FROM usuarios WHERE id = ?', 
            [userId], 
            (err, results) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al obtener el perfil actualizado' });
                }
                res.status(200).json(results[0]);
            }
        );
    });
};

const createSuperAdmin = (req, res) => {
    const { nombre, email, contrasena } = req.body;
    
    // Verificar si ya existe un superadmin
    db.query('SELECT * FROM usuarios WHERE role = "superadmin"', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (results.length > 0) {
            return res.status(400).json({ message: 'Ya existe un superadmin' });
        }
        
        // Crear superadmin
        const query = `
            INSERT INTO usuarios 
            (nombre, email, contrasena, role) 
            VALUES (?, ?, ?, 'superadmin')
        `;
        
        db.query(query, [nombre, email, contrasena], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ 
                message: 'Superadmin creado exitosamente', 
                userId: results.insertId 
            });
        });
    });
};

module.exports = {
    createUser,
    loginUser,
    createAdmin,
    obtenerPerfil,
    actualizarPerfil,
    createSuperAdmin
};
