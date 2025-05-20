import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useGetTenantId, withTenantFilter } from '@/lib/tenant-utils';

/**
 * Hook to fetch data from Supabase with tenant isolation
 * @param tableName The table to query
 * @param options Additional query options
 * @returns Query result
 */
export const useSupabaseQuery = (
  tableName: string, 
  options: {
    select?: string;
    filter?: Record<string, any>;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
    queryKey?: any[];
    enabled?: boolean;
  } = {}
) => {
  const tenantId = useGetTenantId();
  const {
    select = '*',
    filter = {},
    orderBy,
    orderDirection = 'asc',
    page = 1,
    pageSize = 10,
    queryKey = [tableName],
    enabled = true,
  } = options;

  return useQuery({
    queryKey: [...queryKey, tenantId, filter, page, pageSize],
    queryFn: async () => {
      // Using any type to bypass strict typing constraints
      let query = (supabase as any)
        .from(tableName)
        .select(select);
      
      // Add tenant filter
      query = withTenantFilter(query, tenantId);
      
      // Add custom filters
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
      
      // Add ordering
      if (orderBy) {
        query = query.order(orderBy, { ascending: orderDirection === 'asc' });
      }
      
      // Add pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
      
      const { data, error, count } = await query;
      
      if (error) {
        console.error(`Error fetching ${tableName}:`, error);
        throw error;
      }
      
      return { data, count };
    },
    enabled: enabled && !!tenantId,
  });
};

/**
 * Hook to create a new record with tenant isolation
 * @param tableName The table to insert into
 * @returns Mutation function
 */
export const useSupabaseCreate = (tableName: string) => {
  const tenantId = useGetTenantId();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      // Add tenant_id to the data
      const dataWithTenant = {
        ...data,
        tenant_id: tenantId,
      };
      
      // Using any type to bypass strict typing constraints
      const { data: result, error } = await (supabase as any)
        .from(tableName)
        .insert(dataWithTenant)
        .select()
        .single();
      
      if (error) {
        console.error(`Error creating ${tableName}:`, error);
        throw error;
      }
      
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [tableName] });
    },
  });
};

/**
 * Hook to update a record with tenant isolation
 * @param tableName The table to update
 * @returns Mutation function
 */
export const useSupabaseUpdate = (tableName: string) => {
  const tenantId = useGetTenantId();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      // Using any type to bypass strict typing constraints
      const { data: result, error } = await (supabase as any)
        .from(tableName)
        .update(data)
        .eq('id', id)
        .eq('tenant_id', tenantId as string) // Ensure tenant isolation
        .select()
        .single();
      
      if (error) {
        console.error(`Error updating ${tableName}:`, error);
        throw error;
      }
      
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [tableName] });
    },
  });
};

/**
 * Hook to delete a record with tenant isolation
 * @param tableName The table to delete from
 * @returns Mutation function
 */
export const useSupabaseDelete = (tableName: string) => {
  const tenantId = useGetTenantId();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // Using any type to bypass strict typing constraints
      const { error } = await (supabase as any)
        .from(tableName)
        .delete()
        .eq('id', id)
        .eq('tenant_id', tenantId as string); // Ensure tenant isolation
      
      if (error) {
        console.error(`Error deleting ${tableName}:`, error);
        throw error;
      }
      
      return { id };
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [tableName] });
    },
  });
}; 