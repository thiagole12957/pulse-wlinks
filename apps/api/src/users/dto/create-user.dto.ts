import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsInt,
  Min,
  MinLength,
  Matches,
} from 'class-validator'
import { UserRole } from '@prisma/client'
import {
  PASSWORD_REGEX,
  PASSWORD_VALIDATION_MESSAGE,
} from '../../auth/constants/auth.constants'

export class CreateUserDto {
  @ApiProperty({ example: 'usuario@wlinks.com.br' })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string

  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string

  @ApiProperty({ example: 'Senha@123' })
  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @Matches(PASSWORD_REGEX, { message: PASSWORD_VALIDATION_MESSAGE })
  password: string

  @ApiProperty({ enum: UserRole, example: UserRole.OPERATOR })
  @IsEnum(UserRole, { message: 'Role inválido' })
  role: UserRole

  @ApiPropertyOptional({ example: 'team-uuid' })
  @IsString()
  @IsOptional()
  teamId?: string

  @ApiPropertyOptional({ example: 500000, description: 'Valor máximo de aprovação em centavos' })
  @IsInt()
  @Min(0)
  @IsOptional()
  maxApprovalAmount?: number

  @ApiPropertyOptional({ example: ['branch-1', 'branch-2'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  branchIds?: string[]

  @ApiPropertyOptional({ example: ['wallet-1'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  walletIds?: string[]
}
