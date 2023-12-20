import React, { ReactNode, createContext, useEffect, useState } from "react";

// Create a new context
export const UserContext = createContext<any>(null);

type Props = { children: ReactNode };

// UserContextProvider component
const UserContextProvider: React.FC<Props> = ({ children }) => {
  // State to hold user data
  const [user, setUser] = useState<any>(null);

  // Function to update user data

  useEffect(() => {
    const oldUser = localStorage.getItem("user");
    if (oldUser) {
      setUser(JSON.parse(oldUser));
    }
  }, []);

  // Value object to be provided by the context

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
