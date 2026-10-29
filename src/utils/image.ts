import imageCompression from 'browser-image-compression';

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const QUALITY = 0.8;
const MAX_SIZE_MB = 0.5;

export async function compressImage(file: File | Blob): Promise<Blob> {
  const options = {
    maxSizeMB: MAX_SIZE_MB,
    maxWidthOrHeight: Math.max(MAX_WIDTH, MAX_HEIGHT),
    initialQuality: QUALITY,
    useWebWorker: true,
    fileType: 'image/jpeg' as const,
  };

  try {
    const compressed = await imageCompression(file as File, options);
    return compressed;
  } catch {
    // If compression fails, return original
    return file;
  }
}

export function createImageUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

export function revokeImageUrl(url: string): void {
  URL.revokeObjectURL(url);
}
