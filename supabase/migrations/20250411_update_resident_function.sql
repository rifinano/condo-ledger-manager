
-- Create function to update resident with apartment in a single transaction
CREATE OR REPLACE FUNCTION public.update_resident_with_apartment(
  p_resident_id UUID,
  p_full_name TEXT,
  p_phone_number TEXT,
  p_block_number TEXT,
  p_apartment_number TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_old_block TEXT;
  v_old_apartment TEXT;
  v_result JSONB;
BEGIN
  -- Get the current block and apartment for the resident
  SELECT block_number, apartment_number INTO v_old_block, v_old_apartment
  FROM residents
  WHERE id = p_resident_id;
  
  -- Update the resident record
  UPDATE residents
  SET 
    full_name = p_full_name,
    phone_number = p_phone_number,
    block_number = p_block_number,
    apartment_number = p_apartment_number,
    updated_at = now()
  WHERE id = p_resident_id
  RETURNING jsonb_build_object(
    'id', id,
    'full_name', full_name,
    'phone_number', phone_number,
    'block_number', block_number,
    'apartment_number', apartment_number
  ) INTO v_result;
  
  -- Update any entries in resident_apartments if they exist
  -- First, check if there's an entry for the old apartment
  IF EXISTS (
    SELECT 1 FROM resident_apartments 
    WHERE resident_id = p_resident_id 
    AND block_number = v_old_block 
    AND apartment_number = v_old_apartment
  ) THEN
    -- If the apartment has changed, update the existing entry
    IF v_old_block != p_block_number OR v_old_apartment != p_apartment_number THEN
      UPDATE resident_apartments
      SET 
        block_number = p_block_number,
        apartment_number = p_apartment_number,
        updated_at = now()
      WHERE 
        resident_id = p_resident_id 
        AND block_number = v_old_block 
        AND apartment_number = v_old_apartment;
    END IF;
  END IF;
  
  RETURN v_result;
END;
$$;
