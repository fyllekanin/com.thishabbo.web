// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const {SpecReporter} = require('jasmine-spec-reporter');
process.env.CHROME_BIN = require('puppeteer').executablePath();

exports.config = {
    allScriptsTimeout: 20000,
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
    directConnect: true,
    baseUrl: 'http://localhost:4200/',
    framework: 'jasmine',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 100000,
        print: function () {
        }
    },
    onPrepare() {
        require('ts-node').register({
            project: require('path').join(__dirname, './tsconfig.e2e.json')
        });
        jasmine.getEnv().addReporter(new SpecReporter({spec: {displayStacktrace: true}}));
        browser.waitForAngularEnabled(true);
    }
};
