// ---------- Metodos para manejar datos ----------

// Distancia entre dos puntos, latitud y longitud
const distanceBetweenTwoPoints = (pointA, pointB) => {
  //Recuperado del sitio web https://www.movable-type.co.uk/scripts/latlong.html

  const R = 6371e3; // metres
  const φ1 = (pointA.lat * Math.PI) / 180; // φ, λ in radians
  const φ2 = (pointB.lat * Math.PI) / 180;
  const Δφ = ((pointB.lat - pointA.lat) * Math.PI) / 180;
  const Δλ = ((pointB.long - pointA.long) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres

  return (d/1000).toFixed(2);
};


export {distanceBetweenTwoPoints}