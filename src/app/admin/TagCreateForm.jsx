"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { createTagAction } from "@/app/actions/tags";

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
      {pending ? "Creating tag..." : "Create tag"}
    </button>
  );
}

export function TagCreateForm() {
  const [state, formAction] = useActionState(createTagAction, INITIAL_STATE);

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

      <div className={styles.formGridCompact}>
        <div className={styles.field}>
          <label htmlFor="tag-name" className={styles.label}>
            Tag name
          </label>
          <input
            id="tag-name"
            name="name"
            type="text"
            autoComplete="off"
            placeholder="Farmers Market"
            className={styles.input}
            required
          />
          {state.fieldErrors?.name ? (
            <p className={styles.fieldError}>{state.fieldErrors.name}</p>
          ) : null}
        </div>
      </div>

      <p className={styles.formHelper}>
        Tags created here become available immediately in the event creation
        flow and on the public events filters.
      </p>

      <SubmitButton />
    </form>
  );
}
