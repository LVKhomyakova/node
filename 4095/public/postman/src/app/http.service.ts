import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

const API = 'http://178.172.195.18:8180';

@Injectable({providedIn: 'root'})
export class HttpService {
  constructor(private _http: HttpClient) {}

  sendRequest(method: string, url: string, queryParams: any, headers: any, body: any): Observable<any> {
    return this._http.post<any>(`${API}/send`, {data: body, method, url, queryParams, headers}, {
      headers: {
        'Content-type': 'application/json'
      }
    }).pipe(catchError((err) => of(err)));
  }
}
