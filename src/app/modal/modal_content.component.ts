import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DefaultHttpMessagesHandle, DittoHttpClientV2, HttpMessagesHandle, HttpThingsHandleV2 } from '@eclipse-ditto/ditto-javascript-client-api_1.0-pre';
import { DittoDomClient } from '../ditto-dom-client';
import { DomHttpBasicAuth } from '../dom-auth';
import { Feature, Features, Thing } from '@eclipse-ditto/ditto-javascript-client-api_1.0-pre/dist/model/things.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {FormlyFieldConfig} from '@ngx-formly/core';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-modal-content',
  templateUrl: './modal-content.component.html',
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
export class ModalContentComponent {
  @Input() thing;
  @Input() flag;

  public confirmed: boolean;

  public rowsMessage: string;

  public abilitaModifiche = false;
  public modificaLabel = "Modifica Thing";

  faPlay = faPlay;
  faStop = faStop;

  domain = environment.urlDomainDitto;
  username = environment.username;
  password = environment.password;
  client: DittoHttpClientV2;
  thingsHandle: HttpThingsHandleV2;
  messaggeHandle: HttpMessagesHandle;
  editThingForm: FormGroup;
  form = new FormGroup({});
  model = { email: 'email@gmail.com' };
  fields: FormlyFieldConfig[];
  comandi = [];
  brokerSelected = []
  mqttStatus = "stop";

  //configurazione spinner
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;

  pendingModify = false;


  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
   // this.brokerSelected.push(this.brokers[0]);
    this.initEditThingForm();
    this.client = DittoDomClient.newHttpClient()
      .withoutTls()
      .withDomain(this.domain)
      .withAuthProvider(DomHttpBasicAuth.newInstance(this.username, this.password))
      .apiVersion2()
      .build();

      this.thingsHandle = this.client.getThingsHandle();
      this.messaggeHandle = this.client.getMessagesHandle();

      this.loadModel();
      console.log(this.thing.attributes.mqttConfiguration.frequencyUpdate);
      this.fields = [this.thing.attributes.formly.features];
      setTimeout(() => {
        this.selezionaComandi();
      }, 100);

      if(this.thing.attributes.mqttConfiguration.pid !=="-1"){
        this.mqttStatus = "start";
      };

      this.editThingForm.get("frequencyMqtt").valueChanges.subscribe(x => {
        if(x !==  this.thing.attributes.mqttConfiguration.frequencyUpdate){
          console.log("valore cambiato");
          this.pendingModify = true;
        }else{
          console.log("valore non cambiato");
        }
      });

      this.editThingForm.get("urlMqtt").valueChanges.subscribe(x => {
        if(x !==  this.thing.attributes.mqttConfiguration.urlBroker){
          console.log("valore cambiato");
          this.pendingModify = true;
        }else{
          console.log("valore non cambiato");
        }
      });
  }

  initEditThingForm() {
    this.editThingForm = this.fb.group({
      updatedThing: this.fb.control(JSON.stringify(this.thing,undefined, 4)),
      frequencyMqtt: this.fb.control(this.thing.attributes.mqttConfiguration.frequencyUpdate),
      urlMqtt:  this.fb.control(this.thing.attributes.mqttConfiguration.urlBroker),
      pid:  this.fb.control(this.thing.attributes.mqttConfiguration.pid)
    });

    this.editThingForm.get('pid').disable();
  }

  enabledModify(){
    if(this.abilitaModifiche){
      this.abilitaModifiche = false;
      this.modificaLabel = "Modifica Thing"
    }else{
      this.abilitaModifiche = true;
      this.modificaLabel = "Nascondi"
    }
  }

  sendCommand(command){
    var contentType;
    if(command === "mqttStart"){
      if(this.pendingModify){
        window.alert("Attenzione, le modifiche apportate alla configurazione mqtt"
        + " non sono state salvate e quindi non influenzeranno la corrente esecuzione")
      }
      this.mqttStatus = "ready";
      contentType = {
        'command':"start",
      }
      this.messaggeHandle.messageToThing(this.thing._thingId,command,JSON.stringify(contentType)).then(res=>{
        if(res){
          window.alert("La pubblicazione mqtt è stata avviata");
          this.thingsHandle.getThing(this.thing._thingId).then(result =>{
            this.thing =  result;
            this.editThingForm.patchValue({
              pid: this.thing.attributes.mqttConfiguration.pid,
            });
          })
          this.mqttStatus = "start";
          this.editThingForm.get('frequencyMqtt').disable();
          this.editThingForm.get('urlMqtt').disable();
        }
      });
    }else if(command === "mqttUpdate"){
      contentType = {
        'frequencyUpdate':this.editThingForm.value.frequencyMqtt,
        'urlBroker':this.editThingForm.value.urlMqtt,
      }
      this.pendingModify = false;
      this.messaggeHandle.messageToThing(this.thing._thingId,command,JSON.stringify(contentType)).then(res=>{
        if(res){
          window.alert("I parametri mqtt sono stati aggiornati");
          this.thingsHandle.getThing(this.thing._thingId).then(result =>{
            this.thing =  result;
          })
        }
      });
    }else if(command === "mqttStop"){
      this.mqttStatus = "ready";
      contentType = {
        'command':"stop",
      }
      this.messaggeHandle.messageToThing(this.thing._thingId,command,JSON.stringify(contentType)).then(res=>{
        if(res){
          window.alert("La pubblicazione mqtt è stata interrotta");
          this.thingsHandle.getThing(this.thing._thingId).then(result =>{
            this.thing =  result;
            this.editThingForm.patchValue({
              pid: this.thing.attributes.mqttConfiguration.pid,
            });
          });
          this.mqttStatus = "stop";
          setTimeout(() => {
            this.editThingForm.get('frequencyMqtt').enable();
            this.editThingForm.get('urlMqtt').enable();},
          0);
        }
      });
    }else{
      contentType = {
        'cups':1
      }
      this.messaggeHandle.messageToThing(this.thing._thingId,"makeCoffee",JSON.stringify(contentType)).then(res=>{
        if(res){
          window.alert("caffè preparato con successo");
          this.thingsHandle.getThing(this.thing._thingId).then(result =>{
            this.thing =  result;
          })
        }
      });
    }
  }

  saveModify(){
    var thingUpdatetd = JSON.parse(this.editThingForm.value.updatedThing);

    console.log(thingUpdatetd._features)
    thingUpdatetd._features.features.forEach(element => {
      const f = new Feature(element._id,element._properties);
      console.log(f);
    })

    const thing = new Thing(thingUpdatetd._thingId,thingUpdatetd._policyId,thingUpdatetd._attributes,this.thing._features);
    this.thingsHandle.putThing(thing).then(result => {
      console.log(result);
    });
  }

  onSubmit(model) {
    console.log(this.model);
  }

  loadModel(){
    this.thing.attributes.formly.features.fieldGroup.forEach(element => {
        var s = element.value.replaceAll("/",".");
        this.model[element.key] = this.getValue(this.thing.features.features,s);
      });
    console.log(this.thing.features.features)
  }

  getValue(o,s){
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
  }

  selezionaComandi(){
    for (const [key, value] of Object.entries(this.thing.features.features)) {
      console.log( value["_properties"]);
      if(value["_properties"]["commands"]){
        value["_properties"]["commands"].forEach(element2 => {
          var obj = {name: null, action: null};
          obj.name = element2.label;
          obj.action = element2.action;
          this.comandi.push(obj);
        });
      }
    };
  }
}
