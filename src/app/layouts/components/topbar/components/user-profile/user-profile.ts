import { Component, inject, OnInit } from '@angular/core'
import {
  NgbDropdown,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap'
import { userDropdownItems, UserDropdownItemType } from '@layouts/components/data'
import { Router, RouterLink } from '@angular/router'
import { NgIcon } from '@ng-icons/core'
import { AuthService } from '@core/services/auth'
import { toTitleCase } from '@/app/utils/string-utils'
import { UserStorageService } from '@core/services/user-storage'

@Component({
  selector: 'app-user-profile-topbar',
  imports: [
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle,
    RouterLink,
    NgIcon,
  ],
  templateUrl: './user-profile.html',
})
export class UserProfile implements OnInit{
  private router = inject(Router)
  private authService = inject(AuthService)
  private userStorageService = inject(UserStorageService)

  menuItems:UserDropdownItemType[] = {
    ...userDropdownItems
  }

  ngOnInit(): void {

    let usuario = this.userStorageService.getUsuario()
    if (usuario) {
      this.menuItems = [
        {
          label: `${toTitleCase(usuario.nombre)} ${toTitleCase(usuario.apellido)}`,
          isHeader: true,
        },
        ...userDropdownItems.map(item =>
          item.label === 'Perfil'
            ? { ...item, url: `/usuario/perfil/${usuario.id}` }
            : item
        )
      ]
    }

  }

  handleEvent(event: string | undefined) {
  if (!event) return;

  switch (event) {
    case 'logout':
      this.logout();
      break;
    // podés agregar más eventos acá
    default:
      console.warn('Evento no manejado:', event);
  }
}


  logout(){
    this.authService.logout();
    this.router.navigateByUrl('/login')
  }
}
