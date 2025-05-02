import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {
  BASE_PATH = "/api";


  constructor(private http: HttpClient) { }


  getAll(params: HttpParams): Observable<any>{
    return this.http.get<any>(`${this.BASE_PATH}/password-history`,{params});
  }

  create(form: any):Observable<any>{
    return this.http.post<any>(`${this.BASE_PATH}/generate-password`,form);
  }

  delete(id: any):Observable<any>{
    return this.http.delete<any>(`${this.BASE_PATH}/delete-password/${id}`);
  }

}
