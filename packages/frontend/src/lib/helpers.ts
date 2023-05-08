export const urlHelper = (
  path: string,
  param: string | number,
  queryString = ""
): string => {
  return `${path}/${param}${queryString}`;
};

const ethRegex = /^(0x)?[0-9a-fA-F]{40}$/;

export const isValidETHAddress = (address: string): boolean =>
  ethRegex.test(address);
