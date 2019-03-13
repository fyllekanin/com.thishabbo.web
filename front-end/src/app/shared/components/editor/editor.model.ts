import { ClassHelper } from 'shared/helpers/class.helper';
import { primitive } from 'shared/helpers/class.helper';
import { ButtonColor } from 'shared/directives/button/button.model';
import { BBcodeModel } from '../../../pages/admin/sub-pages/content/bbcodes/bbcode.model';

export class EditorAction {
    @primitive()
    title: string;
    @primitive()
    value?: number;
    @primitive()
    asButton?: boolean;
    buttonColor?: ButtonColor;
    saveCallback?: () => {};

    constructor(source: Partial<EditorAction>) {
        ClassHelper.assign(this, source);
    }
}

export function getEditorSettings(emojis: Array<BBcodeModel>) {
    return {
        debug: false,
        minheight: '150',
        allButtons: {
            quote: {
                transform: {
                    '<div class="quotepost" data-post-id="{POSTID}">{SELTEXT}</div>':
                        '[quotepost={POSTID}]{SELTEXT}[/quotepost]',
                    '<div class="mention-user">{SELTEXT}</div>':
                        '[mention]{SELTEXT}[/mention]',
                    '<div class="mention-group">{SELTEXT}</div>':
                        '[taggroup]{SELTEXT}[/taggroup]',
                    '<ol>{DATA}</ol>': '[ol]{DATA}[/ol]',
                    '<li>{DATA}</li>': '[li]{DATA}[/li]',
                    '<ul>{DATA}</ul>': '[ul]{DATA}[/ul]'
                }
            }
        },
        smileList: emojis.map(item => {
            return {
                title: item.name,
                img:  `<img src="/rest/resources/images/emojis/${item.bbcodeId}.gif" class="sm" />`,
                bbcode: item.pattern
            };
        })
    };
}
