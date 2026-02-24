import verifyJWT from "../JWT/verifyOnEdge";

const isAuthenticated = async (request) => {
    try {
        const token = request.cookies.get("token")?.value || "";
        const requestHeaders = new Headers(request.headers);
        const headerToken = requestHeaders.get("token");
        if (token || headerToken) {
            const decoded = await verifyJWT(request);
            return decoded.payload;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Authentication error:", error);
        return false;
    }
};

export default isAuthenticated;