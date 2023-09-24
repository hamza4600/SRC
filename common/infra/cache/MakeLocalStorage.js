import { LocalStorage } from "./LocalStorage/LocalStorage";

export const makeLocalStorage = () => {
  return new LocalStorage();
}