import { createUploadthing } from "uploadthing/next";

import { getCurrentUser } from "@/lib/auth/session";
import { getFeatures } from "@/lib/tiers";
import { prisma } from "@/lib/prisma";

const f = createUploadthing();

/**
 * UploadThing file router for TX Localist.
 *
 * businessPhoto — used in the listing creation / edit form.
 *   Max file count is driven by the owner's active tier.
 *   Free tier: 1 photo, Starter: 3, Pro: 8, Premium: 20
 */
export const ourFileRouter = {
  businessPhoto: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 20, // hard cap — soft cap enforced in middleware
    },
  })
    .middleware(async ({ req }) => {
      const user = await getCurrentUser();
      if (!user) throw new Error("Unauthorized");

      // Find the owner's active subscription to get their tier slug
      const subscription = await prisma.subscription.findFirst({
        where: { business: { ownerId: user.id }, status: "ACTIVE" },
        include: { plan: { select: { slug: true } } },
      }).catch(() => null);

      const tierSlug = subscription?.plan?.slug ?? "free";
      const features = getFeatures(tierSlug);

      return {
        userId: user.id,
        maxPhotos: features.MAX_PHOTOS,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Return metadata to the client callback
      return {
        uploadedBy: metadata.userId,
        url: file.ufsUrl ?? file.url,
        name: file.name,
        size: file.size,
      };
    }),
};
