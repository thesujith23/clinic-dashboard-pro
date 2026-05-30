import { createContext, useContext } from "react";

export const UserContext = createContext<string>("Doctor");

export function useUser() {
  return useContext(UserContext);
}
