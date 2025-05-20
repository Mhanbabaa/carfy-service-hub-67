import { useAuth } from '@/contexts/AuthContext';

/**
 * Gets the current user's tenant ID
 */
export const useGetTenantId = () => {
  const { userProfile } = useAuth();
  return userProfile?.tenant_id || null;
};

/**
 * Helper to add tenant filtering to Supabase queries
 * @param query The supabase query to modify
 * @param tenantId The tenant ID to filter by
 * @returns The modified query with tenant filtering
 */
export const withTenantFilter = (query: any, tenantId: string | null) => {
  if (!tenantId) {
    console.warn('No tenant ID available for filtering');
    return query;
  }
  
  return query.eq('tenant_id', tenantId);
}; 