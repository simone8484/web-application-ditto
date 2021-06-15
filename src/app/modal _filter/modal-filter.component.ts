import { Component, ViewEncapsulation } from '@angular/core';
import { NgbModalConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalFilterContentComponent } from './modal-filter_content.component';

@Component({
  selector: 'app-modal',
  template: '',
  providers: [NgbModalConfig, NgbModal],
})
export class ModalFilterComponent {
  confirmed: boolean;

  constructor(private modalService: NgbModal) { }

  open(message, flag= false) {
    /*
      Sposto il render dell'oggetto al passo successivo alla creazione.
      Il timeout è necessario per evitare che il figlio sia generato prima del padre con valore diverso che provoca un errore js quando l'oggetto viene creato prima
      del corpo principale.
    */
    setTimeout(() => {
      const modalRef = this.modalService.open(ModalFilterContentComponent, {
        windowClass: 'error-modal'
      });
      modalRef.componentInstance.arrayFields = message;
      modalRef.componentInstance.flag = flag;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
