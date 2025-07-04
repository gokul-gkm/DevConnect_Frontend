export const getFileNameFromUrls = (url: string): string => {
    if (!url) return '';
    const fileName = url.split('?')[0];
    const parts = fileName.split('/');
    return decodeURIComponent(parts[parts.length - 1]);
  };