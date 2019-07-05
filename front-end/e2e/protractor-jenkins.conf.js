// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const {SpecReporter} = require('jasmine-spec-reporter');
const HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');

exports.config = {
    allScriptsTimeout: 110000,
    specs: [
        './src/tests/user/*.e2e-spec.ts',
        './src/tests/forum/*.e2e-spec.ts',
        './src/tests/staffcp/staffcp-one.e2e-spec.ts',
        './src/tests/sitecp/sitecp-one.e2e-spec.ts'
    ],
    capabilities: {
        browserName: 'chrome',
        marionette: true,
        acceptInsecureCerts: true,
        chromeOptions: {
            args: ['--headless', 'no-sandbox', '--disable-gpu', '--window-size=1280,1024']
        }
    },
    directConnect: false,
    baseUrl: 'http://test.rabbit-network.net',
    framework: 'jasmine',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 600000,
        print: function () {
        }
    },
    localSeleniumStandaloneOpts: {
        loopback: true
    },
    onPrepare() {
        require('ts-node').register({
            project: require('path').join(__dirname, './tsconfig.e2e.json')
        });
        jasmine.getEnv().addReporter(new SpecReporter({spec: {displayStacktrace: true}}));
        jasmine.getEnv().addReporter(new HtmlScreenshotReporter({
            dest: 'target/screenshots',
            filename: 'my-report.html',
            captureOnlyFailedSpecs: true
        }));
        browser.waitForAngularEnabled(true);
    },
    beforeEach() {
        browser.executeScript("window.localStorage.setItem('mini-profile-disabled', 'true');");
    }
};
