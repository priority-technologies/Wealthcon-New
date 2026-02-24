// import { jwtVerify } from "jose";
import * as jose from 'jose'

const verifyOnJWT = async (request) => {
  try {
    const requestHeaders = new Headers(request.headers);
    const headerToken = requestHeaders.get("token");
    const token = request.cookies.get("token")?.value || headerToken || "";
    const encodedKey = new TextEncoder().encode(process.env.JWT_TOKEN_SECRET);
    const decoded = await jose.jwtVerify(token, encodedKey, { algorithms: ["HS256"] });
    return decoded;

    // const encodedKey = new TextEncoder().encode(process.env.JWT_TOKEN_SECRET);
    // const decoded = await jwtVerify(token, encodedKey, {
    //   algorithms: ["HS256"],
    // });
    // return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export default verifyOnJWT;
