import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSignupUrl = "http://localhost:5000/api/users/signup";
  private userLoginUrl = "http://localhost:5000/api/users/login";
  private isAdminUrl = "http://localhost:5000/api/users/is-admin";
  private getAllUsersUrl = "http://localhost:5000/api/users";


  private _loginObservable : BehaviorSubject<Object>;

  constructor(private http : HttpClient) {
    this._loginObservable = new BehaviorSubject({});

   }

   public get loginObservable(){
    return this._loginObservable
  }

  getToken(){
    return localStorage.getItem('token') ? localStorage.getItem('token') as string : "";
  }

  private saveTokenToLocalStorage(token : string){
    localStorage.setItem('token' , "Bearer "+ token)
  }

  logout(){
    localStorage.removeItem('token')
    this._loginObservable.next({})
  }

  isLoggedIn(){
    if(this.getToken() != ''){
      return true;
    }

    return false
  }

  isAdmin(){
   
    let headers = new HttpHeaders({
      'authorization' : this.getToken()
    })
    return this.http.get(this.isAdminUrl, {headers}).pipe(
      map(result=>{
        return <boolean>result
      })
    )
  }

  // get All 
  getAll(){
    let headers = new HttpHeaders({
      'authorization' : this.getToken()
    })
  
    return this.http.get(this.getAllUsersUrl, {headers})
    .pipe(
      map((result : {users : User[]})=>{
         return result.users
      })
    )
 }

  signup(user : User){
    return this.http.post(this.userSignupUrl , user) //will return an observable of result
    .pipe(
      map(result=>{
         return <{message : string}>result
      })
    )
 }

 login(credentials : {email : string , password : string}){
  return this.http.post(this.userLoginUrl , credentials)
  .pipe(
    map((result : loginResponce)=>{
      this.saveTokenToLocalStorage(result.token)
      this._loginObservable.next({});
      return result
    })
  )
}

}

interface loginResponce{
  token : string , 
  message : string
}


