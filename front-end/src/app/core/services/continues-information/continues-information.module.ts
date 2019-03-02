import { HttpClientModule } from '@angular/common/http';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';
import { ModuleWithProviders, NgModule } from '@angular/core';

@NgModule({
    imports: [
        HttpClientModule
    ],
    declarations: [],
    providers: [],
    exports: []
})

export class ContinuesInformationModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ContinuesInformationModule,
            providers: [
                ContinuesInformationService
            ]
        };
    }
}
