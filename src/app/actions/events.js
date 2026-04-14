"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const MIN_TITLE_LENGTH = 3;
const MIN_DESCRIPTION_LENGTH = 20;

function getTextValue(formData, fieldName) {
  return formData.get(fieldName)?.toString().trim() ?? "";
}

function buildErrorState(error, fieldErrors = {}) {
  return {
    error,
    fieldErrors,
  };
}

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function createEventAction(_prevState, formData) {
  const user = await requireUser();
  const imageUrl = getTextValue(formData, "imageUrl");
  const title = getTextValue(formData, "title");
  const description = getTextValue(formData, "description");
  const addressName = getTextValue(formData, "addressName");
  const address = getTextValue(formData, "address");
  const zipCode = getTextValue(formData, "zipCode");
  const city = getTextValue(formData, "city");
  const state = getTextValue(formData, "state");
  const country = getTextValue(formData, "country");
  const tagIds = [...new Set(formData.getAll("tagIds").map((value) => value.toString()))];
  const fieldErrors = {};

  if (!isValidHttpUrl(imageUrl)) {
    fieldErrors.imageUrl = "Enter a valid image URL that starts with http or https.";
  }

  if (title.length < MIN_TITLE_LENGTH) {
    fieldErrors.title = `Use at least ${MIN_TITLE_LENGTH} characters for the title.`;
  }

  if (description.length < MIN_DESCRIPTION_LENGTH) {
    fieldErrors.description = `Use at least ${MIN_DESCRIPTION_LENGTH} characters for the description.`;
  }

  if (!addressName) {
    fieldErrors.addressName = "Enter the venue or address name.";
  }

  if (!address) {
    fieldErrors.address = "Enter the street address.";
  }

  if (!zipCode) {
    fieldErrors.zipCode = "Enter the ZIP or postal code.";
  }

  if (!city) {
    fieldErrors.city = "Enter the city.";
  }

  if (!state) {
    fieldErrors.state = "Enter the state.";
  }

  if (!country) {
    fieldErrors.country = "Enter the country.";
  }

  if (tagIds.length === 0) {
    fieldErrors.tagIds = "Select at least one tag for the event.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return buildErrorState("Fix the highlighted fields and try again.", fieldErrors);
  }

  const selectedTags = await prisma.tag.findMany({
    where: {
      id: {
        in: tagIds,
      },
    },
    select: {
      id: true,
      slug: true,
    },
  });

  if (selectedTags.length !== tagIds.length) {
    return buildErrorState("One or more selected tags are no longer available.", {
      tagIds: "Reload the page and select the tags again.",
    });
  }

  await prisma.event.create({
    data: {
      imageUrl,
      title,
      description,
      addressName,
      address,
      zipCode,
      city,
      state,
      country,
      creatorId: user.id,
      tags: {
        connect: selectedTags.map((tag) => ({ id: tag.id })),
      },
    },
  });

  revalidatePath("/events");
  revalidatePath("/dashboard");

  redirect(
    `/events?created=1&city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`,
  );
}
