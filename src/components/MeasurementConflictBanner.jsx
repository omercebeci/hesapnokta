import React from 'react';

// Paylaşılan bir bağlantı (URL) açıldığında, bu cihazda zaten farklı bir ölçüm günlüğü
// kayıtlıysa kullanıcıya sorulur: birleştir mi, gelen veriyle mi değiştirilsin?
export default function MeasurementConflictBanner({ onMerge, onReplace }) {
  return (
    <div className="measurement-conflict-banner">
      <p>
        Bu bağlantı, bu cihazda zaten kayıtlı olan ölçüm günlüğünden farklı veri taşıyor. Ne yapmak istersiniz?
      </p>
      <div className="measurement-conflict-banner-actions">
        <button type="button" className="btn-primary" onClick={onMerge}>İkisini birleştir</button>
        <button type="button" className="header-home-link" onClick={onReplace}>Bu verilerle değiştir</button>
      </div>
    </div>
  );
}
