import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString } from 'class-validator'

export class AssignBranchesDto {
  @ApiProperty({ example: ['branch-1', 'branch-2'] })
  @IsArray()
  @IsString({ each: true })
  branchIds: string[]
}
