// See https://github.com/WebDevSimplified/React-Firebase-Auth/blob/master/src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import Axios from "axios";
import { getAppAuth } from "../util/firebase";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const AuthContext = createContext();

const BACKEND_HOST = process.env.REACT_APP_RUN_BACK_END_HOST;

const ERROR_CODES = {
  "auth/email-already-in-use":
    "This email address is in use. Please select another.",
  "auth/weak-password": "You password must be greater than 6 characters.",
  "auth/user-not-found": "Email and password do not match. Please try again.",
  "auth/wrong-password": "Email and password do not match. Please try again.",
};

export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * Auth provder aims to provide auth information for
 * the rest of the application. Right now it is configured
 * for Firebase, but this could be traded for other authentication
 * methods.
 *
 * @param {JSX.Element} children
 * Its that require information about the user
 * while logged in.
 *
 * @returns Valid auth set up
 */
export const AuthProvider = ({ children }) => {
  const [activeUser, setActiveUser] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const register = async (displayName, email, password) => {
    const auth = getAppAuth();
    let userCredentials;
    try {
      userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
    } catch (error) {
      const errorMessage = ERROR_CODES[error.code];
      throw new Error(
        errorMessage || "Could not create a new user with this information"
      );
    }

    try {
      await Axios.post(
        `${BACKEND_HOST}/api/users/signup`,
        {
          name: displayName,
          email,
          authId: userCredentials.user.uid,
        }
      );
    } catch (err) {
      deleteUser(userCredentials.user);
      throw new Error("Could not validate user information.");
    }
  };

  const login = async (email, password) => {
    try {
      const auth = getAppAuth();
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const errorMessage = ERROR_CODES[err.code];
      throw new Error(
        errorMessage || "Could not log in at this time. Please try again later."
      );
    }
  };

  const logout = () => signOut(getAppAuth());
  const resetPassword = (email) => sendPasswordResetEmail(getAppAuth(), email);

  useEffect(() => {
    const auth = getAppAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setActiveUser(user);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const properties = {
    activeUser,
    register,
    login,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={properties}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
