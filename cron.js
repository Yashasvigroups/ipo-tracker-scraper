const cron = require("node-cron");
const { disconnectDB, establishConnection } = require("./dbConnection");
const {
  ScrapperCameo,
  ScrapperBigshare,
  ScrapperLinkintime,
  ScrapperMaashitla,
  ScrapperKfintech,
} = require("./scrapper/scrapper");

console.log("Crons scheduled");
cron.schedule("*/29 * * * *", async () => {
  console.log("scrapping started");
  // 1
  await establishConnection();
  // 2
  let calls = [
    ScrapperCameo(),
    ScrapperBigshare(),
    ScrapperLinkintime(),
    ScrapperMaashitla(),
    ScrapperKfintech(),
  ];
  await Promise.all(calls);
  // 3
  disconnectDB();
  console.log("scrapping ended");
});
