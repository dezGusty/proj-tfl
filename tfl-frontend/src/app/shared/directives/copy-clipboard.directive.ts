import { Directive, input } from '@angular/core';

@Directive({
  selector: '[appCopyClipboard]',
  host: { '(click)': 'onClick($event)' },
})
export class CopyClipboardDirective {
  readonly appCopyClipboard = input.required<string>();

  onClick(event: Event) {
    event.stopPropagation();
    navigator.clipboard.writeText(this.appCopyClipboard()).catch(() => {});
  }
}
