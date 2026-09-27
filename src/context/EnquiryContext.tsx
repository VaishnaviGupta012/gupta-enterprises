import React, { createContext, useContext, useState } from 'react';
import EnquiryModal from '../components/EnquiryModal';

interface EnquiryContextType {
  openEnquiryModal: (preselectedService?: string) => void;
  closeEnquiryModal: () => void;
}

const EnquiryContext = createContext<EnquiryContextType>({
  openEnquiryModal: () => {},
  closeEnquiryModal: () => {},
});

export function useEnquiry() {
  return useContext(EnquiryContext);
}

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [service, setService] = useState('');

  const openEnquiryModal = (preselectedService = '') => {
    setService(preselectedService);
    setIsOpen(true);
  };

  const closeEnquiryModal = () => {
    setIsOpen(false);
  };

  return (
    <EnquiryContext.Provider value={{ openEnquiryModal, closeEnquiryModal }}>
      {children}
      <EnquiryModal
        isOpen={isOpen}
        onClose={closeEnquiryModal}
        preselectedService={service}
      />
    </EnquiryContext.Provider>
  );
}
