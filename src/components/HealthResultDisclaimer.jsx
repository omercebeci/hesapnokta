import React from 'react';

// Tansiyon/diyabet gibi hassas sağlık araçlarında, sayfa altındaki genel sağlık
// notundan daha güçlü ve sonuç kartına bitişik bir çerçeve olarak kullanılır.
export default function HealthResultDisclaimer() {
  return (
    <p className="health-disclaimer-strong">
      ⚕️ Bu araç teşhis koymaz; değerlendirme ve tedavi kararı hekiminize aittir.
    </p>
  );
}
