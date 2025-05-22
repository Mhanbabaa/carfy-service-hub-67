-- Drop the view if it already exists
DROP VIEW IF EXISTS public.service_parts_view;

-- Create a view for service parts that combines service_parts with service details
CREATE OR REPLACE VIEW public.service_parts_view AS
SELECT
  sp.id,
  sp.service_id,
  sp.part_name,
  sp.part_code,
  sp.quantity,
  sp.unit_price,
  sp.total_price,
  sp.tenant_id,
  sp.created_at,
  sp.updated_at,
  sd.status as service_status,
  sd.plate_number,
  CONCAT(sd.brand_name, ' ', sd.model_name) as vehicle_name,
  CONCAT(sd.plate_number, ' - ', sd.brand_name, ' ', sd.model_name) as service_reference
FROM
  public.service_parts sp
  LEFT JOIN public.service_details sd ON sp.service_id = sd.id;

-- Make the view accessible to authenticated users
ALTER VIEW public.service_parts_view OWNER TO postgres;
GRANT SELECT ON public.service_parts_view TO postgres;
GRANT SELECT ON public.service_parts_view TO authenticated; 