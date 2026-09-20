import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET || "__dev_fallback_jwt_secret_change_me__";
if (!process.env.JWT_SECRET) {
    console.warn("WARNING: JWT_SECRET not set - using development fallback secret. Set JWT_SECRET in production or to avoid surprises.");
}

export const getToken = async (userId) => {
    try {
        const token = jwt.sign({ userId }, SECRET, { expiresIn: "7d" });
        return token;
    } catch (error) {
        console.error("Error generating token:", error);
        throw error;
    }
};