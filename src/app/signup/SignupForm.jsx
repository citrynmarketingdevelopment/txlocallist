"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { signUpAction } from "@/app/actions/auth";

import styles from "../auth.module.css";

const INITIAL_STATE = {
  error: "",
  fieldErrors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={styles.submitButton} disabled={pending}>
      {pending ? "Creating your account..." : "Create account"}
    </button>
  );
}

export function SignupForm() {
  const [state, formAction] = useActionState(signUpAction, INITIAL_STATE);

  return (
    <form action={formAction} className={styles.form} noValidate>
      {state.error ? (
        <p className={styles.errorBanner} aria-live="polite">
          {state.error}
        </p>
      ) : null}

      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={styles.input}
          required
        />
        {state.fieldErrors?.email ? (
          <p className={styles.fieldError}>{state.fieldErrors.email}</p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 12 characters"
          className={styles.input}
          minLength={12}
          required
        />
        <p className={styles.helper}>
          Use at least 12 characters. Longer is better.
        </p>
        {state.fieldErrors?.password ? (
          <p className={styles.fieldError}>{state.fieldErrors.password}</p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor="confirmPassword" className={styles.label}>
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          className={styles.input}
          minLength={12}
          required
        />
        {state.fieldErrors?.confirmPassword ? (
          <p className={styles.fieldError}>{state.fieldErrors.confirmPassword}</p>
        ) : null}
      </div>

      <SubmitButton />
    </form>
  );
}
