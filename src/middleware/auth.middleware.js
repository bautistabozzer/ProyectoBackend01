export const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'No autorizado'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'No tienes permisos para realizar esta acción'
            });
        }

        next();
    };
};

export const isAdmin = checkRole(['admin']);
export const isUser = checkRole(['user']);
export const isAdminOrUser = checkRole(['admin', 'user']); 