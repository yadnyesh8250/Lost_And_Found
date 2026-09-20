import jwt from "jsonwebtoken";

export const isAuth = (req, res, next) => {
  try {
    // Accept token from cookie OR Authorization header (Bearer <token>) to support dev setups
    let token = req.cookies?.token;
    if (!token && req.headers?.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2 && parts[0].toLowerCase() === "bearer") token = parts[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Login First to use" });
    }

    // Defensive: ensure token looks like a JWT (three dot-separated parts)
    if (typeof token !== 'string' || token.split('.').length !== 3) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

  const SECRET = process.env.JWT_SECRET || "__dev_fallback_jwt_secret_change_me__";
  const decoded = jwt.verify(token, SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.userId = Number(decoded.userId);
    next();

  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
