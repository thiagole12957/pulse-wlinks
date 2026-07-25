import { PrismaClient, UserRole, UserStatus, DayOfWeek } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const BCRYPT_ROUNDS = 12

async function main() {
  console.log('Seeding database...')

  // Criar RoleConfigs para cada role
  await seedRoleConfigs()

  // Criar superadmin
  await seedSuperadmin()

  console.log('Seeding completed!')
}

async function seedRoleConfigs() {
  console.log('Creating role configurations...')

  const weekdays = [
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
  ]

  // ADMIN - bypass tudo
  await prisma.roleConfig.upsert({
    where: { role: UserRole.ADMIN },
    update: {},
    create: {
      role: UserRole.ADMIN,
      bypassIpWhitelist: true,
      bypassTimeRestriction: true,
      description: 'Administrador do sistema - sem restrições',
    },
  })
  console.log('  - ADMIN config created (bypass all)')

  // DIRECTOR - bypass horário mas não IP
  const directorConfig = await prisma.roleConfig.upsert({
    where: { role: UserRole.DIRECTOR },
    update: {},
    create: {
      role: UserRole.DIRECTOR,
      bypassIpWhitelist: false,
      bypassTimeRestriction: true,
      description: 'Diretor - sem restrição de horário',
    },
  })
  console.log('  - DIRECTOR config created (bypass time)')

  // SUPERVISOR - horário 07:00-20:00 seg-sex
  const supervisorConfig = await prisma.roleConfig.upsert({
    where: { role: UserRole.SUPERVISOR },
    update: {},
    create: {
      role: UserRole.SUPERVISOR,
      bypassIpWhitelist: false,
      bypassTimeRestriction: false,
      description: 'Supervisor - horário estendido',
    },
  })

  // Criar schedules para supervisor
  for (const day of weekdays) {
    await prisma.roleAccessSchedule.upsert({
      where: {
        roleConfigId_dayOfWeek: {
          roleConfigId: supervisorConfig.id,
          dayOfWeek: day,
        },
      },
      update: {},
      create: {
        roleConfigId: supervisorConfig.id,
        dayOfWeek: day,
        startTime: '07:00',
        endTime: '20:00',
      },
    })
  }
  console.log('  - SUPERVISOR config created (07:00-20:00 Mon-Fri)')

  // OPERATOR - horário 08:00-18:00 seg-sex
  const operatorConfig = await prisma.roleConfig.upsert({
    where: { role: UserRole.OPERATOR },
    update: {},
    create: {
      role: UserRole.OPERATOR,
      bypassIpWhitelist: false,
      bypassTimeRestriction: false,
      description: 'Operador - horário comercial',
    },
  })

  for (const day of weekdays) {
    await prisma.roleAccessSchedule.upsert({
      where: {
        roleConfigId_dayOfWeek: {
          roleConfigId: operatorConfig.id,
          dayOfWeek: day,
        },
      },
      update: {},
      create: {
        roleConfigId: operatorConfig.id,
        dayOfWeek: day,
        startTime: '08:00',
        endTime: '18:00',
      },
    })
  }
  console.log('  - OPERATOR config created (08:00-18:00 Mon-Fri)')

  // VIEWER - horário 08:00-18:00 seg-sex
  const viewerConfig = await prisma.roleConfig.upsert({
    where: { role: UserRole.VIEWER },
    update: {},
    create: {
      role: UserRole.VIEWER,
      bypassIpWhitelist: false,
      bypassTimeRestriction: false,
      description: 'Visualizador - horário comercial',
    },
  })

  for (const day of weekdays) {
    await prisma.roleAccessSchedule.upsert({
      where: {
        roleConfigId_dayOfWeek: {
          roleConfigId: viewerConfig.id,
          dayOfWeek: day,
        },
      },
      update: {},
      create: {
        roleConfigId: viewerConfig.id,
        dayOfWeek: day,
        startTime: '08:00',
        endTime: '18:00',
      },
    })
  }
  console.log('  - VIEWER config created (08:00-18:00 Mon-Fri)')
}

async function seedSuperadmin() {
  console.log('Creating superadmin user...')

  const email = 'tiagomelo@wlinks.com.br'
  const password = 'Trocar@123'
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS)

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      name: 'Tiago Melo',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      mustChangePassword: true,
    },
  })

  console.log(`  - Superadmin created: ${user.email}`)
  console.log(`  - Initial password: ${password}`)
  console.log(`  - Must change password on first login: ${user.mustChangePassword}`)
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
