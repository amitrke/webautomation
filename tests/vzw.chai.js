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
            .url('https://www.verizonwireless.com/')
            .getText('.o-sign-in-bar-blurb').then(function (title) {
                 assert.strictEqual(title,'Sign in');
             });
    });

    it('Login works',function() {
        return client
            .setValue('#IDToken1',config.vzw.userid)
            .click('.o-sign-in-bar-sign-in')
            .waitForExist('div.container-fluid',8000)
            .getTitle().then(function (title) {
                assert.strictEqual(title,'Verizon Secret Question');
            })
            .getText('/html/body/div[3]/div[3]/div[1]/p[3]').then(function (title) {
                assert.strictEqual(title,config.vzw.secretq);
            })
            .setValue('#IDToken1',config.vzw.secreta)
            .click('#otherButton')
            .waitForExist('div.container-fluid',8000)
            .getText('//*[@id="loginForm"]/fieldset/label').then(function (title) {
                assert.strictEqual(title,'Enter Password:');
            })
            .setValue('#IDToken2',config.vzw.password)
            .click('.o-red-button')
            .waitForExist('//*[@id="myVzwOverview"]/div[4]/div/div[1]/div/div[1]/span[2]',8000)
    });

    it('Current amount due should be 0',function() {
        return client
            .getText('//*[@id="myVzwOverview"]/div[4]/div/div[1]/div/div[1]/span[2]').then(function (title) {
            assert.equal(title,'0');
        })
    });

    after(function() {
        return client.end();
    });
});