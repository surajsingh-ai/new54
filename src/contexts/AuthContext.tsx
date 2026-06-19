import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }
      return !!data;
    } catch (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
  };

  const ensureUserProfile = async (u: User) => {
    try {
      const userId = u.id;
      if (!userId) return;

      const fullName = (u.user_metadata as any)?.full_name ?? null;
      const email = u.email ?? null;

      const { error: upsertError } = await supabase.from('profiles').upsert({
        user_id: userId,
        email,
        full_name: fullName,
      }, { onConflict: 'user_id' });

      if (upsertError) {
        console.error('Error ensuring user profile exists:', upsertError);
      }
    } catch (e) {
      console.error('Unexpected error in ensureUserProfile:', e);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer Supabase calls with setTimeout
        if (session?.user) {
          setTimeout(() => {
            // Ensure profile exists (handles delayed confirmations)
            ensureUserProfile(session.user).then(() => {
              checkAdminRole(session.user.id).then(setIsAdmin);
            });
          }, 0);
        } else {
          setIsAdmin(false);
        }
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        // Ensure profile exists when reading initial session
        ensureUserProfile(session.user).then(() => {
          checkAdminRole(session.user.id).then(setIsAdmin);
        });
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    // Attempt to sign up the user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });

    // If sign-up succeeded and a user id is returned, create a profile row
    try {
      const userId = data?.user?.id ?? null;
      if (userId) {
        // Insert into public.users (extended profile table)
        const { error: insertError } = await supabase.from('profiles').upsert({
          user_id: userId,
          email,
          full_name: fullName ?? null,
        }, { onConflict: 'user_id' });

        if (insertError) {
          console.error('Error creating user profile:', insertError);
        }
      }
    } catch (e) {
      console.error('Unexpected error creating profile after signUp:', e);
    }

    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
