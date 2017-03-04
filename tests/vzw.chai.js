var chai        = require('chai'),
    assert      = chai.assert,
    webdriverio = require('webdriverio');
    config      = require('../config');

describe('VZW site', function(){

    this.timeout(99999999);
    var client;

    before(function(){
        client = webdriverio.remote({ desiredCapabilities: {browserName: 'chrome'} });
        return client.init();
    });

    it('Is at login screen',function() {
         return client
            .url('https://mobile.vzw.com/hybridClient/index.html?wifi-enterMdn')
             .waitForExist('title',8000)
            .getTitle().then(function (title) {
                 assert.strictEqual(title,'My Verizon Mobile');
             });
    });

    it('Login works',function() {
        return client
            .waitForExist('#uid',8000)
            .setValue('#uid',config.vzw.userid)
                .click('#loginSubmit')
            .waitForExist('#challengeQuestion',8000)
            .getText('//*[@id="challengeQuestionWrapper"]/div/div[4]/p[2]').then(function (title) {
                assert.strictEqual(title,config.vzw.secretq);
            })
            .setValue('#challengeQuestion',config.vzw.secreta)
            .click('#loginSubmit')
            .waitForExist('#password',8000)
            .setValue('#password',config.vzw.password)
            .click('#loginSubmit')
            .waitForExist('//*[@id="home-carousel"]/div[1]/div[1]/span[1]',8000)
            .click("#billPillar")
            .waitForExist('//*[@id="bill_content"]/div[3]/div[1]/span[2]"');
    });

    it('Current amount due should be 0',function() {
        return client
            .getText('//*[@id="bill_content"]/div[3]/div[1]/span[2]').then(function (title) {
                if (title != '$0.00'){
                    client.saveScreenshot('vzw.png')
                }
            assert.equal(title,'$0.00');
        })
    });

    after(function() {
        return client.end();
    });
});