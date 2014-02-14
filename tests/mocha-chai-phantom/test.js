var expect = require('chai').expect,
    webdriverjs = require("webdriverjs"),
    client = webdriverjs.remote({
        desiredCapabilities: {
            browserName: 'phantomjs'
        },
        logLevel: 'silent'
    });
describe('Run Selenium tests', function() {
    before(function(done) {
        client.init();
        client.url('http://example.com/', done);
    });
    it('should be able to view the home page', function(done) {
        client.getTitle(function(title) {
            setTimeout(function() {
                try {
                    expect(title).to.equal('Example Domain');
                    done()
                } catch(e) {
                    done(e)
                }
            }, 1000);
        });
    });
    after(function(done) {
        client.end(done);
    });
});