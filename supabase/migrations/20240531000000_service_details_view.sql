-- Drop the view if it already exists
DROP VIEW IF EXISTS public.service_details;

-- Create a view for service details that combines service, vehicle, and customer info
CREATE OR REPLACE VIEW public.service_details AS
SELECT
  s.id,
  s.tenant_id,
  s.status,
  s.labor_cost,
  s.parts_cost,
  s.labor_cost + COALESCE(s.parts_cost, 0) AS total_cost,
  s.complaint,
  s.work_done,
  s.arrival_date,
  s.delivery_date,
  s.created_at,
  s.updated_at,
  v.plate_number,
  v.mileage,
  v.year,
  cb.name AS brand_name,
  cm.name AS model_name,
  CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
  c.phone AS customer_phone,
  c.email AS customer_email,
  CONCAT(u.first_name, ' ', u.last_name) AS technician_name
FROM
  public.services s
  LEFT JOIN public.vehicles v ON s.vehicle_id = v.id AND s.tenant_id = v.tenant_id
  LEFT JOIN public.customers c ON v.customer_id = c.id AND v.tenant_id = c.tenant_id
  LEFT JOIN public.car_brands cb ON v.brand_id = cb.id
  LEFT JOIN public.car_models cm ON v.model_id = cm.id AND cm.brand_id = v.brand_id
  LEFT JOIN public.users u ON s.technician_id = u.id;

-- Make the view accessible to authenticated users
ALTER VIEW public.service_details OWNER TO postgres;
GRANT SELECT ON public.service_details TO postgres;
GRANT SELECT ON public.service_details TO authenticated; 