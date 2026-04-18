import Link from "next/link";

import { StaticPageLayout } from "@/components/StaticPageLayout/StaticPageLayout";
import layoutStyles from "@/components/StaticPageLayout/StaticPageLayout.module.css";

import { SuggestBusinessForm } from "./SuggestBusinessForm";

export const metadata = {
  title: "Suggest a Business | TX Localist",
  description: "Suggest a Texas business that should be added to TX Localist.",
};

export default async function SuggestBusinessPage({ searchParams }) {
  const params = await searchParams;
  const initialName = params?.name ?? "";
  const initialCity = params?.city ?? "";

  return (
    <StaticPageLayout
      eyebrow="TX Localist // Suggest a Business"
      title="Know a local spot we should feature?"
      lede="Send us the basics and we’ll review it for the directory. This helps keep the list local, useful, and a little more complete every week."
      ctaTitle="Already own the business?"
      ctaCopy="Skip the suggestion queue and create the listing yourself so your photos, hours, and details are exactly right."
      ctaHref="/post-your-business"
      ctaLabel="Add Your Listing"
    >
      <div className={layoutStyles.sectionCard}>
        <h2 className={layoutStyles.sectionTitle}>Send the lead</h2>
        <div className={layoutStyles.sectionBody}>
          <p>
            We review suggestions manually. The stronger the details, the easier it is for us to verify the business and add it correctly.
          </p>
          <SuggestBusinessForm initialName={initialName} initialCity={initialCity} />
        </div>
      </div>

      <div className={layoutStyles.sectionCard}>
        <h2 className={layoutStyles.sectionTitle}>What helps most</h2>
        <div className={layoutStyles.sectionBody}>
          <ul>
            <li>Business name and city or neighborhood</li>
            <li>A website or social profile we can verify</li>
            <li>A quick note on why locals should know about it</li>
          </ul>
          <p>
            Prefer direct email? You can always reach us at <a href="mailto:hello@txlocalist.com">hello@txlocalist.com</a>.
          </p>
          <p>
            Need something else? Head over to the <Link href="/contact">contact page</Link>.
          </p>
        </div>
      </div>
    </StaticPageLayout>
  );
}
