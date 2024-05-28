// AuthStateHandler.js
import React, { useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { UserContext } from './UserContext'; 

const AuthStateHandler = () => {
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(prev => ({ ...prev, userId: user.uid }));
      } else {
        setUser({ userId: null, details: null });
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [setUser]);

  return null;
};

export default AuthStateHandler;
