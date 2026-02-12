#!/usr/bin/env bash
PORT=$1
TEST_BROWSER_DRIVER=puppeteer TEST_SERVER=0 METEOR_PACKAGE_DIRS=../ meteor test-packages ./ --driver-package  meteortesting:mocha --port=${PORT}
