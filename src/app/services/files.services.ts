import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';



@Injectable()
export class FilesService {

  private readonly apiController: string = 'files';
  private readonly paramUrl: string []= ['upload','download'];
  public url = environment.urlDomainDitto;
  public username = environment.username;
  public password = environment.password;
  public stringAutentication;

  constructor(private api: HttpClient) {
    this.stringAutentication = this.username + ":" +this.password;
  }



  add(formData: FormData, thingId: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Basic ' + btoa(this.stringAutentication)
      })
    }
    //var t = "org.eclipse.ditto:smartcoffee";
    // return this.api.post(this.apiController, item);
    return this.api.post("http://"+this.url+"/api/2/things/"+thingId+"/inbox/messages/fileUpload", formData,httpOptions);
  }


}
