import { SafeStylePipe } from 'shared/pipes/safe-style/safe-style.pipe';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';

describe('SafeStylePipe', () => {

    class Sanitizer implements DomSanitizer {
        sanitize(): string { return ''; }
        bypassSecurityTrustHtml(): SafeHtml { return ''; }
        bypassSecurityTrustStyle(): SafeStyle { return 'test'; }
        bypassSecurityTrustScript(): SafeScript { return ''; }
        bypassSecurityTrustUrl(): SafeUrl { return ''; }
        bypassSecurityTrustResourceUrl(): SafeResourceUrl { return ''; }
    }

    let pipe: SafeStylePipe;

    beforeEach(() => {
        pipe = new SafeStylePipe(new Sanitizer());
    });

    it('transform should sanitize the value for trust style', () => {
        // Given
        const value = 'font-weight: bold;';

        // When
        const result = pipe.transform(value);

        // Then
        expect(result).toBe('test');
    });
});
