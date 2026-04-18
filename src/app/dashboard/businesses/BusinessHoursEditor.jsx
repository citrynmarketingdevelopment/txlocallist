"use client";

import styles from "./BusinessHoursEditor.module.css";

export function BusinessHoursEditor({ hours, onChange }) {
  function updateDay(dayOfWeek, updates) {
    onChange(
      hours.map((entry) =>
        entry.dayOfWeek === dayOfWeek
          ? {
              ...entry,
              ...updates,
            }
          : entry
      )
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Business Hours</h3>
          <p className={styles.description}>
            Add the schedule customers should see on your public listing. Leave a day blank to show
            &quot;Call for hours.&quot;
          </p>
        </div>
      </div>

      <div className={styles.rows}>
        {hours.map((day) => (
          <div key={day.dayOfWeek} className={styles.row}>
            <div className={styles.dayLabel}>
              <span className={styles.dayName}>{day.label}</span>
              <span className={styles.dayShort}>{day.shortLabel}</span>
            </div>

            <div className={styles.timeFields}>
              <label className={styles.timeField}>
                <span className={styles.timeLabel}>Open</span>
                <input
                  type="time"
                  value={day.openTime}
                  onChange={(event) =>
                    updateDay(day.dayOfWeek, {
                      openTime: event.target.value,
                    })
                  }
                  disabled={day.isClosed}
                  className={styles.timeInput}
                />
              </label>

              <span className={styles.separator}>to</span>

              <label className={styles.timeField}>
                <span className={styles.timeLabel}>Close</span>
                <input
                  type="time"
                  value={day.closeTime}
                  onChange={(event) =>
                    updateDay(day.dayOfWeek, {
                      closeTime: event.target.value,
                    })
                  }
                  disabled={day.isClosed}
                  className={styles.timeInput}
                />
              </label>
            </div>

            <label className={styles.closedToggle}>
              <input
                type="checkbox"
                checked={day.isClosed}
                onChange={(event) =>
                  updateDay(day.dayOfWeek, {
                    isClosed: event.target.checked,
                    openTime: event.target.checked ? "" : day.openTime,
                    closeTime: event.target.checked ? "" : day.closeTime,
                  })
                }
              />
              <span>Closed</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
