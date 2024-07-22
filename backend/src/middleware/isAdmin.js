export const isAdmin = (req, res, next) => {
<<<<<<< HEAD
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied' });
  }
};

export default isAdmin;
=======
    if (req.user && req.user.role === 'ADMIN') {
      next();
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }
  };
  
  export default isAdmin;
>>>>>>> b74b19b (do-over)
