"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { createAdminAction } from "@/app/actions/auth";

import styles from "../portal.module.css";

const INITIAL_STATE = {
  error: "",
  fieldErrors: {},
  success: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={styles.submitButton} disabled={pending}>
      {pending ? "Creating admin..." : "Create admin"}
    </button>
  );
}

export function AdminCreateForm() {
  const [state, formAction] = useActionState(createAdminAction, INITIAL_STATE);

  return (
    <form action={formAction} className={styles.form} noValidate>
      {state.error ? (
        <p className={styles.errorBanner} aria-live="polite">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className={styles.successBanner} aria-live="polite">
          {state.success}
        </p>
      ) : null}

      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label htmlFor="admin-email" className={styles.label}>
            Admin email
          </label>
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="off"
            placeholder="admin@yourcompany.com"
            className={styles.input}
            required
          />
          {state.fieldErrors?.email ? (
            <p className={styles.fieldError}>{state.fieldErrors.email}</p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label htmlFor="admin-password" className={styles.label}>
            Password
          </label>
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 12 characters"
            className={styles.input}
            minLength={12}
            required
          />
          {state.fieldErrors?.password ? (
            <p className={styles.fieldError}>{state.fieldErrors.password}</p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label htmlFor="admin-confirm-password" className={styles.label}>
            Confirm password
          </label>
          <input
            id="admin-confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat the password"
            className={styles.input}
            minLength={12}
            required
          />
          {state.fieldErrors?.confirmPassword ? (
            <p className={styles.fieldError}>{state.fieldErrors.confirmPassword}</p>
          ) : null}
        </div>
      </div>

      <p className={styles.formHelper}>
        Admin accounts can only be created from this dashboard. Public signup
        always creates standard users.
      </p>

      <SubmitButton />
    </form>
  );
}
