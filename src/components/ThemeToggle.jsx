import React from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import Icon from './Icon.jsx';

// Not: İkon seçimi bilinçli olarak `theme` state'ine göre DEĞİL, saf CSS ile ([data-theme="dark"]
// seçicisiyle) yapılır. Statik olarak prerender edilen sayfalarda ziyaretçinin gerçek tema tercihi
// (localStorage/işletim sistemi) build anında bilinemez; ikon seçimi React state'ine bağlı olsaydı
// bu, sunucu ile istemci arasında farklı bir DOM üretip hydration hatasına yol açardı. Her iki ikon
// da DOM'da her zaman bulunur, yalnızca biri CSS ile gizlenir — böylece render çıktısı hep aynıdır.
export default function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label="Temayı değiştir" title="Temayı değiştir">
      <Icon name="sun" size={18} className="theme-toggle-icon-light" />
      <Icon name="moon" size={18} className="theme-toggle-icon-dark" />
    </button>
  );
}
