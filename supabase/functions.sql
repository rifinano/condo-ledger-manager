
-- Function to get all resident apartments
CREATE OR REPLACE FUNCTION public.get_resident_apartments()
RETURNS TABLE(resident_id uuid, block_number text, apartment_number text)
LANGUAGE sql
AS $$
  SELECT resident_id, block_number, apartment_number
  FROM public.resident_apartments
  ORDER BY resident_id, block_number, apartment_number;
$$;

-- Function to add a resident apartment
CREATE OR REPLACE FUNCTION public.add_resident_apartment(
  p_resident_id uuid,
  p_block_number text,
  p_apartment_number text
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.resident_apartments(resident_id, block_number, apartment_number)
  VALUES (p_resident_id, p_block_number, p_apartment_number)
  ON CONFLICT (resident_id, block_number, apartment_number) DO NOTHING;
END;
$$;

-- Function to remove a resident apartment
CREATE OR REPLACE FUNCTION public.remove_resident_apartment(
  p_resident_id uuid,
  p_block_number text,
  p_apartment_number text
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.resident_apartments
  WHERE resident_id = p_resident_id
    AND block_number = p_block_number
    AND apartment_number = p_apartment_number;
END;
$$;
