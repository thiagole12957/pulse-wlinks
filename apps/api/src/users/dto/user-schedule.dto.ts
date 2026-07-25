import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString, Matches } from 'class-validator'
import { DayOfWeek } from '@prisma/client'

export class ScheduleEntryDto {
  @ApiProperty({ enum: DayOfWeek })
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek

  @ApiProperty({ example: '08:00' })
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Formato de hora inválido (HH:mm)' })
  startTime: string

  @ApiProperty({ example: '18:00' })
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Formato de hora inválido (HH:mm)' })
  endTime: string
}

export class SetUserScheduleDto {
  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({ type: [ScheduleEntryDto] })
  @IsArray()
  entries: ScheduleEntryDto[]
}
