import "dotenv/config";

import { defineConfig } from "prisma/config";

const datasourceUrl =
  process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!datasourceUrl) {
  throw new Error(
    "Missing database env var. Set DATABASE_URL_UNPOOLED or DATABASE_URL.",
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: datasourceUrl,
  },
});
