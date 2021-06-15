import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { GlobalService } from '../services/global';

@Component({
  selector: 'app-modal-filter-content',
  templateUrl: './modal-filter-content.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .error-modal .modal-content {
      min-height: 175px!important;
    }
    .error-modal .modal-dialog {
      margin-top: 100px!important;
    }
  `]

})
export class ModalFilterContentComponent {
  @Input() arrayFields;
  @Input() flag;

  public confirmed: boolean;
  faWindowClose = faWindowClose;

  operations = [
  {
    "label": "uguale a",
    "action": "eq"
  },
  {
    "label": "diverso da",
    "action": "ne"
  },
  {
    "label": ">",
    "action": "gt"
  },
  {
    "label": ">=",
    "action": "lt"
  },
  {
    "label": "<",
    "action": "le"
  },
  {
    "label": "<=",
    "action": "in"
  },
  {
    "label": "inizia per",
    "action": "like*"
  },
  {
    "label": "finisce per",
    "action": "*like"
  },
  {
    "label": "contiene",
    "action": "*like*"
  },
];

logicObj = {
  "field": null,
  "operation": null,
  "value": null
}

searchThingForm: FormGroup;
selectedFilter = [];

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    public globalService: GlobalService
  ) { }

  ngOnInit() {
   this.initEditThingForm()
   this.onValueChanges();
  }

  initEditThingForm() {
    this.searchThingForm = this.fb.group({
      field: this.fb.control(null, Validators.required),
      operation: this.fb.control(null, Validators.required),
      value:  this.fb.control(null, Validators.required),
      logica: this.fb.control(1)
    });
  }

  addFilter(){

    if(this.selectedFilter.length >= 1){
      this.selectedFilter.push(this.logicObj);
    }

    this.selectedFilter.push(this.searchThingForm.value)

    this.selectedFilter.forEach(element => {
      if(element.operation === "*like*"){
        element.operation = "like";
        element.value = "*"+element.value+"*";
      }
      if(element.operation === "like*"){
        element.operation = "like";
        element.value = element.value+"*";
      }
      if(element.operation === "*like"){
        element.operation = "like";
        element.value = "*"+element.value;
      }
      this.operations.forEach(element1 => {
          if(element.operation === element1.action){
            element.label = element1.label;
          }
      })
    })


      this.selectedFilter.forEach(element => {
        if(this.searchThingForm.value.logica === 1 && (element.operation === null || element.operation === "OR")){
          element.operation = "AND";
          element.label = "AND";
        }else if(this.searchThingForm.value.logica === 2  && (element.operation === null || element.operation === "AND")){
          element.operation = "OR";
          element.label = "OR";
        }
      })

  }

  onValueChanges(): void {
    this.searchThingForm.valueChanges.subscribe(val=>{
      this.selectedFilter.forEach(element => {
        if(this.searchThingForm.value.logica === 1 && (element.operation === null || element.operation === "OR")){
          element.operation = "AND";
          element.label = "AND";
        }else if(this.searchThingForm.value.logica === 2  && (element.operation === null || element.operation === "AND")){
          element.operation = "OR";
          element.label = "OR";
        }
      })
    })
  }

  close(){
    console.log("modal chiusa");
    this.globalService.setArrayFilter(this.selectedFilter)
    this.activeModal.close()
  }


}
