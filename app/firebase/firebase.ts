import { signInWithCustomToken } from "firebase/auth";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import type { RootLoaderData } from "~/root";
import { useMatchesData } from "~/utils";
import { getFirebase } from "./firebase.client";

export const useFirebase = () => {
  const { firebaseOptions, firebaseJwt } =
    useMatchesData<RootLoaderData>("root");

  const firebaseRef = useRef<ReturnType<typeof getFirebase> | null>(null);

  useEffect(() => {
    firebaseRef.current = getFirebase(firebaseOptions);
  }, [firebaseOptions]);

  // Make sure we're always logged in
  useEffect(() => {
    if (!firebaseJwt) return;
    invariant(firebaseRef.current, "Firebase not initialized");

    // If we're already signed in, don't do it again
    const { auth } = firebaseRef.current;
    if (auth.currentUser) return;

    signInWithCustomToken(auth, firebaseJwt).catch((err) => {
      // TODO: do something here?
      console.log(err);
    });
  }, [firebaseJwt, firebaseOptions]);

  return {
    auth: () => {
      invariant(firebaseRef.current, "Firebase not initialized");
      return firebaseRef.current.auth;
    },
    storage: () => {
      invariant(firebaseRef.current, "Firebase not initialized");
      return firebaseRef.current.storage;
    },
  };
};
