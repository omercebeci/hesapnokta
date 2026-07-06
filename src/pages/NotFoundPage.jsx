import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Aradığınız sayfa bulunamadı.</p>
      <Link to="/">Ana sayfaya dön</Link>
    </div>
  );
}
