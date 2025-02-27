const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const { Company } = require("../schema/company.schema");
const { XMLParser } = require("fast-xml-parser");
const { REGISTRAR, SCRAP_URL } = require("../static/static");
// const { sendMailFor } = require("../mailer/eachCompany");
const xmlParser = new XMLParser();

async function ScrapperCameo() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let res = await page.goto(SCRAP_URL.CAMEO);

  let content = (await res?.text()) || "";
  const $ = cheerio.load(content);
  let options = $('[name="drpCompany"]').children();

  const companyCodeMap = {};
  for (let i = 1; i < options.length; ++i) {
    companyCodeMap[options[i].attribs.value] = options[i].children[0]?.data;
  }

  let newCompanies = await createAndDeleteCompaniesForRegistrar(
    REGISTRAR.CAMEO,
    companyCodeMap
  );

  // sendMailFor(newCompanies);
  console.log("scrapped cameo");

  await browser.close();
}

async function ScrapperMaashitla() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let res = await page.goto(SCRAP_URL.MAASHITLA);

  let content = (await res?.text()) || "";
  const $ = cheerio.load(content);
  let options = $('[id="txtCompany"]').children();

  const companyCodeMap = {};
  for (let i = 1; i < options.length; ++i) {
    companyCodeMap[options[i].attribs.value] = options[i].children[0]?.data;
  }

  let newCompanies = await createAndDeleteCompaniesForRegistrar(
    REGISTRAR.MAASHITLA,
    companyCodeMap
  );
  // sendMailFor(newCompanies);
  console.log("scrapped maashitla");

  await browser.close();
}

async function ScrapperBigshare() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let res = await page.goto(SCRAP_URL.BIGSHARE);

  let content = (await res?.text()) || "";
  const $ = cheerio.load(content);
  let options = $('[id="ddlCompany"]').children();

  const companyCodeMap = {};
  for (let i = 1; i < options.length; ++i) {
    companyCodeMap[options[i].attribs.value] = options[i].children[0]?.data;
  }
  let newCompanies = await createAndDeleteCompaniesForRegistrar(
    REGISTRAR.BIGSHARE,
    companyCodeMap
  );
  // sendMailFor(newCompanies);
  console.log("scrapped bigshare");

  await browser.close();
}

async function ScrapperLinkintime() {
  let response = await fetch(SCRAP_URL.LINKINTIME, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
  });

  let content = await response.json();
  let data = xmlParser.parse(content.d);
  if (data.NewDataSet && data.NewDataSet.Table) {
    data = data.NewDataSet.Table;

    const companyCodeMap = {};
    data?.forEach((entry) => {
      companyCodeMap[entry.company_id] = entry.companyname;
    });
    let newCompanies = await createAndDeleteCompaniesForRegistrar(
      REGISTRAR.LINKINTIME,
      companyCodeMap
    );

    // sendMailFor(newCompanies);
    console.log("scrapped linkintime");
  }
}

async function ScrapperKfintech() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let res = await page.goto(SCRAP_URL.KFINTECH);

  let content = (await res?.text()) || "";
  const $ = cheerio.load(content);
  let options = $('[id="ddl_ipo"]').children();

  const companyCodeMap = {};
  for (let i = 1; i < options.length; ++i) {
    companyCodeMap[options[i].attribs.value] = options[i].children[0]?.data;
  }
  let newCompanies = await createAndDeleteCompaniesForRegistrar(
    REGISTRAR.KFINTECH,
    companyCodeMap
  );
  // sendMailFor(newCompanies);
  console.log("scrapped kniftech");

  await browser.close();
}

async function companyCodeSetFromRegistrar(registrar) {
  let companies = await Company.find({ registrar }).lean();
  let codes = new Set();
  companies.forEach((company) => codes.add(company.companyCode));
  return codes;
}

async function createAndDeleteCompaniesForRegistrar(registrar, companyCodeMap) {
  let newCompanies = [];
  const companySetDB = await companyCodeSetFromRegistrar(registrar); // codes from db

  let createCalls = Object.keys(companyCodeMap)
    .filter((code) => !companySetDB.has(code)) // filter out the companies that are already in the database
    .map((code) => {
      newCompanies.push({
        companyCode: code,
        companyName: companyCodeMap[code],
      });
      return Company.create({
        companyCode: code,
        companyName: companyCodeMap[code],
        registrar: registrar,
      });
    });

  let deleteCalls = [];
  companySetDB.forEach((code) => {
    if (!companyCodeMap[code]) {
      deleteCalls.push(Company.deleteOne({ companyCode: code })); // delete the company
    }
  });

  await Promise.all([...createCalls, ...deleteCalls]);
  return newCompanies;
}

module.exports = {
  ScrapperCameo,
  ScrapperMaashitla,
  ScrapperBigshare,
  ScrapperLinkintime,
  ScrapperKfintech,
};
