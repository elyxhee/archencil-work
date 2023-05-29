import { InputConfigStartupService } from '~components/canvas/services/input-config-startup.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from './core/core.module';
import { DetailModule } from './detail/detail.module';
import { KtdGridModule } from '@katoid/angular-grid-layout';
import { NgModule } from '@angular/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SharedModule } from './shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { MessageState } from './store/message.reducer';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable } from 'rxjs';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

interface AppState {
    messageState: MessageState;
}

// NgRx imports
import { StoreModule } from '@ngrx/store';
import { messageReducer } from './store/message.reducer';
import { TestNgRxComponent } from './components/tests-sample/test-ngrx/test-ngrx.component';
import { TestJasmineComponent } from './components/tests-sample/test-jasmine/test-jasmine.component';
import { TestTailwindUiComponent } from './components/tests-sample/test-tailwind-ui/test-tailwind-ui.component';
import { TestPlaywrightComponent } from './components/tests-sample/test-playwright/test-playwright.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { ToolsMenuComponent } from './components/canvas/tools-menu/tools-menu.component';
import { BoundingBoxComponent } from './components/canvas/bounding-box/bounding-box.component';
import { QuillModule } from 'ngx-quill';

// Global Tooltip
import { GlobalTooltipDirective } from '~components/global-tooltip/directives/global-tooltip.directive';
import { GlobalTooltipService } from '~components/global-tooltip/services/global-tooltip.service';
import { GlobalTooltipComponent } from './components/global-tooltip/global-tooltip.component';

// eslint-disable-next-line no-unused-vars
class CustomTranslateHttpLoader extends TranslateHttpLoader {
    constructor(http: HttpClient, prefix: string = './assets/i18n/', suffix: string = '.json') {
        super(http, prefix, suffix);
    }

    getTranslation(lang: string): Observable<any> {
        return super.getTranslation(lang);
    }
}

// AoT requires an exported function for factories
const httpLoaderFactory = (http: HttpClient): CustomTranslateHttpLoader => {
    return new CustomTranslateHttpLoader(http, './assets/i18n/', '.json');
};

@NgModule({
    declarations: [
        AppComponent,
        TestNgRxComponent,
        TestJasmineComponent,
        TestTailwindUiComponent,
        TestPlaywrightComponent,
        CanvasComponent,
        ToolsMenuComponent,
        BoundingBoxComponent,
        GlobalTooltipComponent,
        GlobalTooltipDirective
    ],
    imports: [
        BrowserModule,
        SweetAlert2Module.forRoot(),
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        CoreModule,
        EditorModule,
        DragDropModule,
        SharedModule,
        DetailModule,
        AppRoutingModule,
        NgxTippyModule,
        KtdGridModule,
        HighlightModule,
        QuillModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        StoreModule.forRoot<AppState>({ messageState: messageReducer })
    ],
    providers: [
        InputConfigStartupService,
        GlobalTooltipService,
        {
            provide: HIGHLIGHT_OPTIONS,
            useValue: {
                coreLibraryLoader: () => import('highlight.js/lib/core'),
                lineNumbersLoader: () => import('highlightjs-line-numbers.js'), // Optional, only if you want the line numbers
                languages: {
                    typescript: () => import('highlight.js/lib/languages/typescript'),
                    css: () => import('highlight.js/lib/languages/css'),
                    xml: () => import('highlight.js/lib/languages/xml')
                },
                themePath: './assets/css/highlight.js/styles/github.css' // Optional, and useful if you want to change the theme dynamically
            }
        },
        { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
