import { ClassHelper, primitive } from 'shared/helpers/class.helper';
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

    constructor (source: Partial<EditorAction>) {
        ClassHelper.assign(this, source);
    }
}

export function getEditorSettings (emojis: Array<BBcodeModel>, isSlim: boolean) {
    return {
        debug: false,
        minheight: isSlim ? 100 : 150,
        buttons: isSlim ? 'bold,italic,underline' : undefined,
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
                    '<ul>{DATA}</ul>': '[ul]{DATA}[/ul]',
                    '<img src="{URL}" align="right">': '[imgr]{URL}[/imgr]',
                    '<img src="{URL}" align="left">': '[imgl]{URL}[/imgl]',
                    '<details><summary>Spoiler</summary>{SELTEXT}</details>': '[spoiler]{SELTEXT}[/spoiler]',
                    '<div class="atitle">{SELTEXT}</div>': '[atitle]{SELTEXT}[/atitle]'
                }
            }
        },
        smileList: emojis.map(item => {
            return {
                title: item.name,
                img: `<img src="/rest/resources/images/emojis/${item.bbcodeId}.gif" class="sm" />`,
                bbcode: item.pattern
            };
        })
    };
}
