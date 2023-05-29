/**
 * This script generates an Angular service for a specified component.
 * The service is created inside a "services" folder within the component's folder.
 *
 * Usage: node angular-script-runner.js generate-component-service component_path service_name
 *
 * Example:
 * node angular-script-runner.js generate-component-service parent-component/child-component custom-service-name
 */

const fs = require('fs');
const path = require('path');

function createFolderIfNotExist(folderPath) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
}

function createServiceFile(serviceFolderPath, serviceName) {
    // Convert hyphenated serviceName to camelCase
    const serviceNameCamelCase = serviceName.replace(/-./g, (chr) => chr.charAt(1).toUpperCase()); // Convert characters after hyphens to uppercase
    const serviceClassName = serviceNameCamelCase.charAt(0).toUpperCase() + serviceNameCamelCase.slice(1); // Capitalize the first character
    const serviceFileName = `${serviceName}.service.ts`;
    const serviceFilePath = path.join(serviceFolderPath, serviceFileName);

    const serviceFileContent = `
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ${serviceClassName}Service {
  // Add your methods and properties here
}
`;

    fs.writeFileSync(serviceFilePath, serviceFileContent.trim());

    // Create spec.ts file
    const specFileName = `${serviceName}.service.spec.ts`;
    const specFilePath = path.join(serviceFolderPath, specFileName);

    const specFileContent = `
import { TestBed } from '@angular/core/testing';
import { ${serviceClassName}Service } from './${serviceName}.service';

describe('${serviceClassName}Service', () => {
  let service: ${serviceClassName}Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(${serviceClassName}Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Add more tests for your service methods here
});
`;

    fs.writeFileSync(specFilePath, specFileContent.trim());
}

function main() {
    const args = process.argv.slice(2);

    if (args.length < 2) {
        console.error('Usage: node angular-script-runner.js generate-component-service component_path service_name');
        process.exit(1);
    }

    const componentPath = args[0];
    const serviceName = args[1];

    if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(serviceName)) {
        console.error(
            'Invalid service name. The service name must start with a letter and can only contain letters, numbers, hyphens, and underscores.'
        );
        process.exit(1);
    }

    const srcFolderPath = 'src/app/components';
    const componentFolderPath = path.join(srcFolderPath, componentPath);

    if (!fs.existsSync(componentFolderPath)) {
        console.error(`Component folder not found: ${componentFolderPath}`);
        process.exit(1);
    }

    const serviceFolderPath = path.join(componentFolderPath, 'services');
    createFolderIfNotExist(serviceFolderPath);
    createServiceFile(serviceFolderPath, serviceName);

    console.log(`Service created successfully in ${path.join(serviceFolderPath, serviceName)}.service.ts`);
    console.log(`Test file created successfully in ${path.join(serviceFolderPath, serviceName)}.service.spec.ts`);
}

main();
