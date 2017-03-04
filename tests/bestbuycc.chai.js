var chai        = require('chai'),
    assert      = chai.assert,
    webdriverio = require('webdriverio');
    config      = require('../config.json');

describe('Best buy credit card site', function(){

    this.timeout(99999999);
    var client;

    before(function(){
        client = webdriverio.remote({ desiredCapabilities: {browserName: 'chrome'} });
        return client.init();
    });

    it('Is at login screen',function() {
         return client
            .url('http://bestbuy.accountonline.com/')
            .getText('[data-module-label="data-module-label"]').then(function (title) {
                 assert.strictEqual(title,'Sign On');
             });
    });

    it('Login works',function() {
        return client
            .setValue('#user_id_1',config.BstBuyCC.userid)
            .setValue('#password_2',config.BstBuyCC.password)
            .submitForm('button.featured')
            .waitForExist('//*[@id="skip_target"]/section[2]/section/article/div[1]/dl[2]/dd[1]',15000)
            .getTitle().then(function (title) {
                assert.strictEqual(title,'Best Buy Credit Card: Home');
            });
    });

    it('Outstanding amount is 0',function() {
        return client.
            getText('//*[@id="skip_target"]/section[2]/section/article/div[1]/dl[2]/dd[1]').then(function (title) {
            if (title != '0'){
                client.saveScreenshot('bestbuycc.png')
            }
            assert.equal(title,'$0.00');
        });
    });

    after(function() {
        return client.end();
    });
});