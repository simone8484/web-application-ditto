import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable()
export class FilesService {

  private readonly apiController: string = 'files';
  private readonly paramUrl: string []= ['upload','download'];


  constructor(private api: HttpClient) { }



  add(formData: FormData, thingId: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Basic ' + btoa('ditto:ditto')
      })
    }
    //var t = "org.eclipse.ditto:smartcoffee";
    // return this.api.post(this.apiController, item);
    return this.api.post("http://192.168.1.3:8080/api/2/things/"+thingId+"/inbox/messages/fileUpload", formData,httpOptions);
  }


}
