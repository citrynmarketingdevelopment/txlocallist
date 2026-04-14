"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { createEventAction } from "@/app/actions/events";

import styles from "@/app/portal.module.css";

const INITIAL_STATE = {
  error: "",
  fieldErrors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={styles.submitButton} disabled={pending}>
      {pending ? "Publishing event..." : "Publish event"}
    </button>
  );
}

export function CreateEventForm({ tags }) {
  const [state, formAction] = useActionState(createEventAction, INITIAL_STATE);

  return (
    <form action={formAction} className={styles.form} noValidate>
      {state.error ? (
        <p className={styles.errorBanner} aria-live="polite">
          {state.error}
        </p>
      ) : null}

      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label htmlFor="imageUrl" className={styles.label}>
            Event image URL
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            className={styles.input}
            placeholder="https://images.example.com/event-poster.jpg"
            required
          />
          {state.fieldErrors?.imageUrl ? (
            <p className={styles.fieldError}>{state.fieldErrors.imageUrl}</p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label htmlFor="title" className={styles.label}>
            Event title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className={styles.input}
            placeholder="East Austin Night Market"
            required
          />
          {state.fieldErrors?.title ? (
            <p className={styles.fieldError}>{state.fieldErrors.title}</p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label htmlFor="addressName" className={styles.label}>
            Address name
          </label>
          <input
            id="addressName"
            name="addressName"
            type="text"
            className={styles.input}
            placeholder="Republic Square"
            required
          />
          {state.fieldErrors?.addressName ? (
            <p className={styles.fieldError}>{state.fieldErrors.addressName}</p>
          ) : null}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="description" className={styles.label}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className={styles.textarea}
          placeholder="Describe the event, what to expect, and who it is for."
          rows={6}
          required
        />
        {state.fieldErrors?.description ? (
          <p className={styles.fieldError}>{state.fieldErrors.description}</p>
        ) : null}
      </div>

      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label htmlFor="address" className={styles.label}>
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            className={styles.input}
            placeholder="422 Guadalupe St"
            required
          />
          {state.fieldErrors?.address ? (
            <p className={styles.fieldError}>{state.fieldErrors.address}</p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label htmlFor="zipCode" className={styles.label}>
            ZIP code
          </label>
          <input
            id="zipCode"
            name="zipCode"
            type="text"
            className={styles.input}
            placeholder="78701"
            required
          />
          {state.fieldErrors?.zipCode ? (
            <p className={styles.fieldError}>{state.fieldErrors.zipCode}</p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label htmlFor="city" className={styles.label}>
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            className={styles.input}
            placeholder="Austin"
            required
          />
          {state.fieldErrors?.city ? (
            <p className={styles.fieldError}>{state.fieldErrors.city}</p>
          ) : null}
        </div>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label htmlFor="state" className={styles.label}>
            State
          </label>
          <input
            id="state"
            name="state"
            type="text"
            className={styles.input}
            placeholder="Texas"
            required
          />
          {state.fieldErrors?.state ? (
            <p className={styles.fieldError}>{state.fieldErrors.state}</p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label htmlFor="country" className={styles.label}>
            Country
          </label>
          <input
            id="country"
            name="country"
            type="text"
            className={styles.input}
            placeholder="United States"
            required
          />
          {state.fieldErrors?.country ? (
            <p className={styles.fieldError}>{state.fieldErrors.country}</p>
          ) : null}
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Tags</span>
        <div className={styles.checkboxGrid}>
          {tags.map((tag) => (
            <label key={tag.id} className={styles.checkboxCard}>
              <input type="checkbox" name="tagIds" value={tag.id} />
              <span>{tag.name}</span>
            </label>
          ))}
        </div>
        {state.fieldErrors?.tagIds ? (
          <p className={styles.fieldError}>{state.fieldErrors.tagIds}</p>
        ) : null}
      </div>

      <p className={styles.formHelper}>
        Event images currently use hosted image URLs. Direct media upload can be
        added later when object storage is in place.
      </p>

      <SubmitButton />
    </form>
  );
}
