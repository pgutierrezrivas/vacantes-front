import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../security/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }

  getRol(): string | null {
    let role: string | null = null;
    this.authService.getRol().subscribe(value => role = value);
    return role;
  }

}