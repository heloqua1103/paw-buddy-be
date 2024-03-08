export const isAdmin = (req, res, next) => {
  const { roleId } = req.user;
  if (roleId !== 1)
    return res.status(200).json({ success: false, mess: "Require role Admin" });
  next();
};

export const isVeterinarian = (req, res, next) => {
  const { roleId } = req.user;
  if (roleId !== 2)
    return res
      .status(200)
      .json({ success: false, mess: "Require role Veterinarian" });
  next();
};

export const isVeterinarianOrAmin = (req, res, next) => {
  const { roleId } = req.user;
  if (roleId !== 2 && roleId !== 1)
    return res
      .status(200)
      .json({ success: false, mess: "Require role Veterinarian or Admin" });
  next();
};
