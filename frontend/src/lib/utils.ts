import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const defaultValue = (data?: any, valueDefault?: any) => {
  return typeof data != "undefined" && data != null
    ? data
    : valueDefault || "-----";
};

export const getFirstAndLastName = (name?: string): string => {
  const parts = (name || "Anonimo").trim().split(/\s+/);

  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];

  return `${parts[0]} ${parts[parts.length - 1]}`;
};

export const formatMobile = (num: string) =>
  String(num).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export const formatToKwanza = (valor: number): string => {
  return valor.toLocaleString("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
