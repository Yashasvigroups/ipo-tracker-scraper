const REGISTRAR = {
  CAMEO: 'CAMEO',
  MAASHITLA: 'MAASHITLA',
  BIGSHARE: 'BIGSHARE',
  LINKINTIME: 'LINKINTIME',
  KFINTECH: 'KFINTECH',
};

const SCRAP_URL = {
  CAMEO: 'https://ipostatus1.cameoindia.com/',
  MAASHITLA: 'https://maashitla.com/allotment-status/public-issues',
  BIGSHARE: 'https://ipo.bigshareonline.com/IPO_Status.html',
  LINKINTIME: 'https://in.mpms.mufg.com/Initial_Offer/IPO.aspx/GetDetails',
  KFINTECH: 'https://kosmic.kfintech.com/ipostatus/'
};

const STATUS = {
  NOT_APPLIED: 'NOT APPLIED',
  NOT_ALLOTED: 'NOT ALLOTED',
  ALLOTED: ' ALLOTED SHARES',
};

module.exports = {
  STATUS,
  REGISTRAR,
  SCRAP_URL,
};
