import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';

export default function CalculatorCard({ calculator }) {
  return (
    <Link className="calculator-card" to={`/${calculator.id}`}>
      <span className="card-icon"><Icon name={calculator.icon} size={22} /></span>
      <h3>{calculator.title}</h3>
      <p>{calculator.description}</p>
      <span className="card-link">Hesapla <Icon name="arrow-right" size={15} /></span>
    </Link>
  );
}
