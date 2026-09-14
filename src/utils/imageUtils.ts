/**
 * Utility for client-side image optimization, scaling, and reading
 * Guarantees small, crisp data URLs that fit comfortably within Firestore's 1MB document limit.
 */

// Max dimensions for various asset types
export const IMAGE_LIMITS = {
  FLYER_MAX_DIM: 800,
  GALLERY_MAX_DIM: 800,
  AVATAR_MAX_DIM: 400,
  MAX_EVENT_IMAGES: 6,
  MAX_GALLERY_BATCH: 30,
  TARGET_MAX_BYTES_PER_IMAGE: 70 * 1024 // ~70KB
};

/**
 * Optimizes an existing base64 data URL by scaling down and recompressing to JPEG.
 * External URLs (http/https) are returned untouched.
 */
export const compressDataUrl = (
  dataUrl: string,
  maxDimension = 800,
  quality = 0.7
): Promise<string> => {
  return new Promise((resolve) => {
    if (!dataUrl || !dataUrl.startsWith('data:image/')) {
      resolve(dataUrl);
      return;
    }

    // If already a small JPEG data URL (< 45KB), return immediately
    if (dataUrl.startsWith('data:image/jpeg') && dataUrl.length < 60000) {
      resolve(dataUrl);
      return;
    }

    const img = new Image();
    img.onload = () => {
      try {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        // Fill background with white for transparent images when converting to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Always export as image/jpeg for maximum compression
        let result = canvas.toDataURL('image/jpeg', quality);

        // If still > 85KB, do a second tighter pass
        if (result.length > 115000) {
          const smallerCanvas = document.createElement('canvas');
          const smW = Math.round(width * 0.75);
          const smH = Math.round(height * 0.75);
          smallerCanvas.width = Math.max(1, smW);
          smallerCanvas.height = Math.max(1, smH);
          const smCtx = smallerCanvas.getContext('2d');
          if (smCtx) {
            smCtx.fillStyle = '#FFFFFF';
            smCtx.fillRect(0, 0, smW, smH);
            smCtx.drawImage(canvas, 0, 0, smW, smH);
            result = smallerCanvas.toDataURL('image/jpeg', 0.58);
          }
        }

        resolve(result);
      } catch (err) {
        console.warn('Canvas compression fallback:', err);
        resolve(dataUrl);
      }
    };

    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
};

/**
 * Reads a File object and compresses it to a lightweight, optimized JPEG data URL.
 */
export const readFileAsOptimizedDataUrl = (
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.72
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawResult = e.target?.result as string;
      if (!rawResult) {
        reject(new Error('Failed to read file'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);

            // Always encode as image/jpeg to prevent multi-megabyte PNG strings
            let optimized = canvas.toDataURL('image/jpeg', quality);

            // Tighter compression pass if oversized
            if (optimized.length > 120000) {
              const smCanvas = document.createElement('canvas');
              const smW = Math.round(width * 0.7);
              const smH = Math.round(height * 0.7);
              smCanvas.width = Math.max(1, smW);
              smCanvas.height = Math.max(1, smH);
              const smCtx = smCanvas.getContext('2d');
              if (smCtx) {
                smCtx.fillStyle = '#FFFFFF';
                smCtx.fillRect(0, 0, smW, smH);
                smCtx.drawImage(canvas, 0, 0, smW, smH);
                optimized = smCanvas.toDataURL('image/jpeg', 0.58);
              }
            }

            resolve(optimized);
          } else {
            resolve(rawResult);
          }
        } catch {
          resolve(rawResult);
        }
      };
      img.onerror = () => resolve(rawResult);
      img.src = rawResult;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

/**
 * Processes multiple files, capping at maxFiles and ensuring each is compressed.
 */
export const readMultipleFilesAsOptimizedDataUrls = async (
  files: FileList | File[],
  maxFiles = IMAGE_LIMITS.MAX_GALLERY_BATCH,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.7
): Promise<string[]> => {
  const fileArray = Array.from(files).slice(0, maxFiles);
  const promises = fileArray.map((file) =>
    readFileAsOptimizedDataUrl(file, maxWidth, maxHeight, quality).catch((err) => {
      console.warn('Image processing warning:', err);
      return null;
    })
  );
  const results = await Promise.all(promises);
  return results.filter((url): url is string => Boolean(url));
};

