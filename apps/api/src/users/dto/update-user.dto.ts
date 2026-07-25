import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator'
import { UserRole } from '@prisma/client'

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'João Silva' })
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional({ enum: UserRole })
  @IsEnum(UserRole, { message: 'Role inválido' })
  @IsOptional()
  role?: UserRole

  @ApiPropertyOptional({ example: 'team-uuid' })
  @IsString()
  @IsOptional()
  teamId?: string | null

  @ApiPropertyOptional({ example: 500000 })
  @IsInt()
  @Min(0)
  @IsOptional()
  maxApprovalAmount?: number | null
}
