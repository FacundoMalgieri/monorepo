export const urlHelper = (
  path: string,
  param: string | number,
  queryString = ""
): string => {
  return `${path}/${param}${queryString}`;
};
