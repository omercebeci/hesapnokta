import React, { useEffect, useState } from 'react';

const STORAGE_PREFIX = 'hn_feedback_';

async function postFeedback(payload) {
  const response = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return response.json();
}

export default function FeedbackWidget({ calculatorId, pageTitle }) {
  const storageKey = `${STORAGE_PREFIX}${calculatorId}`;
  const [stage, setStage] = useState('idle'); // idle | form | done | hidden
  const [pendingVote, setPendingVote] = useState(null);
  const [text, setText] = useState('');
  const [website, setWebsite] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.sessionStorage.getItem(storageKey)) {
      setStage('hidden');
    }
  }, [storageKey]);

  const submit = async ({ vote, text: feedbackText }) => {
    setIsSubmitting(true);
    setError('');
    try {
      const data = await postFeedback({ page: pageTitle, vote, text: feedbackText, website });
      if (data.ok) {
        window.sessionStorage.setItem(storageKey, '1');
        setStage('done');
      } else {
        setError(data.message || 'Bir şeyler ters gitti.');
      }
    } catch (err) {
      setError('Geri bildirim gönderilirken bağlantı hatası oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoteUp = () => submit({ vote: 'up', text: '' });

  const handleVoteDown = () => {
    setError('');
    setPendingVote('down');
    setStage('form');
  };

  const openForm = () => {
    setError('');
    setPendingVote(null);
    setStage('form');
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!text.trim() && !pendingVote) {
      setError('Lütfen kısaca yazın.');
      return;
    }
    submit({ vote: pendingVote, text: text.trim() });
  };

  if (stage === 'hidden') return null;

  return (
    <div className="feedback-widget">
      {stage === 'done' && <p className="feedback-thanks">Teşekkürler! Geri bildiriminiz bize ulaştı.</p>}

      {stage === 'form' && (
        <form className="feedback-form" onSubmit={handleFormSubmit}>
          <label htmlFor={`feedback-text-${calculatorId}`}>Eksik veya hatalı gördüğünüz bir şey var mı?</label>
          <textarea
            id={`feedback-text-${calculatorId}`}
            value={text}
            maxLength={500}
            rows={3}
            placeholder="Kısaca yazın..."
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="hp-field"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          <div className="feedback-form-actions">
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Gönderiliyor…' : 'Gönder'}
            </button>
          </div>
          {error && <p className="modal-status error">{error}</p>}
        </form>
      )}

      {stage === 'idle' && (
        <div className="feedback-prompt">
          <span>Bu araç işinize yaradı mı?</span>
          <div className="feedback-vote-buttons">
            <button type="button" aria-label="Evet, işime yaradı" onClick={handleVoteUp} disabled={isSubmitting}>👍</button>
            <button type="button" aria-label="Hayır, işime yaramadı" onClick={handleVoteDown} disabled={isSubmitting}>👎</button>
          </div>
          <button type="button" className="feedback-open-form-link" onClick={openForm}>Görüş bildir</button>
          {error && <p className="modal-status error feedback-idle-error">{error}</p>}
        </div>
      )}
    </div>
  );
}
