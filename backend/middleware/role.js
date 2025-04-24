module.exports = (role) => {
    return (req, res, next) => {
      console.log("  jbbh");
      if (req.user.role !== role) {
        return res.status(403).send('Forbidden');
      }
      console.log(req.user.role !== role);
      next();
    };
  };