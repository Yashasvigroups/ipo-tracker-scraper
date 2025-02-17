const cron = require('node-cron');
const { disconnectDB, establishConnection } = require('./dbConnection');
const {
  ScrapperCameo,
  ScrapperBigshare,
  ScrapperLinkintime,
  ScrapperMaashitla,
} = require('./scrapper/scrapper');

cron.schedule('1 * * * *', async () => {
  console.log('scrapping started');
  // 1
  await establishConnection();
  // 2
  let calls = [
    ScrapperCameo(),
    ScrapperBigshare(),
    ScrapperLinkintime(),
    ScrapperMaashitla(),
  ];
  await Promise.all(calls);
  // 3
  disconnectDB();
  console.log('scrapping ended');
});
