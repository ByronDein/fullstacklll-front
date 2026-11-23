import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UsuarioRepository } from '../repositories/usuario.repository';

// ---------- Validaciones de contrasena (se piden al menos 4) ----------
// 1. Minimo 8 caracteres   2. Maximo 20 caracteres   3. Mayuscula y minuscula
// 4. Al menos un numero    5. Al menos un caracter especial   6. Sin espacios

export interface ReglaClave {
  texto: string;
  cumple: boolean;
}

export function reglasClave(valor: string): ReglaClave[] {
  return [
    { texto: 'Mínimo 8 caracteres', cumple: valor.length >= 8 },
    { texto: 'Máximo 20 caracteres', cumple: valor.length > 0 && valor.length <= 20 },
    { texto: 'Mayúsculas y minúsculas', cumple: /[a-z]/.test(valor) && /[A-Z]/.test(valor) },
    { texto: 'Al menos un número', cumple: /\d/.test(valor) },
    { texto: 'Al menos un carácter especial (!@#$%&*...)', cumple: /[^A-Za-z0-9\s]/.test(valor) },
    { texto: 'Sin espacios', cumple: valor.length > 0 && !/\s/.test(valor) },
  ];
}

export const claveSegura: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor = (control.value ?? '') as string;
  if (!valor) {
    return null; // si esta vacia lo avisa Validators.required
  }
  const errores: ValidationErrors = {};
  if (valor.length < 8) errores['minimo'] = true;
  if (valor.length > 20) errores['maximo'] = true;
  if (!/[a-z]/.test(valor) || !/[A-Z]/.test(valor)) errores['mayusMinus'] = true;
  if (!/\d/.test(valor)) errores['numero'] = true;
  if (!/[^A-Za-z0-9\s]/.test(valor)) errores['especial'] = true;
  if (/\s/.test(valor)) errores['espacios'] = true;
  return Object.keys(errores).length ? errores : null;
};

// Compara dos campos del formulario (clave y confirmar clave)
export function camposIguales(campo: string, confirmar: string): ValidatorFn {
  return (grupo: AbstractControl): ValidationErrors | null => {
    const a = grupo.get(campo)?.value;
    const b = grupo.get(confirmar)?.value;
    return a === b ? null : { noCoinciden: true };
  };
}

// Revisa que el correo no este registrado (excepto el del propio usuario al editar su perfil)
export function correoDisponible(repo: UsuarioRepository, idPropio: () => number | null = () => null): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = ((control.value ?? '') as string).trim();
    if (!valor) {
      return null;
    }
    const existente = repo.buscarPorCorreo(valor);
    return existente && existente.id !== idPropio() ? { correoEnUso: true } : null;
  };
}

// Solo letras, espacios y tildes (para nombres)
export const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+$/;
