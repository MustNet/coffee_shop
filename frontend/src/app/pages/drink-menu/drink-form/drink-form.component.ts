// src/app/pages/drink-menu/drink-form/drink-form.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { Drink, DrinksService } from 'src/app/services/drinks.service';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-drink-form',
  templateUrl: './drink-form.component.html',
  styleUrls: ['./drink-form.component.scss'],
})
export class DrinkFormComponent implements OnInit {
  @Input() drink: Drink;
  @Input() isNew: boolean;

  constructor(
    public auth: AuthService,
    private modalCtrl: ModalController,
    private drinkService: DrinksService
  ) {}

  ngOnInit(): void {
    if (this.isNew) {
      this.drink = { title: '', recipe: [] };
      this.addIngredient();
    }
  }

  customTrackBy(index: number, _obj: any): number { return index; }

  addIngredient(i: number = 0): void {
    this.drink.recipe.splice(i + 1, 0, { name: '', color: 'white', parts: 1 });
  }

  removeIngredient(i: number): void {
    this.drink.recipe.splice(i, 1);
  }

  closeModal(): void { this.modalCtrl.dismiss(); }

    // nur die relevanten Stellen
  saveClicked() {
    this.drinkService.saveDrink(this.drink).subscribe({
      next: () => this.closeModal(),
      error: (err) => {
        console.error('saveDrink failed:', err);
        this.closeModal();
      }
    });
  }

  deleteClicked() {
    if (!this.drink.id) { this.closeModal(); return; }
    this.drinkService.deleteDrink(this.drink.id).subscribe({
      next: () => this.closeModal(),
      error: (err) => {
        console.error('deleteDrink failed:', err);
        this.closeModal();
      }
    });
  }
}