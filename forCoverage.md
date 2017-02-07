## To Run Coverage and Send to Coveralls
1. Run test
2. set coverage report path on .settings.coverge.json
3. Generate Lcov.info
4. Report coverage to coveralls.io

# Details
## Run test
`meteor test --full-app --settings settings.coverage.json --driver-package practicalmeteor:mocha`

## set coverage report path on .settings.coverge.json

`{
  "coverage": {
      "coverage_app_folder": "/path/to/your/root folder/kissa-rc/",
      "is_coverage_active": true,
      "verbose": false
    }
}`

e.g `/Users/xmile/Documents/Andela Simulations/kissa-rc/`
make sure of the `/` at the end.



## Generate Lcov.info
When test has completed building, visit `localhost:3000` on the browser and run the following command in your browser(chrome) console and the client coverage will be saved into the server coverage report folder.

`Meteor.exportCoverage(type, callback)`

- type: the type of report you want to create inside your COVERAGE_APP_FOLDER
- Default: coverage, used to dump the coverage object in a file because when there are several types of test, we want to merge results, and the server reloads between each one.
- Allowed values: coverage, html, json, json-summary, lcovonly, remap, text-summary
- Not working values: clover, cobertura, lcov, teamcity, text, text-lcov, PR welcome
- Except for coverage, the file generation is handled by istanbuljs/istanbul-reports
- Meteor.exportCoverage(null, function(err) {console.log(err)})
npm-debug.log

e.g `Meteor.exportCoverage("lcovonly", function(err) {console.log(err)})`


## Report Coverage to coveralls.io
Run this command on your terminal to send coverage report to coveralls

`cat .coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js || true`
