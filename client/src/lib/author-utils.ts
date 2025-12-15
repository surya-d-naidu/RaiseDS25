// Utility functions for safely handling author data
export interface Author {
  name: string;
  affiliation: string;
  category: string;
  email: string;
}

export function safeRenderAuthors(authors: any): string {
  if (!authors) return 'No authors';
  
  if (typeof authors === 'string') {
    return authors;
  }
  
  if (Array.isArray(authors)) {
    return authors
      .filter(author => author && typeof author === 'object')
      .map(author => author.name || 'Unknown')
      .join(', ');
  }
  
  // If it's an object but not an array, try to extract name
  if (typeof authors === 'object' && authors.name) {
    return authors.name;
  }
  
  return 'Invalid author data';
}

export function safeRenderAuthorsDetailed(authors: any): string {
  if (!authors) return 'No authors';
  
  if (typeof authors === 'string') {
    return authors;
  }
  
  if (Array.isArray(authors)) {
    return authors
      .filter(author => author && typeof author === 'object')
      .map(author => `${author.name || 'Unknown'} (${author.affiliation || 'Unknown affiliation'})`)
      .join('; ');
  }
  
  // If it's an object but not an array, try to extract details
  if (typeof authors === 'object' && authors.name) {
    return `${authors.name} (${authors.affiliation || 'Unknown affiliation'})`;
  }
  
  return 'Invalid author data';
}

export function isValidAuthorsArray(authors: any): authors is Author[] {
  return Array.isArray(authors) && 
    authors.every(author => 
      author && 
      typeof author === 'object' && 
      typeof author.name === 'string' && 
      typeof author.affiliation === 'string' && 
      typeof author.category === 'string' && 
      typeof author.email === 'string'
    );
}
