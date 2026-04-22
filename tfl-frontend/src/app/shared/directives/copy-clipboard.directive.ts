import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appCopyClipboard]',
  standalone: true
})
export class CopyClipboardDirective {
  @Input({ required: true }) appCopyClipboard!: string;

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    event.stopPropagation();
    navigator.clipboard.writeText(this.appCopyClipboard).catch(() => {});
  }
}
