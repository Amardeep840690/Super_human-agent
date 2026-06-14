import "dotenv/config";
import { corsair } from "./corsair/corsair";

const main = async () => {
  const tanent = corsair.withTenant("user_123");
  // console.log(tanent)

  //   const result = await tanent.gmail.db.threads.search({
  //     data: {
  //       snippet: {
  //         contains: "Finish",
  //       },
  //     },
  //   });
  //   console.log("result = ", result);

  //   const calendar = await tanent.googlecalendar.api.events.create({
  //     event: {
  //       summary: "Hackathon Meeting",

  //       start: {
  //         dateTime: "2026-06-15T15:00:00+05:30",
  //       },

  //       end: {
  //         dateTime: "2026-06-15T16:00:00+05:30",
  //       },
  //     },
  //   });

  const calendar = await tanent.googlecalendar.db.events.search({
    data: {},
  });
  console.log("calendar = ", calendar);
};
main();
