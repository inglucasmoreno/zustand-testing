import { type StateCreator, create } from "zustand";
import { StateStorage, createJSONStorage, devtools, persist } from "zustand/middleware";
import { customSessionStorage } from "../storages/session.storage";
import { firebaseStorage } from "../storages/firebase.storage";
import { logger } from "../middlewares/logger.middlewares";

interface PersonState {
  firstName: string;
  lastName: string;
}

// Esto es para no tener todo dentro del STATE pero se recomienda colocar todo dentro del PersonState
interface Actions {
  setFirstName: (name: string) => void;
  setLastName: (name: string) => void;
}

const storeAPI: StateCreator<PersonState & Actions, [["zustand/devtools", never]]> =   (set) => ({
  firstName: '',
  lastName: '',
  setFirstName: (value: string) => set(state => ({ firstName: value }), false, 'setFirstName'),
  setLastName: (value: string) => set(state => ({ lastName: value }), false, 'setLastName')
})

export const usePersonStore = create<PersonState & Actions>()(
  // logger(
    devtools(
      persist(
        storeAPI
      , { 
          name: 'person-storage',
          storage: customSessionStorage
          // storage: firebaseStorage
        }
      )
    )
  // )
);