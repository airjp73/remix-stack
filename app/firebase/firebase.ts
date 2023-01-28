import type { FirebaseOptions } from "firebase/app";
import type { Auth } from "firebase/auth";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { getClientAuth } from "./firebase.client";

export const useFirebaseAuth = (options: FirebaseOptions) => {
  const authRef = useRef<Auth | null>(null);

  useEffect(() => {
    authRef.current = getClientAuth(options);
  }, [options]);

  return () => {
    invariant(authRef.current, "Firebase auth not initialized");
    return authRef.current;
  };
};
