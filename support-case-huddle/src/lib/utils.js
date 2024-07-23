// src/lib/utils.js
import { clsx } from "clsx"

let twMerge;
try {
  twMerge = require("tailwind-merge").twMerge;
} catch (e) {
  console.warn("tailwind-merge not found, falling back to clsx only");
  twMerge = (...args) => args.join(" ");
}

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}