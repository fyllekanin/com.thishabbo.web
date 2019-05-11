// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
    config.set({
        basePath: '../',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-phantomjs-launcher'),
            require('karma-coverage'),
            require('karma-coverage-istanbul-reporter'),
            require('karma-spec-reporter'),
            require('@angular-devkit/build-angular/plugins/karma')
        ],
        client: {
            captureConsole: true,
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        files: [
            {pattern: './node_modules/@angular/material/prebuilt-themes/indigo-pink.css', includes: true}
        ],
        preprocessors: {},
        coverageIstanbulReporter: {
            dir: require('path').join(__dirname, 'coverage'),
            reports: ['lcovonly', 'cobertura', 'html', 'text-summary', 'text'],
            fixWebpackSourcePaths: true,
            skipFilesWithNoCoverage: false,
            'report-config': {
                html: {
                    // outputs the report in ./coverage/html
                    subdir: 'html'
                }
            }
        },
        angularCli: {
            environment: 'dev',
            codeCoverage: true
        },
        reporters: ['spec', 'coverage-istanbul'],
        specReporter: {
            lateReport: true,
            showSpecTiming: true, // print the time elapsed for each spec
            slowTestTime: 40, // karma-spec-reporter-2
            fastTestTime: 20 // karma-spec-reporter-2
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadlessNoSandbox'],
        browserNoActivityTimeout: 60000, // default is 10000
        browserDisconnectTimeout: 10000, // default is 2000
        captureTimeout: 60000, // default is 60000
        singleRun: true,
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: [
                    '--no-sandbox',
                    '--no-proxy-server',
                    '--disable-gpu' // https://bugs.chromium.org/p/chromium/issues/detail?id=737678
                ]
            },
            ChromeDebug: {
                base: 'Chrome',
                flags: [
                    '--remote-debugging-port=9222'
                ]
            }
        }
    });
};