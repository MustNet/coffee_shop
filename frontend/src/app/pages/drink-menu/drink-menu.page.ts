import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DrinksService, Drink } from 'src/app/services/drinks.service';
import { AuthService } from 'src/app/services/auth.service';
import { DrinkFormComponent } from './drink-form/drink-form.component';

@Component({
  selector: 'app-drink-menu',
  templateUrl: './drink-menu.page.html',
  styleUrls: ['./drink-menu.page.scss'],
})
export class DrinkMenuPage implements OnInit {
  drinks: Drink[] = [];
  loading = false;
  errorMsg = '';

  constructor(
    private drinksSvc: DrinksService,
    public auth: AuthService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.loadShort(); // öffentliche Liste
  }

  loadShort() {
    this.loading = true;
    this.errorMsg = '';
    this.drinksSvc.getDrinks().subscribe(
      (res: any) => {
        this.drinks = (res && res.drinks) ? res.drinks : [];
        this.loading = false;
      },
      (err: any) => {
        this.errorMsg = (err && err.error && err.error.message) ? err.error.message : 'Load failed';
        this.loading = false;
      }
    );
  }

  loadDetailIfAllowed() {
    if (!this.auth.can('get:drinks-detail')) { return; }
    this.loading = true;
    this.errorMsg = '';
    this.drinksSvc.getDrinksDetail().subscribe(
      (res: any) => {
        this.drinks = (res && res.drinks) ? res.drinks : [];
        this.loading = false;
      },
      (err: any) => {
        this.errorMsg = (err && err.error && err.error.message) ? err.error.message : 'Load details failed';
        this.loading = false;
      }
    );
  }

  openNewDrinkModal() {
    if (!this.auth.can('post:drinks')) { return; }
    this.modalCtrl.create({
      component: DrinkFormComponent,
      componentProps: { isNew: true }
    }).then(modal => {
      modal.onDidDismiss().then(() => this.loadShort());
      modal.present();
    });
  }

  openEditDrinkModal(drink: Drink) {
    if (!this.auth.can('patch:drinks')) { return; }
    this.modalCtrl.create({
      component: DrinkFormComponent,
      componentProps: { isNew: false, drink: drink }
    }).then(modal => {
      modal.onDidDismiss().then(() => this.loadShort());
      modal.present();
    });
  }

  deleteDrink(id: number) {
    if (!this.auth.can('delete:drinks')) { return; }
    this.drinksSvc.deleteDrink(id).subscribe(
      () => this.loadShort(),
      (err: any) => {
        this.errorMsg = (err && err.error && err.error.message) ? err.error.message : 'Delete failed';
      }
    );
  }
}
