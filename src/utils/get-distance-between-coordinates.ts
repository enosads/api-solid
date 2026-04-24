export interface Coordinate {
  latitude: number
  longitude: number
}

export function getDistanceBetweenCoordinates(
  from: Coordinate,
  to: Coordinate,
): number {
  const R = 6371 // Earth radius in kilometers
  const φ1 = from.latitude * (Math.PI / 180)
  const φ2 = to.latitude * (Math.PI / 180)
  const Δφ = (to.latitude - from.latitude) * (Math.PI / 180)
  const Δλ = (to.longitude - from.longitude) * (Math.PI / 180)

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}
