"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
import styles from "./PhotoUploader.module.css";

/**
 * PhotoUploader — drag-and-drop photo uploader for business listings.
 *
 * Props:
 *   photos     {Array<{url, name}>}  current list of uploaded photos
 *   onChange   (photos) => void      called whenever the list changes
 *   maxPhotos  number                max photos allowed (from tier, default 1)
 */
export function PhotoUploader({ photos = [], onChange, maxPhotos = 1 }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const canAddMore = photos.length < maxPhotos;

  function handleRemove(url) {
    onChange(photos.filter((p) => p.url !== url));
  }

  return (
    <div className={styles.root}>
      {/* Uploaded photo grid */}
      {photos.length > 0 && (
        <div className={styles.grid}>
          {photos.map((photo, i) => (
            <div key={photo.url} className={styles.thumb}>
              <Image
                src={photo.url}
                alt={photo.name || `Photo ${i + 1}`}
                fill
                sizes="160px"
                className={styles.thumbImg}
              />
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => handleRemove(photo.url)}
                aria-label="Remove photo"
              >
                ×
              </button>
              {i === 0 && (
                <span className={styles.coverBadge}>Cover</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tier limit message */}
      <p className={styles.hint}>
        {photos.length} / {maxPhotos} photo{maxPhotos !== 1 ? "s" : ""} uploaded.
        {!canAddMore && " Upgrade your plan to add more."}
      </p>

      {/* Dropzone — only shown when under the limit */}
      {canAddMore && (
        <div className={styles.dropzoneWrap}>
          <UploadDropzone
            endpoint="businessPhoto"
            config={{ mode: "auto" }}
            onUploadBegin={() => {
              setUploading(true);
              setUploadError(null);
            }}
            onClientUploadComplete={(res) => {
              setUploading(false);
              if (!res) return;
              const newPhotos = res.map((f) => ({
                url: f.url ?? f.ufsUrl,
                name: f.name,
              }));
              // Respect the per-tier cap
              onChange([...photos, ...newPhotos].slice(0, maxPhotos));
            }}
            onUploadError={(err) => {
              setUploading(false);
              setUploadError(err.message || "Upload failed. Please try again.");
            }}
            appearance={{
              container: styles.dropzoneContainer,
              uploadIcon: styles.dropzoneIcon,
              label: styles.dropzoneLabel,
              allowedContent: styles.dropzoneAllowed,
              button: styles.dropzoneButton,
            }}
          />
        </div>
      )}

      {uploading && (
        <p className={styles.uploadingMsg}>Uploading…</p>
      )}
      {uploadError && (
        <p className={styles.errorMsg}>{uploadError}</p>
      )}
    </div>
  );
}
