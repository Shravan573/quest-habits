import { createContext, useContext } from 'react';
import { useAuthContext } from './AuthContext';
import { useParty } from '../hooks/useParty';

const PartyContext = createContext(null);

export function PartyProvider({ children }) {
  const { profile } = useAuthContext();
  const partyData = useParty(profile?.partyId);

  return (
    <PartyContext.Provider value={partyData}>
      {children}
    </PartyContext.Provider>
  );
}

export const usePartyContext = () => useContext(PartyContext);
