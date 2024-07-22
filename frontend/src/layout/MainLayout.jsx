import { Outlet } from "react-router-dom";
import Footer from "../components/Shared/Footer";
import Navbar from "../components/Shared/Navbar";
import ContactUs from "../Pages/ContactForm";
import Brands from "../Pages/Brands";
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Brands/>
      <ContactUs/>
      <Footer />
    </>
  );
};

export default MainLayout;
