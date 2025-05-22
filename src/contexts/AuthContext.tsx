
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User, getFullName } from '@/types/user';
import { toast } from '@/hooks/use-toast';
import { useSupabaseAuthHooks } from '@/hooks/use-supabase-auth-hooks';

interface AuthContextType {
  session: Session | null;
  user: SupabaseUser | null;
  userProfile: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  isAuthenticated: () => boolean;
  mustChangePassword: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Auth hooks entegrasyonu
  useSupabaseAuthHooks();

  useEffect(() => {
    // First set up the auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Use setTimeout to avoid potential deadlock with Supabase client
          setTimeout(async () => {
            await fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setUserProfile(null);
        }

        // Only show toast and navigate on explicit sign in/out events, not on initial load
        if (event === 'SIGNED_IN') {
          toast({
            title: 'Giriş başarılı',
            description: 'Hoş geldiniz!',
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: 'Çıkış yapıldı',
            description: 'Güvenli bir şekilde çıkış yaptınız.',
          });
          navigate('/login');
        }
      }
    );

    // Then check for existing session, but don't auto-navigate on initial page load
    // This fixes the auto-login issue when users visit the landing page
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id).finally(() => {
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for ID:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('*, tenant:tenants(*)')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        
        // Eğer kullanıcı profili bulunamazsa (yeni kayıt vs), app_metadata'dan tenant bilgilerini alıp ilerleyebiliriz
        console.log('Falling back to user metadata for tenant info');
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData?.user?.app_metadata?.tenant_id) {
          console.log('Retrieved tenant_id from metadata:', userData.user.app_metadata.tenant_id);
          
          // Tenant ID'yi userData'dan alarak basit bir userProfile objesi oluştur
          const user: User = {
            id: userId,
            tenant_id: userData.user.app_metadata.tenant_id,
            email: userData.user.email || '',
            role: userData.user.app_metadata.role || 'user',
            first_name: userData.user.user_metadata?.first_name || null,
            last_name: userData.user.user_metadata?.last_name || null,
            phone: null,
            fullName: getFullName({
              first_name: userData.user.user_metadata?.first_name,
              last_name: userData.user.user_metadata?.last_name,
              email: userData.user.email || ''
            })
          };
          setUserProfile(user);
        }
        return;
      }

      if (data) {
        console.log('User profile retrieved successfully:', data);
        // Convert the database user to our application User type
        const user: User = {
          ...data,
          fullName: getFullName(data)
        };
        setUserProfile(user);
      } else {
        console.warn('No user profile data found for user ID:', userId);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log("Auth context: Starting sign in process");
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Auth response data:", data);
      
      if (error) {
        console.error("Auth error details:", error);
        throw error;
      }
      
      return data;
    } catch (error: any) {
      console.error("Complete auth error:", error);
      toast({
        variant: 'destructive',
        title: 'Giriş hatası',
        description: error.message || 'Giriş sırasında bir hata oluştu.',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Çıkış hatası',
        description: error.message || 'Çıkış sırasında bir hata oluştu.',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = () => {
    return !!session;
  };

  const mustChangePassword = () => {
    return !!user?.user_metadata?.must_change_password;
  };

  const value = {
    session,
    user,
    userProfile,
    loading,
    signIn,
    signOut,
    isAuthenticated,
    mustChangePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
