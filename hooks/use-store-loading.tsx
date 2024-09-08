import { create } from "zustand";

interface useLoading {
    loading: boolean
    enableLoading: () => void
    disableLoading: () => void
};

export const useLoading = create<useLoading>((set) => ({
    loading: false,
    enableLoading: () => {
        set({ loading: true })
    },
    disableLoading: () => {
        set({ loading: false })

    },
}))