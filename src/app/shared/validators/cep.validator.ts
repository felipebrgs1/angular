import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const cepValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value?.replace(/\D/g, '');
  return value && value.length === 8 ? null : { cep: true };
};
