import { Component, ViewEncapsulation } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContentComponent } from './modal_content.component';
import { ConfirmState } from './modal_state.component';

@Component({
  selector: 'app-modal',
  template: '',
  providers: [NgbModalConfig, NgbModal],
})
export class ModalComponent {
  confirmed: boolean;

  constructor(private modalService: NgbModal, private state: ConfirmState) { }

  open(message, flag= false) {
    /*
      Sposto il render dell'oggetto al passo successivo alla creazione.
      Il timeout è necessario per evitare che il figlio sia generato prima del padre con valore diverso che provoca un errore js quando l'oggetto viene creato prima
      del corpo principale.
    */
    setTimeout(() => {
      const modalRef = this.modalService.open(ModalContentComponent, {
        windowClass: 'error-modal'
      });
      modalRef.componentInstance.thing = message;
      modalRef.componentInstance.flag = flag;
    });
  }

  confirm(message): Promise<any> {
    this.state.modal = this.modalService.open(ModalContentComponent);
    this.state.modal.componentInstance.thing = message;
    this.state.modal.componentInstance.rowsMessage = this.state.modal.componentInstance.thing.split('<br>');
    this.state.modal.componentInstance.confirmed = true;
    return this.state.modal.result;
  }
}
