//const scraper = require('./scraper');
const moment = require("moment");
const Puppeteer = require("puppeteer");

class AhCalendar {
  constructor(options) {
    options = Object.assign({
      months: 2,
      monthOffset: 0,
      includeBreaks: true,
    });
    //? Could be accessed with this.options anywhere but I prefer this tbh...
    this.url = "https://sam.ahold.com/etm/time/timesheet/etmTnsMonth.jsp";
    this.months = options.months;
    this.monthOffet = options.monthOffet;
    this.includeBreaks = options.includeBreaks;
    this.username = options.username || "";
    this.password = options.password || "";
  }

  async startBrowser(callback) {
        /**
         * * If any bugs appear due to this returning any error, reject will actually be called and used.
         * * But for now the parameter is omitted.
        */
    return new Promise(async (resolve) => {
      this.browser = await Puppeteer.launch({headless: false});
      this.page = await this.browser.newPage();
      await this.page.goto(this.url);
      await this.page.waitForSelector('#uid');
      if (callback) {
        if (typeof callback !== "function") {
          throw (
            "Parameter callback expected a function but got " + typeof callback
          );
        };
        callback(null, this);
      } else {
        resolve(this);
      };
    });
  }

  async login(options, callback) {
    return new Promise(async (resolve, reject) => {
      if (typeof options === "object") {
        this.username = options.username;
        this.password = options.password;
      } else if (
        typeof options !== "object" &&
        typeof options === "function" &&
        !callback
      ) {
        callback = options;
      }
      if (!this.page) {
        if (callback) {
          return callback("Browser not started", this);
        }
        reject("Browser not started");
      }
      if (
        this.page.url() ===
        "https://sam.ahold.com/az_ahsam_jct/home.htm"
      ) {
        if (callback) {
          return callback("Browser already logged in", this);
        }
        reject("Browser already logged in");
      };
      await this.page.type('#uid', this.username, {delay: 10});
      await this.page.type('#password', this.password, {delay : 10});
      //await this.page.click('input.submitButton.button-1');
      resolve(this);
    });
  }
}

module.exports = AhCalendar;