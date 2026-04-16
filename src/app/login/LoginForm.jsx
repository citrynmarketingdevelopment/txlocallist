"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { loginAction } from "@/app/actions/auth";

import styles from "./login.module.css";

const INITIAL_STATE = {
  error: "",
  fieldErrors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={styles.submitButton} disabled={pending}>
      {pending ? "Logging in..." : "Login"}
      <span className="material-icons" aria-hidden="true">
        bolt
      </span>
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, INITIAL_STATE);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className={styles.form} noValidate>
      {state.error ? (
        <p className={styles.errorBanner} aria-live="polite">
          {state.error}
        </p>
      ) : null}

      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Station ID (Email)
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="name@station.tx"
          className={styles.input}
          required
        />
        {state.fieldErrors?.email ? (
          <p className={styles.fieldError}>{state.fieldErrors.email}</p>
        ) : null}
      </div>

      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label htmlFor="password" className={styles.label}>
            Secure Key
          </label>
          <span className={styles.assistText}>Lost key?</span>
        </div>
        <div className={styles.passwordWrap}>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            className={styles.passwordInput}
            required
          />
          <button
            type="button"
            className={styles.visibilityButton}
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <span className="material-icons" aria-hidden="true">
              {showPassword ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>
        {state.fieldErrors?.password ? (
          <p className={styles.fieldError}>{state.fieldErrors.password}</p>
        ) : null}
      </div>

      <SubmitButton />
    </form>
  );
}
