const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('Auth Header:', authHeader); // Para depuración

    if (!authHeader) {
        return res.status(401).json({ error: 'No se proporcionó token de autenticación' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Formato de token inválido' });
    }

    try {
        const decoded = jwt.verify(token, 'secreto_super_seguro');
        console.log('Token decodificado:', decoded); // Para depuración
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error al verificar token:', error);
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

const verificarAdmin = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'No autorizado - Se requiere rol de administrador' });
    }
    next();
};

const verificarSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'No autorizado - Se requiere rol de superadmin' });
    }
    next();
};

module.exports = { verificarToken, verificarAdmin, verificarSuperAdmin };