
/**
 * Hook to provide form data for property forms
 */
export const usePropertyFormData = () => {
  // Month and year data for resident forms
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
    { value: "12", label: "December" }
  ];

  // Generate a more comprehensive list of years
  const currentYear = new Date().getFullYear();
  const startYear = 1950; // Starting from 1950
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => (startYear + i).toString()
  ).reverse(); // Reverse to show most recent years first

  return {
    months,
    years
  };
};
