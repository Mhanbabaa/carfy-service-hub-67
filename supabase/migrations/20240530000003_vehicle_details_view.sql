-- Drop the view if it already exists
DROP VIEW IF EXISTS public.vehicle_details;

-- Create a view for vehicle details to be used in the Vehicles page
CREATE OR REPLACE VIEW public.vehicle_details AS
SELECT
  v.id,
  v.tenant_id,
  v.customer_id,
  v.brand_id,
  v.model_id,
  v.plate_number,
  v.chassis_number,
  v.year,
  v.mileage,
  v.under_warranty,
  v.created_at,
  v.updated_at,
  cb.name AS brand_name,
  cm.name AS model_name,
  CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
  c.phone AS customer_phone,
  c.email AS customer_email,
  (
    SELECT COUNT(*) FROM services s
    WHERE s.vehicle_id = v.id AND s.tenant_id = v.tenant_id
  ) AS service_count,
  (
    SELECT MAX(s.created_at) FROM services s
    WHERE s.vehicle_id = v.id AND s.tenant_id = v.tenant_id
  ) AS last_service_date,
  COALESCE(
    (
      SELECT s.status FROM services s
      WHERE s.vehicle_id = v.id AND s.tenant_id = v.tenant_id
      ORDER BY s.created_at DESC
      LIMIT 1
    ), 
    'active'
  ) AS status
FROM
  public.vehicles v
  LEFT JOIN public.customers c ON v.customer_id = c.id AND v.tenant_id = c.tenant_id
  LEFT JOIN public.car_brands cb ON v.brand_id = cb.id
  LEFT JOIN public.car_models cm ON v.model_id = cm.id AND cm.brand_id = v.brand_id;

-- Make the view accessible to authenticated users
ALTER VIEW public.vehicle_details OWNER TO postgres;
GRANT SELECT ON public.vehicle_details TO postgres;
GRANT SELECT ON public.vehicle_details TO authenticated; 