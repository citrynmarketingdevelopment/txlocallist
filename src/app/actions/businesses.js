"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/session";
import { sendListingPublishedEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const MIN_NAME_LENGTH = 3;
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

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeTagNames(tags = []) {
  return [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))];
}

/**
 * Generate a unique slug from business name and city.
 * Format: "business-name-city"
 */
function generateSlug(name, city) {
  return slugify(`${name}-${city}`);
}

/**
 * Create a new business listing (starts in DRAFT status, Free tier).
 *
 * Form fields:
 *   - name (required)
 *   - description (required, min 20 chars)
 *   - address (required)
 *   - addressName (required)
 *   - zipCode (required)
 *   - cityId (required, foreign key to City)
 *   - state (optional, defaults to "Texas")
 *   - country (optional, defaults to "USA")
 *   - phone (optional)
 *   - email (optional)
 *   - website (optional, must be valid URL)
 *   - categoryIds (optional, comma-separated or array)
 *   - tagIds (optional, comma-separated or array)
 *   - photoUrl (optional, must be valid URL)
 *   - photoAlt (optional, alt text for photo)
 */
export async function createBusinessAction(_prevState, formData) {
  const user = await requireUser();

  // Only OWNER or ADMIN can create businesses
  if (user.role !== "OWNER" && user.role !== "ADMIN") {
    return buildErrorState("Only business owners can create listings.");
  }

  // Extract form fields
  const name = getTextValue(formData, "name");
  const description = getTextValue(formData, "description");
  const address = getTextValue(formData, "address");
  const addressName = getTextValue(formData, "addressName");
  const zipCode = getTextValue(formData, "zipCode");
  const cityId = getTextValue(formData, "cityId");
  const state = getTextValue(formData, "state") || "Texas";
  const country = getTextValue(formData, "country") || "USA";
  const phone = getTextValue(formData, "phone");
  const email = getTextValue(formData, "email");
  const website = getTextValue(formData, "website");
  const photoUrl = getTextValue(formData, "photoUrl");
  const photoAlt = getTextValue(formData, "photoAlt") || name;

  // Parse category and tag IDs (support both comma-separated strings and arrays)
  const categoryIds = [
    ...new Set(
      formData
        .getAll("categoryIds")
        .map((v) => v.toString().trim())
        .filter(Boolean)
    ),
  ];
  const tagIds = [
    ...new Set(
      formData
        .getAll("tagIds")
        .map((v) => v.toString().trim())
        .filter(Boolean)
    ),
  ];

  const fieldErrors = {};

  // Validation
  if (name.length < MIN_NAME_LENGTH) {
    fieldErrors.name = `Use at least ${MIN_NAME_LENGTH} characters for the name.`;
  }

  if (description.length < MIN_DESCRIPTION_LENGTH) {
    fieldErrors.description = `Use at least ${MIN_DESCRIPTION_LENGTH} characters for the description.`;
  }

  if (!address) {
    fieldErrors.address = "Enter the street address.";
  }

  if (!addressName) {
    fieldErrors.addressName = "Enter the venue or address name.";
  }

  if (!zipCode) {
    fieldErrors.zipCode = "Enter the ZIP or postal code.";
  }

  if (!cityId) {
    fieldErrors.cityId = "Select a city.";
  }

  if (website && !isValidHttpUrl(website)) {
    fieldErrors.website = "Enter a valid website URL starting with http:// or https://.";
  }

  if (photoUrl && !isValidHttpUrl(photoUrl)) {
    fieldErrors.photoUrl = "Enter a valid photo URL starting with http:// or https://.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return buildErrorState("Fix the highlighted fields and try again.", fieldErrors);
  }

  // Verify city exists
  const city = await prisma.city.findUnique({ where: { id: cityId } });
  if (!city) {
    return buildErrorState("Selected city not found.", { cityId: "City does not exist." });
  }

  // Verify categories exist (if any selected)
  if (categoryIds.length > 0) {
    const selectedCategories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true },
    });

    if (selectedCategories.length !== categoryIds.length) {
      return buildErrorState("One or more selected categories are no longer available.", {
        categoryIds: "Reload the page and select categories again.",
      });
    }
  }

  // Verify tags exist (if any selected)
  if (tagIds.length > 0) {
    const selectedTags = await prisma.tag.findMany({
      where: { id: { in: tagIds } },
      select: { id: true },
    });

    if (selectedTags.length !== tagIds.length) {
      return buildErrorState("One or more selected tags are no longer available.", {
        tagIds: "Reload the page and select tags again.",
      });
    }
  }

  // Get free plan
  const freePlan = await prisma.plan.findUnique({ where: { slug: "free" } });
  if (!freePlan) {
    return buildErrorState("System error: Free plan not found. Please contact support.");
  }

  // Generate unique slug
  const baseSlug = generateSlug(name, city.name);
  let slug = baseSlug;
  let slugCounter = 1;

  // Check for slug conflicts (within the same city) and increment if needed
  while (
    await prisma.business.findFirst({
      where: { slug, cityId },
    })
  ) {
    slug = `${baseSlug}-${slugCounter}`;
    slugCounter++;
  }

  // Create the business
  const business = await prisma.business.create({
    data: {
      slug,
      name,
      description,
      address,
      addressName,
      zipCode,
      cityId,
      state,
      country,
      phone: phone || null,
      email: email || null,
      website: website || null,
      ownerId: user.id,
      planId: freePlan.id,
      status: "DRAFT",
      // Attach categories
      categories:
        categoryIds.length > 0
          ? {
              create: categoryIds.map((categoryId) => ({ categoryId })),
            }
          : undefined,
      // Attach tags
      tags:
        tagIds.length > 0
          ? {
              create: tagIds.map((tagId) => ({ tagId })),
            }
          : undefined,
      // Create initial photo if provided
      photos:
        photoUrl
          ? {
              create: [
                {
                  url: photoUrl,
                  alt: photoAlt,
                  order: 0,
                },
              ],
            }
          : undefined,
    },
  });

  revalidatePath("/dashboard/businesses");
  revalidatePath("/search");

  // Redirect to the edit page so they can add more photos and publish
  redirect(`/dashboard/businesses/${business.id}/edit?created=1`);
}

