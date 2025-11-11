import jwt from "jsonwebtoken";

export const authRequired = (req, res, next) => {
  try {
    if (req.isAuthenticated && req.isAuthenticated()) {
      req.user = req.user || req.session.passport?.user;
      console.log("Authenticated user:", req.user);
      return next();
    }
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // const decoded = JSON.parse(
      //   Buffer.from(token.split(".")[1], "base64").toString()
      // );
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    }
    return res.status(401).json({ error: "Unauthorized" });
  } catch (err) {
    console.error("Error in authRequired:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const curatorOnly = (req, res, next) => {
  if (req.user?.role != "curator")
    return res.status(403).json({ error: "Forbidden — curator only" });
  next();
};
