import {AfterViewInit, Component} from '@angular/core';
import * as L from 'leaflet';
import { Map } from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit  {
  private map;

  private initMap(): void {
    setTimeout(() => {
    this.map = L.map('mapp', {
      center: [ 39.8282, -98.5795 ],
      zoom: 3
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    
    tiles.addTo(this.map);

  },2000);
  }

  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
  }
  

  onMapReady(map: Map): void {
    setTimeout(() => {map.invalidateSize(true)},1000);
  }
}
