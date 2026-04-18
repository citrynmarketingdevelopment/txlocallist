"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import formStyles from "../../new/form.module.css";
import { updateBusinessAction } from "@/app/actions/businesses";
import { BusinessHoursEditor } from "../../BusinessHoursEditor";
import { createBusinessHoursFormState } from "@/lib/business-hours";

/**
 * Business edit form.
 * Similar to CreateBusinessForm but for existing listings.
 */
export function EditBusinessForm({ business, cities, categories }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: business.name || "",
    description: business.description || "",
    phone: business.phone || "",
    email: business.email || "",
    website: business.website || "",
    cityId: business.cityId || "",
    address: business.address || "",
    latitude: business.lat ?? "",
    longitude: business.lng ?? "",
    hours: createBusinessHoursFormState(business.hours),
    categoryIds: business.categories.map((bc) => bc.categoryId),
    tags: business.tags?.map((bt) => bt.tag.name).join(", ") || "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle category selection
  const handleCategoryToggle = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.name.trim()) {
      setError("Business name is required");
      return;
    }
    if (!formData.description.trim()) {
      setError("Business description is required");
      return;
    }
    if (!formData.cityId) {
      setError("City is required");
      return;
    }
    if (!formData.address.trim()) {
      setError("Address is required");
      return;
    }
    if (formData.categoryIds.length === 0) {
      setError("Select at least one category");
      return;
    }

    setLoading(true);
    try {
      const result = await updateBusinessAction(business.id, {
        name: formData.name,
        description: formData.description,
        phone: formData.phone || null,
        email: formData.email || null,
        website: formData.website || null,
        cityId: formData.cityId,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
        hours: formData.hours,
        categoryIds: formData.categoryIds,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      });

      if (!result.success) {
        setError(result.message || "Failed to update listing");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/businesses");
      }, 1500);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={formStyles.form}>
      {error && <div className={formStyles.errorMessage}>{error}</div>}

      {success && (
        <div className={formStyles.successMessage}>
          Listing updated successfully. Redirecting...
        </div>
      )}

      <div className={formStyles.step}>
        <h2 className={formStyles.stepTitle}>Edit Listing</h2>
        <p className={formStyles.stepDescription}>
          Update your business information
        </p>

        <div className={formStyles.formGroup}>
          <label htmlFor="name" className={formStyles.label}>
            Business Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Coffee House Cafe"
            className={formStyles.input}
            required
          />
        </div>

        <div className={formStyles.formGroup}>
          <label htmlFor="description" className={formStyles.label}>
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your business..."
            rows={5}
            className={formStyles.textarea}
            required
          />
        </div>

        <div className={formStyles.formRow}>
          <div className={formStyles.formGroup}>
            <label htmlFor="phone" className={formStyles.label}>
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(512) 555-0123"
              className={formStyles.input}
            />
          </div>

          <div className={formStyles.formGroup}>
            <label htmlFor="email" className={formStyles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="hello@business.com"
              className={formStyles.input}
            />
          </div>
        </div>

        <div className={formStyles.formGroup}>
          <label htmlFor="website" className={formStyles.label}>
            Website
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://example.com"
            className={formStyles.input}
          />
        </div>

        <h3 style={{ marginTop: "2rem" }}>Location</h3>

        <div className={formStyles.formGroup}>
          <label htmlFor="cityId" className={formStyles.label}>
            City *
          </label>
          <select
            id="cityId"
            name="cityId"
            value={formData.cityId}
            onChange={handleChange}
            className={formStyles.select}
            required
          >
            <option value="">Select a city...</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <div className={formStyles.formGroup}>
          <label htmlFor="address" className={formStyles.label}>
            Street Address *
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main Street"
            className={formStyles.input}
            required
          />
        </div>

        <div className={formStyles.formRow}>
          <div className={formStyles.formGroup}>
            <label htmlFor="latitude" className={formStyles.label}>
              Latitude (optional)
            </label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              step="0.000001"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="30.2672"
              className={formStyles.input}
            />
          </div>

          <div className={formStyles.formGroup}>
            <label htmlFor="longitude" className={formStyles.label}>
              Longitude (optional)
            </label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              step="0.000001"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="-97.7431"
              className={formStyles.input}
            />
          </div>
        </div>

        <BusinessHoursEditor
          hours={formData.hours}
          onChange={(hours) =>
            setFormData((prev) => ({
              ...prev,
              hours,
            }))
          }
        />

        <h3 style={{ marginTop: "2rem" }}>Categories & Tags</h3>

        <div className={formStyles.formGroup}>
          <label className={formStyles.label}>Business Categories *</label>
          <div className={formStyles.categoryGrid}>
            {categories.map((category) => (
              <label key={category.id} className={formStyles.categoryCheckbox}>
                <input
                  type="checkbox"
                  checked={formData.categoryIds.includes(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                />
                <span className={formStyles.categoryLabel}>
                  {category.icon ? `${category.icon} ` : ""}{category.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className={formStyles.formGroup}>
          <label htmlFor="tags" className={formStyles.label}>
            Tags (comma-separated, optional)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., organic, locally-owned, pet-friendly"
            className={formStyles.input}
          />
        </div>
      </div>

      <div className={formStyles.formNavigation}>
        <button
          type="button"
          onClick={() => router.back()}
          className={formStyles.buttonSecondary}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={formStyles.buttonPrimary}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

