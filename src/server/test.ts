import "dotenv/config";
import { corsair } from "./corsair/corsair";

const main = async () => {
  const tanent = corsair.withTenant("a781bef8-a125-45d8-9f48-ef640a392b76");
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

  const google = await tanent.gmail.api.threads.list({
    // data: {},
  });
  console.log("google = ", google);
};
main();
