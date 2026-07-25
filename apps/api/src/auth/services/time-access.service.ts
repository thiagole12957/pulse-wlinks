import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { RedisService } from '../../common/redis/redis.service'
import { AUTH_CONSTANTS } from '../constants/auth.constants'
import { UserRole, DayOfWeek } from '@prisma/client'
import { TZDate } from '@date-fns/tz'
import { getDay, format } from 'date-fns'

export interface TimeAccessResult {
  allowed: boolean
  reason?: string
  currentTime?: string
  allowedRange?: string
}

const DAY_MAP: Record<number, DayOfWeek> = {
  0: DayOfWeek.SUNDAY,
  1: DayOfWeek.MONDAY,
  2: DayOfWeek.TUESDAY,
  3: DayOfWeek.WEDNESDAY,
  4: DayOfWeek.THURSDAY,
  5: DayOfWeek.FRIDAY,
  6: DayOfWeek.SATURDAY,
}

@Injectable()
export class TimeAccessService {
  private readonly timezone = 'America/Sao_Paulo'
  private readonly cachePrefix = 'role_schedule:'

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async validateAccess(userId: string, role: UserRole): Promise<TimeAccessResult> {
    // Buscar configuração do role (com cache)
    const roleConfig = await this.getRoleConfig(role)

    // Se bypass está ativo, permitir qualquer horário
    if (roleConfig?.bypassTimeRestriction) {
      return { allowed: true }
    }

    // Obter data/hora atual no timezone correto
    const now = new TZDate(new Date(), this.timezone)
    const currentDayOfWeek = DAY_MAP[getDay(now)]
    const currentTime = format(now, 'HH:mm')

    // Verificar se usuário tem schedule override ativo
    const userSchedule = await this.getUserSchedule(userId)

    if (userSchedule?.active && userSchedule.entries.length > 0) {
      return this.checkScheduleEntries(
        userSchedule.entries,
        currentDayOfWeek,
        currentTime,
      )
    }

    // Usar schedule do role
    const roleSchedule = await this.getRoleSchedule(role)

    // Se não há schedule configurado, permitir (sem restrição)
    if (roleSchedule.length === 0) {
      return { allowed: true }
    }

    return this.checkScheduleEntries(roleSchedule, currentDayOfWeek, currentTime)
  }

  private checkScheduleEntries(
    entries: Array<{ dayOfWeek: DayOfWeek; startTime: string; endTime: string }>,
    currentDay: DayOfWeek,
    currentTime: string,
  ): TimeAccessResult {
    const todayEntry = entries.find((e) => e.dayOfWeek === currentDay)

    if (!todayEntry) {
      return {
        allowed: false,
        reason: 'Acesso não permitido neste dia da semana',
        currentTime,
      }
    }

    const isWithinRange = this.isTimeInRange(
      currentTime,
      todayEntry.startTime,
      todayEntry.endTime,
    )

    if (!isWithinRange) {
      return {
        allowed: false,
        reason: 'Acesso fora do horário permitido',
        currentTime,
        allowedRange: `${todayEntry.startTime} - ${todayEntry.endTime}`,
      }
    }

    return { allowed: true }
  }

  private isTimeInRange(current: string, start: string, end: string): boolean {
    // Converter para minutos para comparação
    const currentMinutes = this.timeToMinutes(current)
    const startMinutes = this.timeToMinutes(start)
    const endMinutes = this.timeToMinutes(end)

    return currentMinutes >= startMinutes && currentMinutes <= endMinutes
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  private async getRoleConfig(role: UserRole) {
    const cacheKey = `role_config:${role}`

    const cached = await this.redis.get(cacheKey)
    if (cached) {
      return JSON.parse(cached)
    }

    const config = await this.prisma.roleConfig.findUnique({
      where: { role },
    })

    if (config) {
      await this.redis.setex(
        cacheKey,
        AUTH_CONSTANTS.ROLE_CONFIG_CACHE_TTL,
        JSON.stringify(config),
      )
    }

    return config
  }

  private async getRoleSchedule(
    role: UserRole,
  ): Promise<Array<{ dayOfWeek: DayOfWeek; startTime: string; endTime: string }>> {
    const cacheKey = `${this.cachePrefix}${role}`

    const cached = await this.redis.get(cacheKey)
    if (cached) {
      return JSON.parse(cached)
    }

    const roleConfig = await this.prisma.roleConfig.findUnique({
      where: { role },
      include: { accessSchedules: true },
    })

    const schedules =
      roleConfig?.accessSchedules.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
      })) ?? []

    await this.redis.setex(
      cacheKey,
      AUTH_CONSTANTS.ROLE_CONFIG_CACHE_TTL,
      JSON.stringify(schedules),
    )

    return schedules
  }

  private async getUserSchedule(userId: string) {
    const cacheKey = `user_schedule:${userId}`

    const cached = await this.redis.get(cacheKey)
    if (cached) {
      return JSON.parse(cached)
    }

    const schedule = await this.prisma.userAccessSchedule.findUnique({
      where: { userId },
      include: { entries: true },
    })

    if (schedule) {
      await this.redis.setex(
        cacheKey,
        AUTH_CONSTANTS.ROLE_CONFIG_CACHE_TTL,
        JSON.stringify(schedule),
      )
    }

    return schedule
  }

  async invalidateUserScheduleCache(userId: string): Promise<void> {
    await this.redis.del(`user_schedule:${userId}`)
  }

  async invalidateRoleScheduleCache(role: UserRole): Promise<void> {
    await Promise.all([
      this.redis.del(`role_config:${role}`),
      this.redis.del(`${this.cachePrefix}${role}`),
    ])
  }
}
