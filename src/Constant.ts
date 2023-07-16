export const baseURL =
  'https://crkrfubycchydiwccztq.supabase.co/storage/v1/object/public';

export const GENERATE_IMAGE_URL = (path: string) =>
  path.startsWith('http') ? path : `${baseURL}/${path}`;
