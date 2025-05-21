
export function getDistanceInKm(
  hostCoordinates:{ latitude: number, longitude: number},
  visiterCoordinates: { latitude: number, longitude: number}
): number {
  // Convert degrees to radians
  const toRad = (value: number): number => (value * Math.PI) / 180;

  // Earth's radius in kilometers
  const earthRadius = 6371;

  // Difference in latitude and longitude (in radians)
  const dLat = toRad( visiterCoordinates.latitude - hostCoordinates.latitude);
  const dLon = toRad(visiterCoordinates.longitude - hostCoordinates.longitude);

  // Apply the Haversine formula
  const hFormulaResult =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) + // square of half the latitude difference
    Math.cos(toRad(hostCoordinates.latitude)) * // cosine of the first latitude (in radians)
    Math.cos(toRad(visiterCoordinates.latitude)) * // cosine of the second latitude (in radians)
    Math.sin(dLon / 2) * Math.sin(dLon / 2); // square of half the longitude difference

  const distanceInRadians = 2 * Math.atan2(Math.sqrt(hFormulaResult), Math.sqrt(1 - hFormulaResult)); // angular distance in radians

  const distance = Math.round( earthRadius * distanceInRadians); // distance in kilometers
  return distance;
}
