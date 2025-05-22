-- Service Parts Table
CREATE TABLE IF NOT EXISTS public.service_parts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    part_name TEXT NOT NULL,
    part_code TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_price NUMERIC(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for service_parts
ALTER TABLE public.service_parts ENABLE ROW LEVEL SECURITY;

-- Mevcut auth.get_user_tenant_id() fonksiyonunu kullan
-- Bu fonksiyon zaten 20240522000000_tenant_rls_policies.sql içinde tanımlanmış

-- Allow users to see only their tenant's service parts
CREATE POLICY "Users can see their tenant's service parts" 
    ON public.service_parts
    FOR SELECT
    USING (tenant_id = auth.get_user_tenant_id());

-- Allow users to insert their own service parts
CREATE POLICY "Users can insert their own service parts" 
    ON public.service_parts
    FOR INSERT
    WITH CHECK (tenant_id = auth.get_user_tenant_id());

-- Allow users to update their own service parts
CREATE POLICY "Users can update their own service parts" 
    ON public.service_parts
    FOR UPDATE
    USING (tenant_id = auth.get_user_tenant_id())
    WITH CHECK (tenant_id = auth.get_user_tenant_id());

-- Allow users to delete their own service parts
CREATE POLICY "Users can delete their own service parts" 
    ON public.service_parts
    FOR DELETE
    USING (tenant_id = auth.get_user_tenant_id());

-- Create service_parts_audit table for tracking changes
CREATE TABLE IF NOT EXISTS public.service_parts_audit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_part_id UUID REFERENCES public.service_parts(id) ON DELETE CASCADE,
    operation TEXT NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_by UUID,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create trigger function for audit logging
CREATE OR REPLACE FUNCTION public.service_parts_audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.service_parts_audit(service_part_id, operation, new_data, changed_by)
        VALUES (NEW.id, 'INSERT', row_to_json(NEW), auth.uid());
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.service_parts_audit(service_part_id, operation, old_data, new_data, changed_by)
        VALUES (NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW), auth.uid());
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.service_parts_audit(service_part_id, operation, old_data, changed_by)
        VALUES (OLD.id, 'DELETE', row_to_json(OLD), auth.uid());
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for audit logging
DROP TRIGGER IF EXISTS service_parts_audit_trigger ON public.service_parts;
CREATE TRIGGER service_parts_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.service_parts
FOR EACH ROW EXECUTE FUNCTION public.service_parts_audit_trigger_func(); 