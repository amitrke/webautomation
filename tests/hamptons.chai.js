var chai        = require('chai'),
    assert      = chai.assert,
    webdriverio = require('webdriverio');
    config      = require('../config.json');

describe('Hamptons at RTP site', function(){

    this.timeout(99999999);
    var client;

    before(function(){
        client = webdriverio.remote({ desiredCapabilities: {browserName: 'chrome'} });
        return client.init();
    });

    it('Is at login screen',function() {
         return client
            .url('http://www.thehamptonsrtp.com/')
             .element('//*[@id="callout_box3"]/div/div/div[5]/a').click()
             .pause(4000)
            .getText('//*[@id="loginIntroDescription"]/h1/div').then(function (title) {
                 assert.strictEqual(title,'Welcome to Hamptons at RTP');
             });
    });

    it('Login works',function() {
        return client
            .waitForExist('#btnSubmitLogon', 1000)
            .setValue('#loginuser',config.Hamptons.userid)
            .setValue('#loginpass',config.Hamptons.password)
            .click('#btnSubmitLogon')
            .pause(5000)
            .getTitle().then(function (title) {
                assert.strictEqual(title,'Welcome Home - Main Page');
            });
    });

    it('Current amount due should be 0',function() {
        return client
            .waitForExist('.acct-due',8000)
            .getText('.acct-due').then(function (title) {
                if (title != '0'){
                    client.saveScreenshot('hamptons.png')
                }
                assert.equal(title,'$0.00');
            })
    });

    after(function() {
        return client.end();
    });
});