import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import MyNavbar from "../components/NavBar";
import ParticleBackground from "../components/ParticleBackground";
import ScrollToTopButton from "../components/ScrollTopButton";
import WhatsAppFAB from "../components/WhatsAppFAB";
import { useEffect } from "react";

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.38, ease: "easeOut" } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.22, ease: "easeIn" } },
};

const RootLayout = () => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <>
      <ParticleBackground />
      <div style={{ position: "relative", zIndex: 1 }}>
        <MyNavbar />
        <ScrollToTopButton />
        <WhatsAppFAB />
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ minHeight: "80vh", padding: "1rem 0 3rem" }}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    </>
  );
};

export default RootLayout;
