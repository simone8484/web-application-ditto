import { Injectable} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class GlobalService {

    arrayFilter: BehaviorSubject<any>;

    constructor(){
        this.arrayFilter = new BehaviorSubject<any>(null);
    }

    setArrayFilter(arrayFilter) {
        this.arrayFilter.next(arrayFilter);
    }
    
    getArrayFilter(): Observable<any> {
        return this.arrayFilter.asObservable();
    }
    
}