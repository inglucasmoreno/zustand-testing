import { create } from "zustand";
import { PersonSlice, createPersonSlice } from './person.slice';
import { devtools } from "zustand/middleware";
import { GuestSlice, createGuestSlice } from './guest.slice';


// Crear el store
type ShareState = PersonSlice & GuestSlice;

export const useWeddingStore = create<ShareState>()(
  devtools(
    (...a) => ({
      ...createPersonSlice(...a),
      ...createGuestSlice(...a)
    })
  )
)