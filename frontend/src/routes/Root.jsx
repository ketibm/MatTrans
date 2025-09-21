// import React, { useRef, useEffect } from "react";
// import { Outlet, useLocation } from "react-router-dom";
// import FirstHeader from "../components/FirstHeader/FirstHeader.jsx";
// import Header from "../components/Header/Header.jsx";
// import Footer from "../components/Footer/Footer.jsx";
// import { ModalProvider } from "../contexts/ModalContext.jsx";

// const Root = () => {
//   const topRef = useRef(null);
//   const aboutRef = useRef(null);
//   const bookingRef = useRef(null);
//   const faqRef = useRef(null);
//   const contactRef = useRef(null);

//   const location = useLocation();

//   const refsMap = {
//     top: topRef,
//     about: aboutRef,
//     booking: bookingRef,
//     faq: faqRef,
//     contact: contactRef,
//   };

//   const scrollToSection = (section) => {
//     const ref = refsMap[section];
//     if (ref?.current) {
//       ref.current.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   useEffect(() => {
//     if (location.state?.scrollTo) {
//       scrollToSection(location.state.scrollTo);
//       window.history.replaceState({}, document.title);
//     }
//   }, [location.state]);

//   return (
//     <ModalProvider>
//       <FirstHeader />
//       <Header scrollToSection={scrollToSection} />
//       <main ref={topRef}>
//         <Outlet
//           context={{ topRef, aboutRef, bookingRef, faqRef, contactRef }}
//         />
//       </main>
//       <div ref={contactRef}>
//         <Footer scrollToSection={scrollToSection} />
//       </div>
//     </ModalProvider>
//   );
// };

// export default Root;
import React, { useRef, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import FirstHeader from "../components/FirstHeader/FirstHeader.jsx";
import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import { ModalProvider } from "../contexts/ModalContext.jsx";

const Root = () => {
  const topRef = useRef(null);
  const aboutRef = useRef(null);
  const bookingRef = useRef(null);
  const faqRef = useRef(null);
  const contactRef = useRef(null);

  const location = useLocation();

  const refsMap = {
    top: topRef,
    about: aboutRef,
    booking: bookingRef,
    faq: faqRef,
    contact: contactRef,
  };

  const scrollToSection = (section) => {
    const ref = refsMap[section];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (location.state?.scrollTo) {
      scrollToSection(location.state.scrollTo);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <ModalProvider>
      {/* wrapper за целата страница */}
      <div className="pageWrapper">
        <FirstHeader />
        <Header scrollToSection={scrollToSection} />

        <main ref={topRef}>
          <Outlet
            context={{ topRef, aboutRef, bookingRef, faqRef, contactRef }}
          />
        </main>

        <div ref={contactRef}>
          <Footer scrollToSection={scrollToSection} />
        </div>
      </div>
    </ModalProvider>
  );
};

export default Root;
