import { toast } from "react-toastify";

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

export const successToast = (text: string) =>
  toast.success(text, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

export const errorToast = (text: string) =>
  toast.error(text, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
