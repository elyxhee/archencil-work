/**
 * This script serves as a runner for the Angular scripts located in the /scripts/angular folder.
 *
 * Usage: node angular-script-runner.js <script-name> <parent-component> <child-component>
 *
 * Before using this script, make sure to install the `fs-extra` package as a dev dependency:
 * npm install fs-extra --save-dev
 *
 * The script will try to match the name with the exact script name on the /scripts/angular directory.
 *
 * Example:
 * node angular-script-runner.js generate-nested-component hits-list textarea-display
 * node angular-script-runner.js remove-nested-component hits-list textarea-display
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

if (process.argv.length < 4) {
    console.error(
        'Usage: node angular-script-runner.js <script-name> <parent-component> <child-component> [subchild-component...]'
    );
    process.exit(1);
}

const scriptName = process.argv[2];
const scriptArgs = process.argv.slice(3);
const scriptFolderPath = './scripts/angular/';
const scriptFilename = scriptName + '.js';
const scriptPath = path.join(scriptFolderPath, scriptFilename);

fs.access(scriptPath, fs.constants.F_OK, (err) => {
    if (err) {
        console.error(`Error: Script "${scriptFilename}" not found in "${scriptFolderPath}"`);
        process.exit(1);
    } else {
        const result = spawnSync('node', [scriptPath, ...scriptArgs], { stdio: 'inherit' });
        process.exit(result.status);
    }
});
