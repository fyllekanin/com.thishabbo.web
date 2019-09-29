import { AutoSave, ForumAutoSave } from '../../pages/forum/forum.model';


export class AutoSaveHelper {
    private static SAVE_TIMEOUT;
    static readonly AUTO_SAVE_PREFIX = 'auto-save-';

    static exists(type: AutoSave, contentId: number): boolean {
        return Boolean(localStorage.getItem(AutoSaveHelper.buildAutoSaveKey(type, contentId)));
    }

    static save(autoSave: ForumAutoSave): void {
        clearTimeout(AutoSaveHelper.SAVE_TIMEOUT);
        AutoSaveHelper.SAVE_TIMEOUT = setTimeout(() => {
            autoSave.expiresAt = (new Date().getTime() / 1000) + 3600;
            localStorage.setItem(AutoSaveHelper.buildAutoSaveKey(autoSave.type, autoSave.contentId), JSON.stringify(autoSave));
        }, 200);
    }

    static get(type: AutoSave, contentId: number): ForumAutoSave {
        const json = localStorage.getItem(AutoSaveHelper.buildAutoSaveKey(type, contentId));
        return json ? JSON.parse(json) : null;
    }

    static remove(type: AutoSave, contentId: number): void {
        localStorage.removeItem(AutoSaveHelper.buildAutoSaveKey(type, contentId));
    }

    private static buildAutoSaveKey(type: AutoSave, contentId: number): string {
        const str = AutoSaveHelper.AUTO_SAVE_PREFIX + '{type}-{contentId}';
        return str.replace('{type}', String(type)).replace('{contentId}', String(contentId));
    }
}
