import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator'
import { PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE } from '../constants/auth.constants'

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Senha atual',
  })
  @IsString()
  @IsNotEmpty({ message: 'Senha atual é obrigatória' })
  currentPassword: string

  @ApiProperty({
    description: 'Nova senha (mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 especial)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Nova senha é obrigatória' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @Matches(PASSWORD_REGEX, { message: PASSWORD_VALIDATION_MESSAGE })
  newPassword: string

  @ApiProperty({
    description: 'Confirmação da nova senha',
  })
  @IsString()
  @IsNotEmpty({ message: 'Confirmação de senha é obrigatória' })
  confirmPassword: string
}
