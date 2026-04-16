/**
 * Client-side UploadThing helpers.
 *
 * Import UploadButton or UploadDropzone anywhere in a "use client" component.
 *
 * These are pre-bound to our OurFileRouter so they're fully typed (in TS
 * projects) and don't need the router generic at every call site.
 */
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

export const UploadButton   = generateUploadButton();
export const UploadDropzone = generateUploadDropzone();
