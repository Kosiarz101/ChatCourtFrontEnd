import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from 'src/app/interfaces/entities/category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private endpoint: string = "/category";

  constructor(private httpClient: HttpClient) { }

  public getAll() : Observable<Array<Category>> {
    let url = environment.chatServerUrl;
    return this.httpClient.get<Array<Category>>(url + this.endpoint, {  withCredentials: true });
  }

  public static init(id: string): Category {
    return {
      id: id,
      name: '',
      creationDate: new Date()
    }
  }
}
