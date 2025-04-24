
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: 'admin' | 'customer';
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user is an admin based on email or profile role
  const isAdmin = !!profile?.role && profile.role === 'admin';

  // Fetch user profile from the database
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      console.log("Profile fetched successfully:", data);
      return data as UserProfile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  // Function to manually refresh the user profile
  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      const userProfile = await fetchUserProfile(user.id);
      if (userProfile) {
        setProfile(userProfile);
        return;
      }
      
      // If profile doesn't exist, try to create it
      console.log("Profile not found, attempting to create one");
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          first_name: user.user_metadata?.first_name || null,
          last_name: user.user_metadata?.last_name || null,
          role: user.email?.endsWith('@sssteelindia.com') ? 'admin' : 'customer'
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error creating profile:', error);
        return;
      }
      
      setProfile(data as UserProfile);
      console.log("Profile created successfully:", data);
    } catch (error) {
      console.error('Error in refreshProfile:', error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    console.log("AuthProvider: Initializing auth state");

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);

        // Fetch user profile if we have a user
        if (session?.user) {
          // Use setTimeout to avoid potential deadlocks
          setTimeout(async () => {
            const userProfile = await fetchUserProfile(session.user.id);
            setProfile(userProfile);
            setIsLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("Existing session check:", session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);

      // Fetch user profile if we have a user
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user.id);
        setProfile(userProfile);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("You have been signed out");
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, isAdmin, isLoading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
