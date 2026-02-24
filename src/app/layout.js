import { Poppins } from "next/font/google";
import "./globals.scss";
import Provider from "./Provider";
import { UserContextProvider } from "./_context/User"

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={` ${poppins.className}`}>
        <UserContextProvider>
          <Provider>{children}</Provider>
        </UserContextProvider>
      </body>
    </html>
  );
}
