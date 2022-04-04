import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../user/user.service';
import { map } from 'rxjs/operators';
import { Product } from '../../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  getAllProductUrl = 'http://localhost:5000/api/products'

  constructor(private http: HttpClient,
    private router: Router,
    private userService : UserService) { }

    getAllProducts(params){

      let query = new URLSearchParams();


        if (params['category']) {
          query.append('category', params['category'])
        }

        if (params['min']) {
          query.append('min', params['min'])
        }

        if (params['max']) {
          query.append('max', params['max'])
        }
        console.log(query.toString());
        
      return this.http.get(`${this.getAllProductUrl}?${query.toString()}` ,
        {
          headers : {
            'authorization' : this.userService.getToken()
          }
        })
        .pipe(
          map((result: {count: number, products: Product[]})=>{
            return result.products
          })
        )
    }

  // get producy by ID
  getProductById(id: string) {
    return this.http.get(`${this.getAllProductUrl}/${id}`,
    {
      headers : {
        'authorization' : this.userService.getToken()
      }
    })
      .pipe(
        map((result) => {
          return <Product>result
        })
      )

  }

  // saveing product
  // get producy by ID
  saveProduct(data : FormData) {
    let headers = new HttpHeaders({
      'authorization' : this.userService.getToken()
    })
    return this.http.post(this.getAllProductUrl, data, {headers})
      .pipe(
        map((result : {message : string , product : Product}) => {
          return <Product>result.product
        })
      )

  }


  // update 
  updateProduct(data: any , id: string) {

    let headers = new HttpHeaders({
      'authorization' : this.userService.getToken()
    })
    
    return this.http.patch(this.getAllProductUrl + '/' + id, data, {headers})
  }
}
