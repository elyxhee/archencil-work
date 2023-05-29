/**
 * This script automates the creation of a nested (child) component inside a parent component's folder.
 * It also adds the child component's selector to the parent component's HTML file
 * and imports the child component in the parent component's TypeScript file.
 *
 * Usage: node generate-nested-component.js <path-to-parent-component> <child-component>
 *
 * The <path-to-parent-component> should be a space-separated list of components that form the path.
 *
 * Before using this script, make sure to install the `fs-extra` package as a dev dependency:
 * npm install fs-extra --save-dev
 *
 * Example:
 * node generate-nested-component.js hits-list hits-display custom-dropdown
 *
 * This will create a 'custom-dropdown' component inside the 'hits-list/hits-display' component's folder.
 */

// Import required modules
const { execSync } = require('child_process');
const fs = require('fs-extra');

// Function to convert kebab-case string to PascalCase
function kebabToPascalCase(str) {
    return str
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}

// Function to generate a component
function generateComponent(parentPath, child) {
    // Create the command to generate the child component inside the parent component's folder
    const command = `ng generate component components/${parentPath ? parentPath + '/' : ''}${child}`;
    console.log(`Executing: ${command}`);

    // Execute the command
    execSync(command, { stdio: 'inherit' });

    if (parentPath) {
        // Define the path to the parent component's HTML file
        const parentHtmlFile = `src/app/components/${parentPath}/${parentPath.split('/').pop()}.component.html`;

        // Add the child component's selector to the parent component's HTML file
        fs.appendFileSync(parentHtmlFile, `\n<app-${child}></app-${child}>\n`);

        // Define the path to the parent component's TypeScript file
        const parentTsFile = `src/app/components/${parentPath}/${parentPath.split('/').pop()}.component.ts`;

        // Create the import statement for the child component
        const childComponentImportPath = `./components/${child}/${child}.component`;
        const importStatement = `import { ${kebabToPascalCase(child)}Component } from '${childComponentImportPath}';\n`;

        // Read the content of the parent component's TypeScript file
        const parentTsContent = fs.readFileSync(parentTsFile, 'utf-8');

        // Find the last import statement
        const lastImportIndex = parentTsContent.lastIndexOf('import');

        // Find the end of the last import statement
        const endOfLastImport = parentTsContent.indexOf(';', lastImportIndex) + 1;

        // Add the import statement after the last import statement in the parent component's TypeScript file
        const updatedParentTsContent = [
            parentTsContent.slice(0, endOfLastImport + 1),
            parentTsContent.slice(endOfLastImport + 1, endOfLastImport + 2) === '\n' ? '' : '\n',
            importStatement,
            parentTsContent.slice(endOfLastImport + 1)
        ].join('');

        // Write the updated content to the parent component's TypeScript file
        fs.writeFileSync(parentTsFile, updatedParentTsContent);
    }
}

// Check if the user provided the correct number of arguments
if (process.argv.length < 3) {
    console.error(
        'Usage: node generate-nested-component.js <path-to-parent-component> <child-component> OR node generate-nested-component.js <component>'
    );
    process.exit(1);
}

// Check if two arguments were provided
if (process.argv.length === 4) {
    // Assign command line arguments to variables
    const parentComponentsPath = 'components/' + process.argv[2];
    const childComponent = process.argv[3];

    // Generate the child component
    generateComponent(parentComponentsPath, childComponent);
} else {
    // Assign command line argument to variable
    const component = process.argv[2];

    // Generate the component
    generateComponent(null, component);
}
