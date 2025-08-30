import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.page.html',
  styleUrls: ['./user-page.page.scss'],
})
export class UserPagePage implements OnInit {

  constructor(public auth: AuthService) {}

  ngOnInit() {}

  onLogin() {
  window.location.href = this.auth.build_login_link();
}

  onLogout() {
    this.auth.logout();
  }
}
