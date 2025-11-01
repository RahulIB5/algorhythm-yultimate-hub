import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "tamui_secret";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // decoded contains userId and role as signed in authController
    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

export default protect;
