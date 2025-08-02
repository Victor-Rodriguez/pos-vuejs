export const formatCurrency = (amount) =>
  Number(amount).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

export const getCurrentDate = () => {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatDateToDDMMYYYY = (dateValue) => {
  // Si es un objeto Date, convertir a string DD-MM-YYYY
  if (dateValue instanceof Date) {
    const day = String(dateValue.getDate()).padStart(2, "0");
    const month = String(dateValue.getMonth() + 1).padStart(2, "0");
    const year = dateValue.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Si es string, intentar parsearlo y formatear
  if (typeof dateValue === "string") {
    const dateObj = new Date(dateValue);
    if (!isNaN(dateObj.getTime())) {
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = dateObj.getFullYear();
      return `${day}/${month}/${year}`;
    }
  }

  return dateValue.toString();
};
