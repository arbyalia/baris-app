import React, { useRef, useEffect } from 'react';
import OptionButton from './OptionButton';

export default function QuestionCard({
  question,
  currentAnswer,
  onAnswer,
  onNext,
  onBack,
  isFirst,
  isLast,
  animDir,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (question.type === 'text' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [question.type]);

  const hasAnswer =
    question.type === 'multiselect'
      ? Array.isArray(currentAnswer) && currentAnswer.length > 0
      : !!currentAnswer;

  const handleMultiToggle = (value) => {
    const current = Array.isArray(currentAnswer) ? currentAnswer : [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onAnswer(next);
  };

  const animClass = animDir === 'back' ? 'animate-slide-in-left' : 'animate-slide-in-right';

  return (
    <div className={`bg-surface rounded-2xl border border-line p-5 ${animClass}`}>
      {/* Pertanyaan */}
      <div className="mb-5">
        <p className="text-h3 text-ink leading-snug">{question.question}</p>
        {question.hint && (
          <p className="text-small text-brand font-medium mt-1">{question.hint}</p>
        )}
      </div>

      {/* Input berdasarkan tipe */}
      {question.type === 'text' && (
        <input
          ref={inputRef}
          type="text"
          value={currentAnswer || ''}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder={question.placeholder}
          className="w-full border border-line rounded-xl px-4 py-3 text-ink text-body
            focus:outline-none focus:border-brand transition-colors bg-surface"
          onKeyDown={(e) => e.key === 'Enter' && hasAnswer && onNext()}
        />
      )}

      {question.type === 'choice' && (
        <div className="flex flex-col gap-2">
          {question.options.map((opt) => (
            <OptionButton
              key={opt.value}
              label={opt.label}
              icon={opt.icon}
              selected={currentAnswer === opt.value}
              onClick={() => onAnswer(opt.value)}
            />
          ))}
        </div>
      )}

      {question.type === 'multiselect' && (
        <div className="grid grid-cols-2 gap-2">
          {question.options.map((opt) => (
            <OptionButton
              key={opt.value}
              label={opt.label}
              icon={opt.icon}
              selected={Array.isArray(currentAnswer) && currentAnswer.includes(opt.value)}
              onClick={() => handleMultiToggle(opt.value)}
            />
          ))}
        </div>
      )}

      {/* Navigasi */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-line">
        <button
          onClick={onBack}
          disabled={isFirst}
          className={`flex items-center gap-1.5 text-label font-medium px-3 py-2 rounded-xl transition-colors
            ${isFirst
              ? 'text-ink3 cursor-not-allowed'
              : 'text-ink2 hover:text-ink hover:bg-surface2'
            }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </button>

        <button
          onClick={onNext}
          disabled={!hasAnswer}
          className={`flex items-center gap-1.5 text-label font-semibold px-5 py-2.5 rounded-xl transition-all
            ${hasAnswer
              ? 'bg-brand text-white hover:bg-brand/90 active:scale-95'
              : 'bg-line text-ink3 cursor-not-allowed'
            }`}
        >
          {isLast ? 'Selesai' : 'Lanjut'}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