/**
 * Publish a business listing (changes status from DRAFT → ACTIVE).
 */
export async function publishBusinessAction(businessId) {
  const user = await requireUser();

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: {
      ownerId: true,
      status: true,
      slug: true,
      name: true,
      owner: { select: { email: true } },
    },
  });

  if (!business) {
    return { success: false, message: "Business not found." };
  }

  if (business.ownerId !== user.id && user.role !== "ADMIN") {
    return { success: false, message: "You don't have permission to publish this business." };
  }

  if (business.status === "ACTIVE") {
    return { success: false, message: "Business is already published." };
  }

  await prisma.business.update({
    where: { id: businessId },
    data: {
      status: "ACTIVE",
      publishedAt: new Date(),
    },
  });

  revalidatePath(`/business/${business.slug}`);
  revalidatePath("/search");
  revalidatePath("/dashboard/businesses");

  // Notify the owner their listing is live (non-blocking)
  if (business.owner?.email) {
    sendListingPublishedEmail({
      to: business.owner.email,
      businessName: business.name,
      businessSlug: business.slug,
    }).catch((err) => console.error("[businesses] publish email failed:", err));
  }

  return { success: true, message: "Business published successfully!" };
}

/**
 * Pause a business listing (changes status from ACTIVE → PAUSED).
 */
export async function pauseBusinessAction(businessId) {
  const user = await requireUser();

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { ownerId: true, status: true },
  });

  if (!business) {
    return buildErrorState("Business not found.");
  }

  if (business.ownerId !== user.id && user.role !== "ADMIN") {
    return buildErrorState("You don't have permission to pause this business.");
  }

  if (business.status !== "ACTIVE") {
    return buildErrorState("Only active listings can be paused.");
  }

  await prisma.business.update({
    where: { id: businessId },
    data: { status: "PAUSED" },
  });

  revalidatePath(`/business/${businessId}`);
  revalidatePath("/search");

  return { success: true, message: "Business paused successfully." };
}

/**
 * Archive a business listing (soft-delete).
 */
