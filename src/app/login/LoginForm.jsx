"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { loginAction } from "@/app/actions/auth";

import styles from "../auth.module.css";

const INITIAL_STATE = {
  error: "",
  fieldErrors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={styles.submitButton} disabled={pending}>
      {pending ? "Signing you in..." : "Log in"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, INITIAL_STATE);

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
          autoComplete="current-password"
          placeholder="Enter your password"
          className={styles.input}
          required
        />
        {state.fieldErrors?.password ? (
          <p className={styles.fieldError}>{state.fieldErrors.password}</p>
        ) : null}
      </div>

      <SubmitButton />
    </form>
  );
}
