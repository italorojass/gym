import { Component, OnInit } from '@angular/core';
import { MenuSidebarService } from '../../services/menu-sidebar.service';
import * as jwt_decode from "jwt-decode";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  openMenu: boolean = false;
  menu: any = [];
  roleUser = sessionStorage.getItem('rolUser')!;
  ngOnInit(): void {
    this.menu = [
      {
        title: 'Inicio',
        icon: 'fa-home',
        url: '/administrador'
      },
      {
        title: 'Alumnos',
        icon: 'fa-users',
        url: 'alumnos'
      },

    ]

  }
  collapseMenu() {
    this.openMenu = true;
  }

}
