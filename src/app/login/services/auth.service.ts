import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) {}


  HOST = environment.HOST;
  login(req:any) {
    return this.httpClient.post(`${this.HOST}/login`,req);
  }


}
