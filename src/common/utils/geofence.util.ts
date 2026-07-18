import { GeofencePoint } from '../../models/geofence-zone.entity';

/**
 * Ray-casting point-in-polygon test. Treats lat/lng as flat plane coordinates,
 * which is accurate enough for building-sized geofences (no need for PostGIS).
 */
export function isPointInPolygon(point: GeofencePoint, polygon: GeofencePoint[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;

    const intersects =
      yi > point.lat !== yj > point.lat &&
      point.lng < ((xj - xi) * (point.lat - yi)) / (yj - yi) + xi;

    if (intersects) {
      inside = !inside;
    }
  }
  return inside;
}

/**
 * @deprecated Radially expanding each vertex away from the polygon's centroid
 * does not produce a uniform buffer: for long/thin polygons it over-expands
 * near corners and under-expands along the middle of long edges, exactly
 * where a point is most likely to sit. Use `isPointInsideOrNearPolygon`
 * instead, which measures real distance to the nearest edge.
 */
export function bufferPolygon(polygon: GeofencePoint[], bufferMeters: number = 30): GeofencePoint[] {
  if (polygon.length < 3) return polygon;

  const bufferDegrees = bufferMeters / 111000;
  const center = getCentroid(polygon);

  return polygon.map((point) => {
    // Calculate direction from center to point
    const dx = point.lng - center.lng;
    const dy = point.lat - center.lat;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return point;

    // Extend point away from center by buffer amount
    const ratio = (distance + bufferDegrees) / distance;
    return {
      lat: center.lat + dy * ratio,
      lng: center.lng + dx * ratio,
    };
  });
}

function getCentroid(polygon: GeofencePoint[]): GeofencePoint {
  let lat = 0;
  let lng = 0;
  for (const point of polygon) {
    lat += point.lat;
    lng += point.lng;
  }
  return { lat: lat / polygon.length, lng: lng / polygon.length };
}

/**
 * Converts a lat/lng point to local flat meters relative to an origin, using
 * an equirectangular approximation (accurate enough for building-sized
 * geofences). Longitude degrees are scaled by cos(latitude) since a degree
 * of longitude shrinks toward the poles.
 */
function toLocalMeters(point: GeofencePoint, origin: GeofencePoint): { x: number; y: number } {
  const metersPerDegreeLat = 111320;
  const metersPerDegreeLng = 111320 * Math.cos((origin.lat * Math.PI) / 180);
  return {
    x: (point.lng - origin.lng) * metersPerDegreeLng,
    y: (point.lat - origin.lat) * metersPerDegreeLat,
  };
}

/** Shortest distance in meters from `point` to the segment (a, b). */
function pointToSegmentDistanceMeters(point: GeofencePoint, a: GeofencePoint, b: GeofencePoint): number {
  const p = toLocalMeters(point, point);
  const pa = toLocalMeters(a, point);
  const pb = toLocalMeters(b, point);

  const dx = pb.x - pa.x;
  const dy = pb.y - pa.y;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    return Math.sqrt((p.x - pa.x) ** 2 + (p.y - pa.y) ** 2);
  }

  let t = ((p.x - pa.x) * dx + (p.y - pa.y) * dy) / lengthSquared;
  t = Math.max(0, Math.min(1, t));

  const closestX = pa.x + t * dx;
  const closestY = pa.y + t * dy;
  return Math.sqrt((p.x - closestX) ** 2 + (p.y - closestY) ** 2);
}

/** Shortest distance in meters from `point` to any edge of `polygon`. */
export function distanceToPolygonMeters(point: GeofencePoint, polygon: GeofencePoint[]): number {
  let minDistance = Infinity;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const distance = pointToSegmentDistanceMeters(point, polygon[j], polygon[i]);
    minDistance = Math.min(minDistance, distance);
  }
  return minDistance;
}

/**
 * A point counts as "in the zone" if it's inside the polygon outright, or
 * within `bufferMeters` of the nearest edge (to absorb GPS inaccuracy).
 * This replaces the old expand-then-test approach, which under-buffered
 * the middle of long edges on elongated polygons.
 */
export function isPointInsideOrNearPolygon(
  point: GeofencePoint,
  polygon: GeofencePoint[],
  bufferMeters: number,
): boolean {
  if (isPointInPolygon(point, polygon)) return true;
  if (polygon.length < 2) return false;
  return distanceToPolygonMeters(point, polygon) <= bufferMeters;
}
