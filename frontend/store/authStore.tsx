import { create } from 'zustand';
import { auth } from '@/lib/firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    OAuthProvider,
    signOut,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence,
    User,
    AuthError
} from 'firebase/auth';

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    signUp: (email: string, password: string) => Promise<void>;
    logIn: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signInWithApple: () => Promise<void>;
    logOut: () => Promise<void>;
    initializeAuth: () => () => void;
}

function isAuthError(error: unknown): error is AuthError {
    return (error as AuthError).code !== undefined;
}

function getErrorMessage(error: unknown): string {
    if (isAuthError(error)) {
        return error.message;
    }
    return error instanceof Error
        ? error.message
        : 'Une erreur inconnue est survenue';
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,
    error: null,

    initializeAuth: () => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                await setPersistence(auth, browserLocalPersistence);
                set({ user, loading: false, error: null });
            } catch (error) {
                set({ error: getErrorMessage(error), loading: false });
            }
        });
        return unsubscribe;
    },

    signUp: async (email, password) => {
        set({ loading: true, error: null });
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            set({ error: getErrorMessage(error), loading: false });
            throw error;
        }
    },

    logIn: async (email, password) => {
        set ({ loading: true, error: null });
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            set({ error: getErrorMessage(error), loading: false });
            throw error;
        }
    },

    signInWithGoogle: async () => {
        set({ loading: true, error: null });
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            set({ error: getErrorMessage(error), loading: false });
            throw error;
        }
    },

    signInWithApple: async () => {
        set({ loading: true, error: null });
        try {
            const provider = new OAuthProvider('apple.coml ');
            await signInWithPopup(auth, provider);
        } catch (error) {
            set({ error: getErrorMessage(error), loading: false });
            throw error;
        }
    },

    logOut: async () => {
        set({ loading: true });
        try {
            await signOut(auth);
            set({ user: null });
        } catch (error) {
            set({ error: getErrorMessage(error) });
            throw error;
        } finally {
            set({ loading: false });
        }
    },
}));