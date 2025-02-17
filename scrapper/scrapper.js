const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const { Company } = require('../schema/company.schema');
const { XMLParser } = require('fast-xml-parser');
const { REGISTRAR, SCRAP_URL } = require('../static/static');
const { sendMailFor } = require('../mailer/eachCompany');
const xmlParser = new XMLParser();

async function ScrapperCameo() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let res = await page.goto(SCRAP_URL.CAMEO);

  let content = (await res?.text()) || '';
  const $ = cheerio.load(content);
  let options = $('[name="drpCompany"]').children();

  const companyCodeMap = {};
  for (let i = 1; i < options.length; ++i) {
    companyCodeMap[options[i].attribs.value] = options[i].children[0]?.data;
  }

  let codes = Object.keys(companyCodeMap);
  let calls = codes.map((code) =>
    Company.countDocuments({ companyCode: code })
  );

  let result = await Promise.all(calls);
  let createCalls = [],
    newCompanies = [];

  for (let i = 0; i < result.length; ++i) {
    if (result[i] == 0) {
      // new entry for IPO
      createCalls.push(
        Company.create({
          companyCode: codes[i],
          companyName: companyCodeMap[codes[i]],
          registrar: REGISTRAR.CAMEO,
        })
      );
      newCompanies.push({
        companyCode: codes[i],
        companyName: companyCodeMap[codes[i]],
      });
    }
  }

  await Promise.all(createCalls);
  sendMailFor(newCompanies);
  console.log('scrapped cameo');

  await browser.close();
}

async function ScrapperMaashitla() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let res = await page.goto(SCRAP_URL.MAASHITLA);

  let content = (await res?.text()) || '';
  const $ = cheerio.load(content);
  let options = $('[id="txtCompany"]').children();

  const companyCodeMap = {};
  for (let i = 1; i < options.length; ++i) {
    companyCodeMap[options[i].attribs.value] = options[i].children[0]?.data;
  }

  let codes = Object.keys(companyCodeMap);
  let calls = codes.map((code) =>
    Company.countDocuments({ companyCode: code })
  );

  let result = await Promise.all(calls);
  let createCalls = [],
    newCompanies = [];

  for (let i = 0; i < result.length; ++i) {
    if (result[i] == 0) {
      // new entry for IPO
      createCalls.push(
        Company.create({
          companyCode: codes[i],
          companyName: companyCodeMap[codes[i]],
          registrar: REGISTRAR.MAASHITLA,
        })
      );
      newCompanies.push({
        companyCode: codes[i],
        companyName: companyCodeMap[codes[i]],
      });
    }
  }

  await Promise.all(createCalls);
  sendMailFor(newCompanies);
  console.log('scrapped maashitla');

  await browser.close();
}

async function ScrapperBigshare() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let res = await page.goto(SCRAP_URL.BIGSHARE);

  let content = (await res?.text()) || '';
  const $ = cheerio.load(content);
  let options = $('[id="ddlCompany"]').children();

  const companyCodeMap = {};
  for (let i = 1; i < options.length; ++i) {
    companyCodeMap[options[i].attribs.value] = options[i].children[0]?.data;
  }
  let codes = Object.keys(companyCodeMap);
  let calls = codes.map((code) =>
    Company.countDocuments({ companyCode: code })
  );

  let result = await Promise.all(calls);
  let createCalls = [],
    newCompanies = [];

  for (let i = 0; i < result.length; ++i) {
    if (result[i] == 0) {
      // new entry for IPO
      createCalls.push(
        Company.create({
          companyCode: codes[i],
          companyName: companyCodeMap[codes[i]],
          registrar: REGISTRAR.BIGSHARE,
        })
      );
      newCompanies.push({
        companyCode: codes[i],
        companyName: companyCodeMap[codes[i]],
      });
    }
  }

  await Promise.all(createCalls);
  sendMailFor(newCompanies);
  console.log('scrapped bigshare');

  await browser.close();
}

async function ScrapperLinkintime() {
  let response = await fetch(SCRAP_URL.LINKINTIME, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  let content = await response.json();
  let data = xmlParser.parse(content.d);
  if (data.NewDataSet && data.NewDataSet.Table) {
    data = data.NewDataSet.Table;

    let calls = data.map((entry) =>
      Company.countDocuments({ companyCode: entry.company_id })
    );

    let result = await Promise.all(calls);
    let createCalls = [],
      newCompanies = [];

    for (let i = 0; i < result.length; ++i) {
      if (result[i] == 0) {
        // new entry for IPO
        createCalls.push(
          Company.create({
            companyCode: data[i].company_id,
            companyName: data[i].companyname,
            registrar: REGISTRAR.LINKINTIME,
          })
        );
        newCompanies.push({
          companyCode: data[i].company_id,
          companyName: data[i].companyname,
        });
      }
    }

    await Promise.all(createCalls);
    sendMailFor(newCompanies);
    console.log('scrapped linkintime');
  }
}

module.exports = {
  ScrapperCameo,
  ScrapperMaashitla,
  ScrapperBigshare,
  ScrapperLinkintime,
};
