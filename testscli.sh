#!/usr/bin/env bash
TEST_BROWSER_DRIVER=puppeteer TEST_SERVER=0 METEOR_PACKAGE_DIRS=../ meteor test-packages ./ --once --driver-package meteortesting:mocha