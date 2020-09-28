import { FormControl } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'mw-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {

  @Input() error: string;
  @Input() control: FormControl;
  @Input() message: string;

  constructor() { }

  hasErrors(): boolean {
    return this.control.hasError(this.error) && (this.control.dirty || this.control.touched);
  }
}
