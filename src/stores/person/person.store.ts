import { type StateCreator, create } from "zustand";
import { StateStorage, createJSONStorage, persist } from "zustand/middleware";
import { customSessionStorage } from "../storages/session.storage";
import { firebaseStorage } from "../storages/firebase.storage";

interface PersonState {
  firstName: string;
  lastName: string;
}

// Esto es para no tener todo dentro del STATE pero se recomienda colocar todo dentro del PersonState
interface Actions {
  setFirstName: (name: string) => void;
  setLastName: (name: string) => void;
}

const storeAPI: StateCreator<PersonState & Actions> =   (set) => ({
  firstName: '',
  lastName: '',
  setFirstName: (value: string) => set(state => ({ firstName: value })),
  setLastName: (value: string) => set(state => ({ lastName: value }))
})

export const usePersonStore = create<PersonState & Actions>()(
  persist(
    storeAPI
  , { 
      name: 'person-storage',
      // storage: customSessionStorage
      storage: firebaseStorage
    }
  )
);