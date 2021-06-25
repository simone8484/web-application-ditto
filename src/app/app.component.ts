import {  Component } from '@angular/core';
import * as ditto from '@eclipse-ditto/ditto-javascript-client-api_1.0-pre'
import { Thing } from '@eclipse-ditto/ditto-javascript-client-api_1.0-pre/dist/model/things.model';
import { SearchOptions } from '@eclipse-ditto/ditto-javascript-client-api_1.0-pre/dist/options/request.options';
import { DittoDomClient } from './ditto-dom-client';
import { DomHttpBasicAuth, DomWebSocketBasicAuth } from './dom-auth';
import { faCoffee, faMicrochip, faPencilAlt, faFilter, faEraser, faWindowRestore } from '@fortawesome/free-solid-svg-icons';
import { DittoHttpClientV2, HttpThingsHandleV2, HttpMessagesHandle } from '@eclipse-ditto/ditto-javascript-client-api_1.0-pre';
import { ModalComponent } from './modal/modal.component';
import { latLng, tileLayer,Map, icon } from 'leaflet';
import * as L from 'leaflet';
import { ModalFilterComponent } from './modal _filter/modal-filter.component';
import { GlobalService } from './services/global';
import { FilesService } from './services/files.services';
import { environment } from '../environments/environment';
import { interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

"use strict";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  messaggeHandle: HttpMessagesHandle;
  map: any;
  showMap = false;
  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 15,
    center: latLng(37.5013, 15.0742)
  };
  keys = ["** namespace **"];
  title = 'my-app';
  faCoffee = faCoffee;
  faMicrochip = faMicrochip;
  faPencilAlt = faPencilAlt;
  faFilter = faFilter;
  faEraser = faEraser;
  source: any;
  filterActivate =false

  settings = {
    selectMode: 'multi',
    mode: 'external',
    pager: {
      perPage: 10,
      display: true,
    },
    actions: {
      columnTitle: '',
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i> Nuovo',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      _thingId: {
        title: 'Id',
        type: 'string',
        filter: true,
      },
    },
    noDataMessage: "Nessun sensore presente",
  };

  domain = environment.urlDomainDitto;
  username = environment.username;
  password = environment.password;
  client: DittoHttpClientV2;
  thingsHandle: HttpThingsHandleV2;
  search: ditto.SearchHandle;

  cooodinateArray = []
  thingSelected = [];
  sectionFirmware = false;
  fileToUpload: File;

  icon = {
    icon: L.icon({
      iconSize: [ 25, 41 ],
      iconAnchor: [ 13, 0 ],
      // specify the path here
      iconUrl: './assets/marker-icon.png',
      shadowUrl: './assets/marker-shadow.png'
   })
  };

  constructor(
    public modalEditThing:ModalComponent,
    public modalFilter:ModalFilterComponent,
    public globalService: GlobalService,
    public fileService: FilesService
    ){
  }

  ngOnInit() {

    this.globalService.getArrayFilter().subscribe(res =>{
      if(res !== null){
        this.applyFliter(res);
        this.filterActivate = true;
      }
    })
    this.settings.columns['_attributes.model'] = {
      title: 'Modello',
      filter: true,
      valuePrepareFunction: (cell, row) => {
        if(row._attributes != undefined && row._attributes.model !== undefined){
          return row._attributes.model;
        }else{
          return "modello sconosciuto"
        }
      }
    }

    this.settings.columns['_attributes.manufacturer'] = {
      title: 'Produttore',
      filter: true,
      valuePrepareFunction: (cell, row) => {
        if(row._attributes != undefined && row._attributes.manufacturer !== undefined){
          return row._attributes.manufacturer;
        }else{
          return "produttore sconosciuto"
        }
      }
    }

    this.settings.columns['_attributes.location'] = {
      title: 'Location',
      filter: true,
      valuePrepareFunction: (cell, row) => {
        if(row._attributes != undefined && row._attributes.location !== undefined){
          return row._attributes.location;
        }else{
          return "posizione sconosciuta"
        }
      }
    }

    this.settings.columns['_attributes.owner'] = {
      title: 'Proprietario',
      filter: true,
      valuePrepareFunction: (cell, row) => {
        if(row._attributes != undefined && row._attributes.owner !== undefined){
          return row._attributes.owner;
        }else{
          return "proprietario sconosciuto"
        }
      }
    }

    this.settings.columns['_attributes.status'] = {
      title: 'Stato',
      filter: false,
      type: "html",
      valuePrepareFunction: (cell, row) => {
        if(row._attributes.status !== undefined){
          console.log("sdsd")
          var status = row._attributes.status['status'];
          var lastUpdate = row._attributes.status['lastUpdate'];
          var differenza = Date.now() - lastUpdate;
          if(status === "start" && differenza < 10000 ){
            return '<div class="circleStart"></div>';
          }else{
            return '<div class="circleStop"></div>';
          }
        }else{
          return "stato sconosciuto"
        }
      }
    }


    this.client = DittoDomClient.newHttpClient()
                .withoutTls()
                .withDomain(this.domain)
                .withAuthProvider(DomHttpBasicAuth.newInstance(this.username, this.password))
                .apiVersion2()
                .build();


    this.thingsHandle = this.client.getThingsHandle();
    this.search = this.client.getSearchHandle();
    this.loadData();


  //  const searchOption = SearchOptions.getInstance();
    const searchOption1 = SearchOptions.getInstance();

/*     searchOption.withFilter("eq(attributes/model,\"Aspirapolvere\")");
     search.search(searchOption).then(res=>{
     // console.log(res);
    });  */

  /*   searchOption1.withNamespaces("?namespaces=org.eclipse.ditto").withFields("?fields=attributes(model,location)");
    search.search(searchOption).then(res=>{
      console.log(res);
    }) */

 // searchOption1.withNamespaces("?namespaces=org.eclipse.ditto");

   // search.count();

    const thing = new Thing('org.eclipse.ditto:macchinadelcaffe');
   //thingsHandle.postThing(thing)
  //  .then(result => console.log(`Finished putting thing with result: ${JSON.stringify(result)}`));



  const message = this.client.getMessagesHandle();
 /*        message.messageToThing('org.eclipse.ditto:macchinadelcaffe',"preparaCaffe","mesaggio Payload").then(res=>{

  }) */


  // sender.buildInstance().sendMessage(2);
   const clientWebSoket = DittoDomClient.newWebSocketClient()
        .withoutTls()
        .withDomain(this.domain)
        .withAuthProvider(DomWebSocketBasicAuth.newInstance(this.username, this.password))
        .apiVersion2()
        .withBuffer(350)
        .liveChannel()
    //    .withCustomMessagesHandle("ddd")
        .build();

     const mo = clientWebSoket.getMessagesHandle();
     const ccc = clientWebSoket.getCommandsHandle();
     mo.requestMessages().then(res=>{
       mo.subscribeToAllMessages(res=>{
       //  console.log("messaggio arrivò"+res);
        // ccc.
       })
     })
     //   const sender  = new WebSocketRequestSenderFactory(2,Channel.live);
     //   console.log(clientWebSoket);

     const bo = clientWebSoket.getEventsHandle();
     const co = clientWebSoket.getThingsHandle();




   /*   co.getThing("org.eclipse.ditto:smartcoffee").then(thing=>{
      console.log(thing);
      var param = JSON.stringify({cups: 1,strength: 0.8,amount: 230,captcha: 'ditto'});
     /*  var message = client.getMessagesHandle().messageToThing("org.eclipse.ditto:smartcoffee","makeCoffee",param,"application/json;").then(
        ss=>{console.log(ss);}
      )
     })   })
 */

     bo.requestEvents().then(res=>{

      var v = bo.checkEvents();
      console.log(v);


      bo.subscribeToThing("org.eclipse.ditto:smartcoffee",(res1)=>{
        console.log("ho ricevuto un evento", res1)
        console.log(res);
      });

      var c = bo.subscribeToAllEvents((res3)=>{
        console.log(res3);
        console.log("è successo qualcosa!");
      });


    })
  }

  deleteRecord(e){
    this.thingsHandle.deleteThing(e.data._thingId).then(result => {
      if(result.status == 204){
        this.loadData();
        window.alert("elemento cancellato con successo");
      }else{
        window.alert("errore durante la cancellazione dell'elemento");
      }
    });
  }

  openAddForm(e){

  }

  openEditForm(e){
    this.thingsHandle.getThing(e.data._thingId).then(result => {
      console.log(result);
      this.modalEditThing.open(result);
    });

  }

  loadData(){
    const searchOption1 = SearchOptions.getInstance();

  //  searchOption1.withFilter("and(eq(attributes/model,\"Speaking coffee machine\"),eq(attributes/location,\"Catania, Via Androne\"))");
 //   searchOption1.withFilter("eq(attributes/location,\"Catania, Via Androne\")");
 interval(5000)
    .pipe(startWith(0), switchMap(() => this.search.search(searchOption1))).subscribe
    (res=>{
      this.source = res.items;
      this.makeThingMarkers();
    })
  }
  onMapReady(map: L.Map) {
    this.map = map;
 }

 onTabChanged(e){
   if(e.index === 1){
    setTimeout(() => {
    this.map.invalidateSize();
  }, 0);
   }
 }

 makeThingMarkers(): void {
     this.source.forEach(element => {
      const lon = element.features.features.gps.properties.location.latitude;
      const lat = element.features.features.gps.properties.location.longitude;
      const marker = L.marker([lat, lon],this.icon).addTo(this.map);
      marker.bindPopup(this.makeThingPopup(element.attributes))
    //  marker.addTo(this.map);
     });
}

