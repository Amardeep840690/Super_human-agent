import "server-only";

import { createCorsair } from "corsair";
import { gmail } from "@corsair-dev/gmail";
import { googlecalendar } from "@corsair-dev/googlecalendar";
import { pool } from "@/server/db";

export const corsair = createCorsair({
  plugins: [gmail(), googlecalendar()],
  database: pool,
  kek: process.env.CORSAIR_KEK ?? "",
  multiTenancy: true,
});

export function getTenantCorsair(userId: string) {
  return corsair.withTenant(userId);
}
