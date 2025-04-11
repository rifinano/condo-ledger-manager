
import { useEffect, useState } from "react";
import { getBlocks } from "@/services/propertiesService";

/**
 * Hook to provide property data like blocks and apartments
 */
export const usePropertyData = () => {
  const [blocks, setBlocks] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchBlocks = async () => {
      const blocksData = await getBlocks();
      setBlocks(blocksData.map(block => block.name));
    };
    
    fetchBlocks();
  }, []);
  
  const getApartments = (block: string) => {
    switch (block) {
      case "Block A":
        return ["A101", "A102", "A103", "A201", "A202", "A203"];
      case "Block B":
        return ["B101", "B102", "B103", "B201", "B202", "B203"];
      case "Block C":
        return ["C101", "C102", "C103", "C201", "C202", "C203"];
      default:
        return [];
    }
  };

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const years = [
    (new Date().getFullYear() - 2).toString(),
    (new Date().getFullYear() - 1).toString(),
    new Date().getFullYear().toString(),
    (new Date().getFullYear() + 1).toString()
  ];

  return {
    blocks,
    getApartments,
    months,
    years
  };
};
