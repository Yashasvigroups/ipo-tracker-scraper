const { User } = require('../schema/user.schema');
const { sendMail } = require('./sender');

async function sendMailFor(companies) {
  if (!companies || companies.length == 0) return;

  let users = await User.find({}, { email: 1, name: 1, _id: 0 });
  let promises = [];

  for (let j = 0; j < companies.length; ++j) {
    let { companyName } = companies[j];
    for (let i = 0; i < users.length; ++i) {
      let { email, name } = users[i];
      promises.push(sendMail(email, name, companyName));
    }
  }

  await Promise.all(promises);
}

module.exports = { sendMailFor };
