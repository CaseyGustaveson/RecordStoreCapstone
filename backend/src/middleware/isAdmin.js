<<<<<<< HEAD
const isAdmin = (req, res, next) => {
=======
export const isAdmin = (req, res, next) => {
>>>>>>> 894ada7 (recovery commit)
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied' });
  }
};

export default isAdmin;