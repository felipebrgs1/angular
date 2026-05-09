import { Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
      {{ label() }}
    </span>
  `,
})
export class BadgeComponent {
  readonly label = input.required<string>();
}
