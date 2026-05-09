import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const cpfValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value?.replace(/\D/g, '');
  if (!value || value.length !== 11) return { cpf: true };
  if (/^(\d)\1{10}$/.test(value)) return { cpf: true };

  const calc = (digits: string, factors: number[]) =>
    digits.split('').reduce((sum, d, i) => sum + +d * factors[i], 0);

  const d1 = ((calc(value.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]) * 10) % 11) % 10;
  const d2 = ((calc(value.slice(0, 10), [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]) * 10) % 11) % 10;

  return d1 === +value[9] && d2 === +value[10] ? null : { cpf: true };
};
