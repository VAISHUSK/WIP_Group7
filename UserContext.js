// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const UserContext = createContext();

export const useUserDetails = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    userId: null,
    details: null,
    userType: null,
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user.userId) {
        const docRef = doc(db, 'Users', user.userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const { Email, ProfileImageURL, UserType, Username } = docSnap.data();
          setUser((prevUser) => ({
            ...prevUser,
            details: {
              Email,
              ProfileImageURL,
              Username,
            },
            userType: UserType,
          }));
        } else {
          console.error("User details not found in database");
        }
      }
    };

    fetchUserDetails();
  }, [user.userId]);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
