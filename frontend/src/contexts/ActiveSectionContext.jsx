import React, { createContext, useState } from "react";

export const ActiveSectionContext = createContext();

function ActiveSectionProvider({ children }) {
  const [activeSection, setActiveSection] = useState(null);

  return (
    <ActiveSectionContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </ActiveSectionContext.Provider>
  );
}

export { ActiveSectionProvider };