export async function archiveBusinessAction(businessId) {
  const user = await requireUser();

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { ownerId: true },
  });

  if (!business) {
    return buildErrorState("Business not found.");
  }

  if (business.ownerId !== user.id && user.role !== "ADMIN") {
    return buildErrorState("You don't have permission to archive this business.");
  }

  await prisma.business.update({
    where: { id: businessId },
    data: { status: "ARCHIVED" },
  });

  revalidatePath("/dashboard/businesses");

  return { success: true, message: "Business archived." };
}

/**
 * Create a business from form data (plain object format).
 * Used by the dashboard create form component.
 */
export async function createBusinessFromFormAction(data) {
  const user = await requireUser();

  // Only OWNER or ADMIN can create businesses
  if (user.role !== "OWNER" && user.role !== "ADMIN") {
    return { success: false, message: "Only business owners can create listings." };
  }

  // Validation
  if (!data.name || data.name.trim().length < MIN_NAME_LENGTH) {
    return { success: false, message: `Business name must be at least ${MIN_NAME_LENGTH} characters.` };
  }

  if (!data.description || data.description.trim().length < MIN_DESCRIPTION_LENGTH) {
    return { success: false, message: `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters.` };
  }

  if (!data.cityId) {
    return { success: false, message: "City is required." };
  }

  if (!data.address || !data.address.trim()) {
    return { success: false, message: "Address is required." };
  }

  if (data.website && !isValidHttpUrl(data.website)) {
    return { success: false, message: "Enter a valid website URL." };
  }

  // Verify city exists
  const city = await prisma.city.findUnique({ where: { id: data.cityId } });
  if (!city) {
    return { success: false, message: "Selected city not found." };
  }

  // Verify categories exist
  if (data.categoryIds && data.categoryIds.length > 0) {
    const selectedCategories = await prisma.category.findMany({
      where: { id: { in: data.categoryIds } },
      select: { id: true },
    });

    if (selectedCategories.length !== data.categoryIds.length) {
      return { success: false, message: "One or more selected categories are no longer available." };
    }
  }

  const tagNames = normalizeTagNames(data.tags);
  const lat =
    typeof data.latitude === "number"
      ? data.latitude
      : data.latitude
        ? parseFloat(data.latitude)
        : null;
  const lng =
    typeof data.longitude === "number"
      ? data.longitude
      : data.longitude
        ? parseFloat(data.longitude)
        : null;
  const inferredZipCode = data.address?.match(/\b\d{5}(?:-\d{4})?\b/)?.[0] ?? "";

  // Get free plan
  const freePlan = await prisma.plan.findUnique({ where: { slug: "free" } });
  if (!freePlan) {
    return { success: false, message: "System error: Free plan not found. Please contact support." };
  }

  // Generate unique slug
  const baseSlug = generateSlug(data.name, city.name);
  let slug = baseSlug;
  let slugCounter = 1;

  while (
    await prisma.business.findFirst({
      where: { slug, cityId: data.cityId },
    })
  ) {
    slug = `${baseSlug}-${slugCounter}`;
    slugCounter++;
  }

  try {
    // Create the business
    const business = await prisma.business.create({
      data: {
        slug,
        name: data.name.trim(),
        description: data.description.trim(),
        addressName: data.addressName?.trim() || data.name.trim(),
        address: data.address.trim(),
        zipCode: data.zipCode?.trim() || inferredZipCode,
        cityId: data.cityId,
        phone: data.phone?.trim() || null,
        email: data.email?.trim().toLowerCase() || null,
        website: data.website?.trim() || null,
        lat,
        lng,
        ownerId: user.id,
        planId: freePlan.id,
        status: "DRAFT",
        // Attach categories
        categories:
          data.categoryIds && data.categoryIds.length > 0
            ? {
                create: data.categoryIds.map((categoryId) => ({ categoryId })),
              }
            : undefined,
        // Attach tags
        tags:
          tagNames.length > 0
            ? {
                create: tagNames.map((tagName) => ({
                  tag: {
                    connectOrCreate: {
                      where: { slug: slugify(tagName) },
                      create: {
                        name: tagName,
                        slug: slugify(tagName),
                      },
                    },
                  },
                })),
              }
            : undefined,
        // Attach uploaded photos
        photos:
          data.photos && data.photos.length > 0
            ? {
                create: data.photos.map((photo, i) => ({
                  url: photo.url,
                  alt: photo.name || data.name?.trim() || "",
                  order: i,
                })),
              }
            : undefined,
      },
    });

    revalidatePath("/dashboard/businesses");
    revalidatePath("/search");

    return {
      success: true,
      message: "Business created successfully!",
      data: { id: business.id },
    };
  } catch (error) {
    console.error("Error creating business:", error);
    return { success: false, message: "Failed to create business. Please try again." };
  }
}

