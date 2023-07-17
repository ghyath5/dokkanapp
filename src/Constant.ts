const PRODUCT_PER_PAGE = 8;
export const baseURL =
  'https://crkrfubycchydiwccztq.supabase.co/storage/v1/object/public';

export const GENERATE_IMAGE_URL = (path: string) =>
  path.startsWith('http') ? path : `${baseURL}/${path}`;

export const getPagination = (page: number, size: number) => {
  const limit = size ? +size : PRODUCT_PER_PAGE;
  const from = page ? page * limit : 0;
  const to = page ? from + size : size;

  return {from, to};
};
