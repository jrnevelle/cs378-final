import React, { createContext, useContext, useState } from 'react';

const IdeaContext = createContext();

export const IdeaProvider = ({ children }) => {
  const [ideas, setIdeas] = useState([]);

  const addIdea = (idea) => {
    setIdeas((prev) => [...prev, idea]);
  };

  return (
    <IdeaContext.Provider value={{ ideas, addIdea }}>
      {children}
    </IdeaContext.Provider>
  );
};

export const useIdeas = () => useContext(IdeaContext);
