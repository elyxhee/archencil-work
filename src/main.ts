import { APP_CONFIG } from './environments/environment';
import { AppModule } from './app/app.module';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { initializeTippy } from './tippy.config';

if (APP_CONFIG.production) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule, {
        preserveWhitespaces: false
    })
    .catch((err) => console.error(err))
    .finally(() => {
        initializeTippy(); // Initialize Tippy.js globally after bootstrapping the AppModule
    });
