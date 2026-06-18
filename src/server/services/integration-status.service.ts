import { getTenantCorsair } from "@/server/corsair/client";

export async function getIntegrationStatus(userId: string) {
  const tenant = getTenantCorsair(userId);

  console.log("User:", userId);

  let gmailConnected = false;
  let calendarConnected = false;

  try {
    const gmailToken =
      await tenant.gmail.keys.get_access_token();

    console.log("gmail token:", gmailToken);

    gmailConnected = !!gmailToken;
  } catch (error) {
    console.error("gmail error:", error);
  }

  try {
    const calendarToken =
      await tenant.googlecalendar.keys.get_access_token();

    console.log("calendar token:", calendarToken);

    calendarConnected = !!calendarToken;
  } catch (error) {
    console.error("calendar error:", error);
  }

  return {
    gmailConnected,
    calendarConnected,
  };
}