makeThingPopup(data: any): string {
    return `` +
      `<div>Proprietario: ${ data.owner }</div>` +
      `<div>SN: ${ data.serialno }</div>` +
      `<div>Modello:: ${ data.model }</div>`
  }

  openModalFilter(){
    this.keys = ["** namespace **"];
    this.getKeys(this.source[0]);
    this.modalFilter.open(this.keys);
  }

  getKeys(data, k = '') {
    for (var i in data) {
      var rest = k.length ? '/' + i : i

      if (typeof data[i] == 'object') {
        if (!Array.isArray(data[i])) {
          this.getKeys(data[i], k + rest)
        }
      } else this.keys.push(k + rest)
    }
  }

  applyFliter(filters){
    var queryString = "";
    if(filters.length > 1 && filters[1].operation === "AND"){
      queryString = "and("
    }else if(filters.length > 1 && filters[1].operation === "OR"){
      queryString = "or("
    }

    var query = ""
    filters.forEach(element => {
      if(element.operation !== "AND" && element.operation !== "OR" ){
        if(element.field.charAt(0) === "_"){
          element.field = element.field.slice(1)
        }
        query += element.operation+"("+element.field+",\""+element.value+"\")"
        if(filters.length >1)
        query += ","
      }
    });

    if(filters.length >1){
      query = query.slice(0, -1);
      queryString += query + ")";
    }else{
      queryString = query;
    }

    const searchOption1 = SearchOptions.getInstance();
    searchOption1.withFilter(queryString);
    this.search.search(searchOption1).then(res=>{
      this.source = res.items;
      this.makeThingMarkers();
      this.getKeys(this.source[0]);
      console.log(this.keys)
    })
  }

  resetFilter(){
    this.globalService.setArrayFilter(null);
    this.filterActivate = false;
    this.loadData();
  }

  onUserRowSelect(event){
    console.log(event);
    this.thingSelected = event.selected;
  }

  openAddFirmware(){
    if(this.sectionFirmware === false){
      this.sectionFirmware = true;
    }else{
      this.sectionFirmware = false;
    }

  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  uploadFile() {
    if(this.thingSelected.length === 0){
      window.alert("selezionare almeno un oggetto da aggiornare");
      return;
    }

    if(!this.fileToUpload){
      window.alert("selezionare il file");
      return;
    }
    const formData: FormData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);

    this.thingSelected.forEach(element => {
      this.fileService.add(formData, element._thingId).subscribe(res=>{
        window.alert("file caricato con successo per il thing con id " +  element._thingId);
      });
    });
  }


}
