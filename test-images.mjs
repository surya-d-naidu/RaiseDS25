// Test script to verify image paths

// Mock the import.meta.env object
globalThis.import = {
  meta: {
    env: {
      PROD: true
    }
  }
};

// Define the functions we're testing to avoid import issues
function getAssetPath(path) {
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

function getImageWithFallback(primaryPath, fallbackPath) {
  return {
    src: getAssetPath(primaryPath),
    onError: (e) => {
      const target = e.target;
      target.onerror = null;
      target.src = getAssetPath(fallbackPath);
    }
  };
}

// Test environments
console.log('Testing asset path handling:');

console.log('\nProduction environment tests:');
console.log(`logo.jpeg → ${getAssetPath('logo.jpeg')}`);
console.log(`/logo.jpeg → ${getAssetPath('/logo.jpeg')}`);
console.log(`/public/logo.jpeg → ${getAssetPath('/public/logo.jpeg')}`);

// Mock development environment
globalThis.import.meta.env.PROD = false;

console.log('\nDevelopment environment tests:');
console.log(`logo.jpeg → ${getAssetPath('logo.jpeg')}`);
console.log(`/logo.jpeg → ${getAssetPath('/logo.jpeg')}`);
console.log(`/public/logo.jpeg → ${getAssetPath('/public/logo.jpeg')}`);

// Test image fallback
console.log('\nTesting image fallback:');
const prodImgWithFallback = getImageWithFallback('logo.jpeg', 'logo.png');
console.log(`Primary image src: ${prodImgWithFallback.src}`);
console.log('onError handler included:', prodImgWithFallback.onError ? '✅ Yes' : '❌ No');

console.log('\nVerification complete!');
