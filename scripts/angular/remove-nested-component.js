/**
 * This script automates the removal of a nested (child) component from a parent component's folder.
 * It removes the child component folder and its files, the child component's selector from the
 * parent component's HTML file, and the child component import from the parent component's
 * TypeScript file. Additionally, it removes the import and declaration in the app.module.ts file.
 *
 * Usage: node remove-nested-component.js <parent-component> <child-component>
 *
 * Before using this script, make sure to install the `fs-extra` package as a dev dependency:
 * npm install fs-extra --save-dev
 *
 * Example:
 * node remove-nested-component.js hits-list textarea-display
 *
 * This will remove the 'textarea-display' component from the 'hits-list' component's folder.
 */

// Import required modules
const fs = require('fs-extra');

// Check if the user provided the correct number of arguments
if (process.argv.length !== 4) {
    console.error('Usage: node remove-nested-component.js <parent-component> <child-component>');
    process.exit(1);
}

// Assign command line arguments to variables
const parentComponent = 'components/' + process.argv[2];
const childComponent = process.argv[3];

// Define the paths to the parent and child component files
const parentHtmlFile = `src/app/${parentComponent}/${parentComponent.split('/').pop()}.component.html`;
const parentTsFile = `src/app/${parentComponent}/${parentComponent.split('/').pop()}.component.ts`;
const childComponentFolder = `src/app/${parentComponent}/${childComponent}`;

// Remove the child component's selector from the parent component's HTML file
const parentHtmlContent = fs.readFileSync(parentHtmlFile, 'utf-8');
const updatedHtmlContent = parentHtmlContent.replace(
    new RegExp(`\\s*<app-${childComponent}></app-${childComponent}>\\s*`, 'g'),
    ''
);
fs.writeFileSync(parentHtmlFile, updatedHtmlContent);

// Remove the child component import from the parent component's TypeScript file
const parentTsContent = fs.readFileSync(parentTsFile, 'utf-8');
const updatedTsContent = parentTsContent.replace(
    new RegExp(
        `import { ${
            childComponent.charAt(0).toUpperCase() + childComponent.slice(1)
        }Component } from './${childComponent}/${childComponent}.component';\\s*`,
        'g'
    ),
    ''
);
fs.writeFileSync(parentTsFile, updatedTsContent);

// Define the path to the AppModule file
const appModuleFile = 'src/app/app.module.ts';

// Remove the child component import from the AppModule TypeScript file
const appModuleContent = fs.readFileSync(appModuleFile, 'utf-8');
const componentName = `${childComponent.charAt(0).toUpperCase() + childComponent.slice(1)}Component`;
const updatedAppModuleContent = appModuleContent
    .split('\n')
    .filter((line) => !line.includes(componentName))
    .join('\n');

fs.writeFileSync(appModuleFile, updatedAppModuleContent);

// Remove the child component folder and its files
fs.removeSync(childComponentFolder);

console.log(`Removed ${childComponent} component from ${parentComponent} component's folder.`);
