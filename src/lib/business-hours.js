export const BUSINESS_DAYS = [
  { dayOfWeek: 0, label: "Monday", shortLabel: "Mon" },
  { dayOfWeek: 1, label: "Tuesday", shortLabel: "Tue" },
  { dayOfWeek: 2, label: "Wednesday", shortLabel: "Wed" },
  { dayOfWeek: 3, label: "Thursday", shortLabel: "Thu" },
  { dayOfWeek: 4, label: "Friday", shortLabel: "Fri" },
  { dayOfWeek: 5, label: "Saturday", shortLabel: "Sat" },
  { dayOfWeek: 6, label: "Sunday", shortLabel: "Sun" },
];

const TIME_VALUE_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

function sanitizeTimeValue(value) {
  if (typeof value !== "string") {
    return "";
  }

  const normalized = value.trim().slice(0, 5);
  return TIME_VALUE_REGEX.test(normalized) ? normalized : "";
}

export function createBusinessHoursFormState(hours = []) {
  const hoursByDay = new Map(
    Array.isArray(hours)
      ? hours.map((entry) => [
          Number(entry.dayOfWeek),
          {
            openTime: sanitizeTimeValue(entry.openTime ?? ""),
            closeTime: sanitizeTimeValue(entry.closeTime ?? ""),
            isClosed: Boolean(entry.isClosed),
          },
        ])
      : []
  );

  return BUSINESS_DAYS.map((day) => {
    const existing = hoursByDay.get(day.dayOfWeek);

    return {
      dayOfWeek: day.dayOfWeek,
      label: day.label,
      shortLabel: day.shortLabel,
      openTime: existing?.isClosed ? "" : existing?.openTime ?? "",
      closeTime: existing?.isClosed ? "" : existing?.closeTime ?? "",
      isClosed: existing?.isClosed ?? false,
    };
  });
}

export function normalizeBusinessHoursInput(hours = []) {
  if (!Array.isArray(hours)) {
    return [];
  }

  const normalized = [];
  const seenDays = new Set();

  for (const rawEntry of hours) {
    const dayOfWeek = Number(rawEntry?.dayOfWeek);

    if (!Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6 || seenDays.has(dayOfWeek)) {
      continue;
    }

    seenDays.add(dayOfWeek);

    const day = BUSINESS_DAYS.find((item) => item.dayOfWeek === dayOfWeek);
    const isClosed = Boolean(rawEntry?.isClosed);
    const openTime = sanitizeTimeValue(rawEntry?.openTime ?? "");
    const closeTime = sanitizeTimeValue(rawEntry?.closeTime ?? "");

    if (isClosed) {
      normalized.push({
        dayOfWeek,
        openTime: null,
        closeTime: null,
        isClosed: true,
      });
      continue;
    }

    if (!openTime && !closeTime) {
      continue;
    }

    if (!openTime || !closeTime) {
      throw new Error(`Add both opening and closing times for ${day?.label ?? "that day"}.`);
    }

    normalized.push({
      dayOfWeek,
      openTime,
      closeTime,
      isClosed: false,
    });
  }

  return normalized.sort((left, right) => left.dayOfWeek - right.dayOfWeek);
}

export function formatBusinessTime(timeValue) {
  const normalized = sanitizeTimeValue(timeValue);
  if (!normalized) {
    return "";
  }

  const [hours, minutes] = normalized.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;

  return `${hour12}:${minutes.toString().padStart(2, "0")} ${suffix}`;
}

export function formatBusinessHoursValue(entry) {
  if (entry?.isClosed) {
    return "Closed";
  }

  if (entry?.openTime && entry?.closeTime) {
    return `${formatBusinessTime(entry.openTime)} - ${formatBusinessTime(entry.closeTime)}`;
  }

  return "Call for hours";
}

export function getBusinessHoursDisplayRows(hours = []) {
  const formState = createBusinessHoursFormState(hours);

  return formState.map((entry) => ({
    dayOfWeek: entry.dayOfWeek,
    label: entry.label,
    shortLabel: entry.shortLabel,
    value: formatBusinessHoursValue(entry),
  }));
}
