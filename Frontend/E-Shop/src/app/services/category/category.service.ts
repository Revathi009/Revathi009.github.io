import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Category } from '../../models/category';
import { UserService } from '../user/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  getUrl = 'http://localhost:5000/api/categories'

  constructor(private http : HttpClient,
    private userService : UserService) { }

    getAllCategories(){
      return this.http.get(this.getUrl)
      .pipe(
        map((result:any)=>{   //map operator is used to convert one form to another form. Here converting the json data into array format
          return <Category[]>result['categories']
        })
      )
    }
  
    saveCategory(data  : {title : string}){
      let headers = new HttpHeaders({
        'authorization' : this.userService.getToken()
      })
      return this.http.post(this.getUrl  , data   , {headers})
      .pipe(map((result : {message : string , category : Category})=>{
        return result.category;
      }))
    }
}
