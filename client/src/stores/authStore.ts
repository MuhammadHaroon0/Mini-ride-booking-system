
import axios from 'axios';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import apiRoutes from '../utils/apiRoutes';

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
};

type AuthState = {
    user: User | null;
    loading: boolean;
    login: (credentials: { email: string; password: string }) => Promise<User>;
    signup: (credentials: { email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
    removeUser: () => void;
    getMe: () => Promise<void>;
};

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            loading: false,

            login: async (credentials) => {
                set({ loading: true });
                try {
                    const response = await axios.post(apiRoutes.login, credentials);

                    console.log(response);

                    set({ user: response.data.user });
                    return response.data.user
                } catch (error: any) {
                    throw error;
                } finally {
                    set({ loading: false });
                }
            },
            signup: async (credentials) => {
                set({ loading: true });
                try {
                    await axios.post(apiRoutes.signup, credentials);
                } catch (error: any) {
                    throw error; // Rethrow the error
                } finally {
                    set({ loading: false });
                }
            },

            logout: async () => {
                await axios.post(apiRoutes.logout, {}, { withCredentials: true });
                set({ user: null });
                localStorage.removeItem('auth-storage');

            },
            removeUser: () => {
                set({ user: null });
                localStorage.removeItem('auth-storage');
            },
            getMe: async () => {
                set({ loading: true });
                try {
                    const response = await axios.get(apiRoutes.getMe);
                    set({ user: response.data.data });
                } catch (error: any) {

                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useAuthStore;
