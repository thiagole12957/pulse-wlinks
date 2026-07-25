import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString } from 'class-validator'

export class AssignWalletsDto {
  @ApiProperty({ example: ['wallet-1', 'wallet-2'] })
  @IsArray()
  @IsString({ each: true })
  walletIds: string[]
}
