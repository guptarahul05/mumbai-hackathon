import { Injectable } from "@angular/core";
import { Http,Headers,Response } from "@angular/http";
import 'rxjs/Rx'

@Injectable()
export class AppService{
serverAddress:string='http://192.168.137.158:5000/';
    constructor(private http:Http){}

    getData(body:any,testType:string){
        console.log(this.serverAddress+testType);
        console.log(body);
       
        const headers = new Headers({'Content-Type':'application/json'});
        return this.http.post(this.serverAddress+testType,body,{headers:headers})
        .map(
            (response:Response)=>{const data = response.json();
            return data;}
        );
    }
    getData1(body:any,testType:string){
        console.log("hello");
        const headers = new Headers({'Content-Type':'application/json'});
        return this.http.post(this.serverAddress+testType,body,{headers:headers});
        
    }
}