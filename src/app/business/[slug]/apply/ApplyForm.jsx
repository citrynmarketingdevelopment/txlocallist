"use client";

import { useState } from "react";

import { submitBusinessApplicationAction } from "@/app/actions/businesses";

import styles from "./apply.module.css";

export function ApplyForm({ slug, businessName, hiringRoles }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(hiringRoles[0] || "");
  const [resume, setResume] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleResumeFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setError("");
    setUploadingResume(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/applications/resume-upload", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || !payload?.success || !payload?.url) {
        setError(payload?.message || "Resume upload failed.");
        setUploadingResume(false);
        return;
      }

      setResume({
        url: payload.url,
        name: payload.name || selectedFile.name,
      });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Resume upload failed.");
    } finally {
      setUploadingResume(false);
      event.target.value = "";
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }
    if (!lastName.trim()) {
      setError("Last name is required.");
      return;
    }
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!role) {
      setError("Select the role you are applying for.");
      return;
    }
    if (!resume?.url) {
      setError("Please upload your resume.");
      return;
    }

    setIsSubmitting(true);

    const result = await submitBusinessApplicationAction({
      slug,
      firstName,
      lastName,
      email,
      role,
      resumeUrl: resume.url,
      resumeFileName: resume.name || "",
    });

    if (!result?.success) {
      setError(result?.message || "Failed to submit application.");
      setIsSubmitting(false);
      return;
    }

    setSuccess(true);
    setFirstName("");
    setLastName("");
    setEmail("");
    setRole(hiringRoles[0] || "");
    setResume(null);
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error ? <div className={styles.errorBanner}>{error}</div> : null}
      {success ? (
        <div className={styles.successBanner}>
          Application sent to {businessName}. You can submit another application if needed.
        </div>
      ) : null}

      <div className={styles.grid}>
        <label className={styles.field}>
          <span className={styles.label}>First Name</span>
          <input
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className={styles.input}
            placeholder="First name"
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Last Name</span>
          <input
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className={styles.input}
            placeholder="Last name"
          />
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={styles.input}
          placeholder="you@example.com"
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Role</span>
        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className={styles.select}
        >
          {hiringRoles.map((hiringRole) => (
            <option key={hiringRole} value={hiringRole}>
              {hiringRole}
            </option>
          ))}
        </select>
      </label>

      <div className={styles.field}>
        <span className={styles.label}>Resume</span>
        {resume ? (
          <div className={styles.resumeChip}>
            <span className={styles.resumeName}>{resume.name || "Resume uploaded"}</span>
            <button
              type="button"
              className={styles.removeResume}
              onClick={() => setResume(null)}
            >
              Remove
            </button>
          </div>
        ) : (
          <div className={styles.uploadWrap}>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleResumeFileChange}
              className={styles.fileInput}
            />
            <p className={styles.uploadHint}>
              Accepted files: PDF, DOC, DOCX, TXT (max 8MB)
            </p>
          </div>
        )}
        {uploadingResume ? <p className={styles.uploadingText}>Uploading resume…</p> : null}
      </div>

      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.primaryButton}
          disabled={isSubmitting || uploadingResume}
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>
      </div>
    </form>
  );
}
