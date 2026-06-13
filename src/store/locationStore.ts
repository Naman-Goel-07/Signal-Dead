import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Location } from '@/types';

interface LocationState {
  /** The user's selected location, or null if not yet set */
  location: Location | null;
  /** Set a new location — called after auto-detect or manual entry */
  setLocation: (location: Location) => void;
  /** Clear the location — e.g. on sign-out or reset */
  clearLocation: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      location: null,

      setLocation: (location: Location) => {
        set({
          location: {
            ...location,
            setAt: new Date().toISOString(),
          },
        });
      },

      clearLocation: () => {
        set({ location: null });
      },
    }),
    {
      name: 'sigdead-location', // localStorage key
      // TODO: When Supabase is integrated, sync location to user profile here
    },
  ),
);
