import { Injectable, TemplateRef } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

/**
 * Options passed when opening a confirmation modal
 */
interface ConfirmOptions {
  /**
   * The title of the confirmation modal
   */
  title: string;

  /**
   * The message in the confirmation modal
   */
  message: string;
}

@Injectable()
export class ConfirmState {
  /**
   * The last options passed ConfirmService.confirm()
   */
  options: ConfirmOptions;

  /**
   * The last opened confirmation modal
   */
  modal: NgbModalRef;

  /**
   * The template containing the confirmation modal component
   */
  template: TemplateRef<any>;
}
