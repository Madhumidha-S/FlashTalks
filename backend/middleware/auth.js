import jwt from "jsonwebtoken";

export const authRequired = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid Token" });
  }
};

export const curatorOnly = (req, res, next) => {
  if (req.user?.role != "curator")
    return res.status(403).json({ error: "Forbidden — curator only" });
  next();
};
