import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import {
  AUTH_CONSTANTS,
  PASSWORD_REGEX,
  PASSWORD_VALIDATION_MESSAGE,
} from '../constants/auth.constants'

export interface PasswordValidationResult {
  valid: boolean
  errors: string[]
}

@Injectable()
export class PasswordService {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, AUTH_CONSTANTS.BCRYPT_ROUNDS)
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  validate(password: string): PasswordValidationResult {
    const errors: string[] = []

    if (password.length < AUTH_CONSTANTS.PASSWORD_MIN_LENGTH) {
      errors.push(`Senha deve ter no mínimo ${AUTH_CONSTANTS.PASSWORD_MIN_LENGTH} caracteres`)
    }

    if (AUTH_CONSTANTS.PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra maiúscula')
    }

    if (AUTH_CONSTANTS.PASSWORD_REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra minúscula')
    }

    if (AUTH_CONSTANTS.PASSWORD_REQUIRE_NUMBER && !/\d/.test(password)) {
      errors.push('Senha deve conter pelo menos um número')
    }

    if (AUTH_CONSTANTS.PASSWORD_REQUIRE_SPECIAL && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Senha deve conter pelo menos um caractere especial')
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  matchesPolicy(password: string): boolean {
    return PASSWORD_REGEX.test(password)
  }

  getValidationMessage(): string {
    return PASSWORD_VALIDATION_MESSAGE
  }
}
