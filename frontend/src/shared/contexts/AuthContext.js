import React, { createContext, useContext, useEffect, useState } from "react";
import Axios from "axios";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { getAppAuth } from "../util/firebase";
import LoadingWheel from "../components/LoadingWheel";

const AuthContext = createContext();

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
 * Auth provider aims to provide auth information for
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
  const [appUser, setAppUser] = useState();
  const [loading, setLoading] = useState(true);

  const register = async (displayName, email, password) => {
    const auth = getAppAuth();
    let userCredentials;
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userRes) => {
        userCredentials = userRes.user;
        const newUser = {
          name: displayName,
          email,
          authId: userCredentials.uid,
        };
        return Axios.post("/api/users/signup", newUser);
      })
      .then((res) => {
        setAppUser(res.data.user);
      })
      .catch((err) => {
        const errorMessage = ERROR_CODES[err.code];
        if (userCredentials) {
          deleteUser(userCredentials);
        }
        throw new Error(
          errorMessage || "Could not create a new user with this information"
        );
      });
  };

  const login = async (email, password) => {
    const auth = getAppAuth();
    return signInWithEmailAndPassword(auth, email, password).catch((err) => {
      const errorMessage = ERROR_CODES[err.code];
      throw new Error(
        errorMessage || "Could not log in at this time. Please try again later."
      );
    });
  };

  const logout = () => {
    const auth = getAppAuth();
    signOut(auth);
  };

  const resetPassword = (email) => {
    const auth = getAppAuth();
    sendPasswordResetEmail(auth, email);
  };

  useEffect(() => {
    const auth = getAppAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setAppUser(null);
        setLoading(false);
      } else {
        Axios.get(`/api/users/auth/${user.uid}`)
          .then((res) => {
            const userRes = res.data?.user;
            setAppUser(userRes);
            setLoading(false);
          })
          .catch((_err) => {
            console.log("Auth error!");
          });
      }
    });
    return unsubscribe;
  }, []);

  const properties = {
    appUser,
    register,
    login,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={properties}>
      {loading ? <LoadingWheel /> : children}
    </AuthContext.Provider>
  );
};
