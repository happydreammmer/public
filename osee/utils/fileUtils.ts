
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the "data:mime/type;base64," prefix to get only the base64 data
      if (result.includes(',')) {
        resolve(result.split(',')[1]);
      } else {
        // Handle cases where the prefix might be missing (though unlikely for readAsDataURL)
        resolve(result);
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
