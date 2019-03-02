import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';
import { Infraction, InfractionContext, InfractModel } from 'shared/components/infraction/infraction.model';
import { InfractionLevel } from '../../../pages/admin/sub-pages/moderation/infraction-levels/infraction-level.model';
import { TimeHelper } from 'shared/helpers/time.helper';

@Component({
    selector: 'app-infraction',
    templateUrl: 'infraction.component.html',
    styleUrls: ['infraction.component.css']
})
export class InfractionComponent extends InnerDialogComponent {
    private _data: InfractionContext;

    infractionLevelId = 0;
    reason = '';

    setData(data: InfractionContext): void {
        this._data = data;
    }

    getData(): InfractModel {
        return new InfractModel({
            infractionLevelId: this.infractionLevelId,
            reason: this.reason,
            userId: this._data.user.userId
        });
    }

    getTime(time: number): string {
        return TimeHelper.getTime(time);
    }

    get levels(): Array<InfractionLevel> {
        return this._data ? this._data.levels : [];
    }

    get history(): Array<Infraction> {
        return this._data ? this._data.history : [];
    }
}
