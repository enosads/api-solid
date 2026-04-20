export function omitSensitiveFields(user: Record<string, any>) {
  const { password_hash, ...safeUser } = user
  return safeUser
}