/**
 * Update an existing business listing.
 * Used by the dashboard edit form.
 */
export async function updateBusinessAction(businessId, data) {
  const user = await requireUser();

  // Verify ownership
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { ownerId: true, slug: true },
  });

  if (!business) {
    return { success: false, message: "Business not found." };
  }

  if (business.ownerId !== user.id && user.role !== "ADMIN") {
    return { success: false, message: "You don't have permission to edit this business." };
  }

  // Validation
  if (!data.name || data.name.trim().length < MIN_NAME_LENGTH) {
    return { success: false, message: `Business name must be at least ${MIN_NAME_LENGTH} characters.` };
  }

  if (!data.description || data.description.trim().length < MIN_DESCRIPTION_LENGTH) {
    return { success: false, message: `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters.` };
  }

  if (!data.cityId) {
    return { success: false, message: "City is required." };
  }

  if (!data.address || !data.address.trim()) {
    return { success: false, message: "Address is required." };
  }

  if (data.website && !isValidHttpUrl(data.website)) {
    return { success: false, message: "Enter a valid website URL." };
  }

  // Verify city exists
  const city = await prisma.city.findUnique({ where: { id: data.cityId } });
  if (!city) {
    return { success: false, message: "Selected city not found." };
  }

  // Verify categories exist
  if (data.categoryIds && data.categoryIds.length > 0) {
    const selectedCategories = await prisma.category.findMany({
      where: { id: { in: data.categoryIds } },
      select: { id: true },
    });

    if (selectedCategories.length !== data.categoryIds.length) {
      return { success: false, message: "One or more selected categories are no longer available." };
    }
  }

  const tagNames = normalizeTagNames(data.tags);
  const lat =
    typeof data.latitude === "number"
      ? data.latitude
      : data.latitude
        ? parseFloat(data.latitude)
        : null;
  const lng =
    typeof data.longitude === "number"
      ? data.longitude
      : data.longitude
        ? parseFloat(data.longitude)
        : null;

  // Update business
  try {
    await prisma.business.update({
      where: { id: businessId },
      data: {
        name: data.name.trim(),
        description: data.description.trim(),
        phone: data.phone || null,
        email: data.email?.trim().toLowerCase() || null,
        website: data.website?.trim() || null,
        address: data.address.trim(),
        cityId: data.cityId,
        lat,
        lng,
        // Update categories
        categories:
          data.categoryIds && data.categoryIds.length > 0
            ? {
                deleteMany: {},
                create: data.categoryIds.map((categoryId) => ({ categoryId })),
              }
            : undefined,
        // Update tags
        tags:
          tagNames.length > 0
            ? {
                deleteMany: {},
                create: tagNames.map((tagName) => ({
                  tag: {
                    connectOrCreate: {
                      where: { slug: slugify(tagName) },
                      create: {
                        name: tagName,
                        slug: slugify(tagName),
                      },
                    },
                  },
                })),
              }
            : { deleteMany: {} },
      },
    });

    revalidatePath("/dashboard/businesses");
    revalidatePath(`/business/${business.slug}`);
    revalidatePath("/search");

    return { success: true, message: "Business updated successfully!" };
  } catch (error) {
    console.error("Error updating business:", error);
    return { success: false, message: "Failed to update business. Please try again." };
  }
}

/**
 * Publish a business from a plain <form> action (reads businessId from FormData).
 * Used on the dashboard businesses list so DRAFT listings can be published
 * with a single button click from a server-rendered page.
 */
export async function publishBusinessFormAction(formData) {
  const businessId = formData.get("businessId")?.toString();
  if (!businessId) return;
  await publishBusinessAction(businessId);
  redirect("/dashboard/businesses");
}
