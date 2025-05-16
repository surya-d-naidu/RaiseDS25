/**
 * Utility function to handle image paths for Vercel deployment
 * This ensures correct paths in both development and production environments
 */

/**
 * Get the correct path for static assets based on environment
 * @param path The asset path relative to the public directory
 * @returns The correct path to use in the application
 */
export function getAssetPath(path: string): string {
  // In production (Vercel), assets should be under /public
  if (import.meta.env.PROD) {
    // If the path already includes /public, don't add it again
    if (path.startsWith('/public/')) {
      return path;
    }
    
    // Ensure the path starts with a slash
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `/public${normalizedPath}`;
  } 
  
  // In development, assets are served directly from the public directory
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Creates an image source object with fallback
 * @param primaryPath Primary image path
 * @param fallbackPath Fallback image path if primary fails to load
 * @returns Object with src and onError handler
 */
export function getImageWithFallback(primaryPath: string, fallbackPath: string) {
  return {
    src: getAssetPath(primaryPath),
    onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const target = e.target as HTMLImageElement;
      target.onerror = null;
      target.src = getAssetPath(fallbackPath);
    }
  };
}
