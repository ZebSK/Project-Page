/**
 * @file This module contains useful functions for user profiles
 * @module UserProfiles
 */



/**
 * Creates a default profile picture containing the letters of the user's display name on a random colour background
 * @param displayName - The user's display name
 * @returns A png image of the profile pic
 */
export function createDefaultProfilePic(displayName: string | null): string {
  // Determine background colour
  const letters = "0123456789ABCDEF";
  var backgroundColour = "#";
  for (let i = 0; i < 6; i++) { backgroundColour += letters[Math.floor(Math.random() * 16)]; }

  // Determine font colour
  const r = parseInt(backgroundColour.substring(1, 3), 16);
  const g = parseInt(backgroundColour.substring(3, 5), 16);
  const b = parseInt(backgroundColour.substring(5, 7), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000; // YIQ formula for perceived brightness
  const textColour = brightness > 128 ? "#000000" : "#FFFFFF"

  // Determine shortened text
  let imageText = ""
  if (displayName) {
    displayName = displayName.replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    const words = displayName.split(" ").filter(word => word.trim() !== ""); // Split into non empty words
    if (words.length >= 2) { imageText += words[0][0].toUpperCase() + words[words.length - 1][0].toUpperCase() } 
    else if (words.length === 1) { 
      if (words[0].length > 1) { imageText += words[0][0].toUpperCase() + words[0][1].toUpperCase()}  
      else { imageText += words [0][0].toUpperCase() }
    }
  }

  // Create profile picture
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 256;
  canvas.height = 256;

  if (!ctx) { return canvas.toDataURL('image/png'); }
  ctx.fillStyle = backgroundColour;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "80px Arial";
  ctx.fillStyle = textColour;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(imageText, canvas.width / 2, canvas.height / 2);

  return canvas.toDataURL('image/png');
}

/**
 * A function to make the profile pic a 256*256 image
 * @param file - The file to compress and crop
 * @returns The URL to the cropped and compressed image
 */
export async function compressAndCropProfilePicture(file: File): Promise<string> {    
  return new Promise<string>((resolve, reject) => {
    // Set old image and canvas for new image
    const img = new Image();
    img.src = URL.createObjectURL(file);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");


    img.addEventListener("load", function() {
      // Calculate dimensions and offsets for cropping
      const minSize = Math.min(img.width, img.height)
      const offsetX = (img.width - minSize) / 2;
      const offsetY = (img.height - minSize) / 2;

      // Set canvas dimensions
      canvas.width = 256;
      canvas.height = 256;
      
      // Draw cropped and compressed image
      if (!ctx) { reject }
      else {
        ctx.drawImage(img, offsetX, offsetY, minSize, minSize, 0, 0, 256, 256);
        const dataURL = canvas.toDataURL("image/png")
        resolve(dataURL)
      }
    });
    img.addEventListener("error", reject);
  });
}
