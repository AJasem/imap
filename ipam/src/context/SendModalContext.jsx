import React, { createContext, useContext, useState } from "react";

const SendModalContext = createContext();

 export const useSendModal = () => useContext(SendModalContext);

export  const SendModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <SendModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </SendModalContext.Provider>
  );
};


