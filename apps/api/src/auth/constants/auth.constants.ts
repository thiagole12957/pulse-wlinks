export const AUTH_CONSTANTS = {
  // Password policy
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBER: true,
  PASSWORD_REQUIRE_SPECIAL: true,
  BCRYPT_ROUNDS: 12,

  // Token expiration
  ACCESS_TOKEN_EXPIRATION: '15m',
  REFRESH_TOKEN_EXPIRATION: '7d',
  REFRESH_TOKEN_EXPIRATION_MS: 7 * 24 * 60 * 60 * 1000, // 7 days in ms

  // Session
  SESSION_EXPIRATION_MS: 7 * 24 * 60 * 60 * 1000, // 7 days in ms

  // Brute force protection
  MAX_FAILED_ATTEMPTS: 5,
  LOCKOUT_DURATIONS_MS: [
    1 * 60 * 1000, // 1 minute
    5 * 60 * 1000, // 5 minutes
    15 * 60 * 1000, // 15 minutes
    30 * 60 * 1000, // 30 minutes
    60 * 60 * 1000, // 1 hour
  ],

  // Rate limiting
  GLOBAL_RATE_LIMIT: 100,
  GLOBAL_RATE_LIMIT_TTL: 60000, // 1 minute
  LOGIN_RATE_LIMIT: 5,
  LOGIN_RATE_LIMIT_TTL: 60000, // 1 minute
  REFRESH_RATE_LIMIT: 10,
  REFRESH_RATE_LIMIT_TTL: 60000, // 1 minute

  // Cache TTL
  ROLE_CONFIG_CACHE_TTL: 5 * 60, // 5 minutes in seconds
} as const

export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/

export const PASSWORD_VALIDATION_MESSAGE =
  'Senha deve ter no mínimo 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial'
