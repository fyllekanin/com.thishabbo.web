import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';
import { SafeHtmlPipe } from 'shared/pipes/safe-html/safe-html.pipe';

describe('SafeHtmlPipe', () => {

    class Sanitizer implements DomSanitizer {
        sanitize(): string { return ''; }
        bypassSecurityTrustHtml(): SafeHtml { return 'html'; }
        bypassSecurityTrustStyle(): SafeStyle { return ''; }
        bypassSecurityTrustScript(): SafeScript { return ''; }
        bypassSecurityTrustUrl(): SafeUrl { return ''; }
        bypassSecurityTrustResourceUrl(): SafeResourceUrl { return ''; }
    }

    let pipe: SafeHtmlPipe;

    beforeEach(() => {
        pipe = new SafeHtmlPipe(new Sanitizer());
    });

    it('transform should sanitize the value for trust html', () => {
        // Given
        const value = 'font-weight: bold;';

        // When
        const result = pipe.transform(value);

        // Then
        expect(result).toBe('html');
    });
});
