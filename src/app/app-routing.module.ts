import { RouterModule, Routes } from '@angular/router';
import { DetailRoutingModule } from './detail/detail-routing.module';
import { NgModule } from '@angular/core';
import { PageNotFoundComponent } from './shared/components';

// Test components
import { TestJasmineComponent } from './components/tests-sample/test-jasmine/test-jasmine.component';
import { TestNgRxComponent } from './components/tests-sample/test-ngrx/test-ngrx.component';
import { TestTailwindUiComponent } from './components/tests-sample/test-tailwind-ui/test-tailwind-ui.component';
import { TestPlaywrightComponent } from './components/tests-sample/test-playwright/test-playwright.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    // Add routes for the test components
    {
        path: 'tests',
        children: [
            {
                path: 'jasmine',
                component: TestJasmineComponent
            },
            {
                path: 'ngrx',
                component: TestNgRxComponent
            },
            {
                path: 'tailwind-ui',
                component: TestTailwindUiComponent
            },
            {
                path: 'playwright',
                component: TestPlaywrightComponent
            }
        ]
    },
    // Other
    {
        path: '**',
        component: PageNotFoundComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            relativeLinkResolution: 'legacy',
            useHash: false
        }),
        DetailRoutingModule
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
