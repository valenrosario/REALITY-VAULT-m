export const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'hf3ijl6p';
  // Aquí usamos tu preset exacto
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'reality_vault_preset';
  
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Error uploading image to Cloudinary');
  }

  const data = await response.json();
  return data.secure_url; 
};