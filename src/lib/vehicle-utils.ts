import { supabase } from "@/integrations/supabase/client";

/**
 * Helper function to get brand details by ID
 * @param brandId The brand ID to lookup
 * @returns Promise resolving to brand details
 */
export const getBrandById = async (brandId: string) => {
  const { data, error } = await (supabase as any)
    .from('car_brands')
    .select('*')
    .eq('id', brandId)
    .single();
  
  if (error) {
    console.error('Error fetching brand:', error);
    return null;
  }
  
  return data;
};

/**
 * Helper function to get model details by ID
 * @param modelId The model ID to lookup
 * @returns Promise resolving to model details
 */
export const getModelById = async (modelId: string) => {
  const { data, error } = await (supabase as any)
    .from('car_models')
    .select('*, car_brands(*)')
    .eq('id', modelId)
    .single();
  
  if (error) {
    console.error('Error fetching model:', error);
    return null;
  }
  
  return data;
};

/**
 * Helper function to get vehicle details by customer ID
 * @param customerId The customer ID to lookup vehicles for
 * @param tenantId The tenant ID to filter results by
 * @returns Promise resolving to vehicle details
 */
export const getVehiclesByCustomerId = async (customerId: string, tenantId: string) => {
  const { data, error } = await (supabase as any)
    .from('vehicles')
    .select('*, car_brands:brand_id(*), car_models:model_id(*)')
    .eq('customer_id', customerId)
    .eq('tenant_id', tenantId);
  
  if (error) {
    console.error('Error fetching vehicles:', error);
    return [];
  }
  
  return data || [];
};

/**
 * Create or update a vehicle and link it to a customer
 * @param vehicleData The vehicle data to save
 * @param customerId The customer ID to link to
 * @param tenantId The tenant ID for the current user
 * @returns Promise resolving to the saved vehicle ID
 */
export const saveVehicle = async (vehicleData: any, customerId: string, tenantId: string) => {
  // Log the input data for debugging
  console.log("Vehicle data received:", {
    vehicleData,
    customerId,
    tenantId
  });
  
  // Validate required brand and model
  if (!vehicleData.brand) {
    console.error("Brand ID is missing");
    throw new Error("Araç markası seçilmelidir");
  }
  
  if (!vehicleData.model) {
    console.error("Model ID is missing");
    throw new Error("Araç modeli seçilmelidir");
  }
  
  try {
    // Verify brand exists before saving
    console.log("Checking brand ID:", vehicleData.brand);
    const brandCheck = await getBrandById(vehicleData.brand);
    console.log("Brand check result:", brandCheck);
    
    if (!brandCheck) {
      console.error(`Brand with ID ${vehicleData.brand} not found`);
      throw new Error("Seçilen araç markası bulunamadı. Lütfen geçerli bir marka seçin.");
    }
    
    // Verify model exists before saving
    console.log("Checking model ID:", vehicleData.model);
    const modelCheck = await getModelById(vehicleData.model);
    console.log("Model check result:", modelCheck);
    
    if (!modelCheck) {
      console.error(`Model with ID ${vehicleData.model} not found`);
      throw new Error("Seçilen araç modeli bulunamadı. Lütfen geçerli bir model seçin.");
    }
    
    // Prepare vehicle data with tenant and customer IDs
    const data = {
      plate_number: vehicleData.licensePlate,
      chassis_number: vehicleData.chassisNumber,
      brand_id: vehicleData.brand,
      model_id: vehicleData.model,
      year: parseInt(vehicleData.year),
      mileage: parseInt(vehicleData.mileage),
      under_warranty: vehicleData.underWarranty,
      customer_id: customerId,
      tenant_id: tenantId
    };
    
    console.log("Data being sent to database:", data);
    
    if (vehicleData.id) {
      // Update existing vehicle
      console.log(`Updating vehicle ID: ${vehicleData.id}`);
      const { data: updatedVehicle, error } = await (supabase as any)
        .from('vehicles')
        .update(data)
        .eq('id', vehicleData.id)
        .eq('tenant_id', tenantId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating vehicle:', error);
        
        // Provide more descriptive error for foreign key violations
        if (error.code === "23503") {
          if (error.message.includes("vehicles_brand_id_fkey")) {
            throw new Error("Geçersiz araç markası. Lütfen geçerli bir marka seçin.");
          } else if (error.message.includes("vehicles_model_id_fkey")) {
            throw new Error("Geçersiz araç modeli. Lütfen geçerli bir model seçin.");
          }
        }
        
        throw error;
      }
      
      console.log("Vehicle updated successfully:", updatedVehicle);
      return updatedVehicle.id;
    } else {
      // Create new vehicle
      console.log("Creating new vehicle");
      const { data: newVehicle, error } = await (supabase as any)
        .from('vehicles')
        .insert(data)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating vehicle:', error);
        
        // Provide more descriptive error for foreign key violations
        if (error.code === "23503") {
          if (error.message.includes("vehicles_brand_id_fkey")) {
            throw new Error("Geçersiz araç markası. Lütfen geçerli bir marka seçin.");
          } else if (error.message.includes("vehicles_model_id_fkey")) {
            throw new Error("Geçersiz araç modeli. Lütfen geçerli bir model seçin.");
          }
        }
        
        throw error;
      }
      
      console.log("Vehicle created successfully:", newVehicle);
      return newVehicle.id;
    }
  } catch (error) {
    console.error("Vehicle save error:", error);
    throw error;
  }
}; 