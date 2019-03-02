import { Component, HostBinding, Input } from '@angular/core';
import { Notice } from 'shared/components/notice/notice.model';

@Component({
    selector: 'app-notice',
    templateUrl: 'notice.component.html',
    styleUrls: ['notice.component.css']
})
export class NoticeComponent {
    private _notice: Notice = new Notice();

    @HostBinding('style.background-image') backgroundImage;
    @HostBinding('style.background-color') backgroundColor;
    @HostBinding('style.margin-bottom') marginBottom;

    @Input()
    set notice(notice: Notice) {
        this._notice = notice || new Notice();
        this.backgroundImage = this.getBackgroundImage();
        this.backgroundColor = this._notice.backgroundColor;
    }

    @Input()
    set configuring(val: boolean) {
        this.marginBottom = val ? '0rem' : '1rem';
    }

    get title(): string {
        return this._notice.title;
    }

    get text(): string {
        return this._notice.text;
    }

    private getBackgroundImage() {
        return this._notice.backgroundImage ?
            `url(${this._notice.backgroundImage})` :
            `url(/rest/resources/images/notices/${this._notice.noticeId}.gif)`;
    }
}
