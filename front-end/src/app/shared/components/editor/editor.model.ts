import { ClassHelper, primitive } from 'shared/helpers/class.helper';
import { ButtonColor } from 'shared/directives/button/button.model';

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

export function getEditorSettings (isSlim: boolean, id: string) {
    return {
        id: id,
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
                    '<div class="atitle">{SELTEXT}</div>': '[atitle]{SELTEXT}[/atitle]',
                    '<div class="quote">{SELTEXT}</div>': '[quote]{SELTEXT}[/quote]'
                }
            }
        }
    };
}
