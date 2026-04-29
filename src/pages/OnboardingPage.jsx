import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBaris } from '../context/BarisContext';
import { QUESTIONS } from '../utils/constants';
import ProgressBar from '../components/onboarding/ProgressBar';
import QuestionCard from '../components/onboarding/QuestionCard';
import Layout from '../components/shared/Layout';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { updateAnswer } = useBaris();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [localAnswers, setLocalAnswers] = useState({});
  const [animDir, setAnimDir] = useState('forward');
  const [cardKey, setCardKey] = useState(0);

  const currentQuestion = QUESTIONS[currentIndex];
  const totalQuestions = QUESTIONS.length;

  const setAnswer = (value) => {
    setLocalAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const goNext = () => {
    const answer = localAnswers[currentQuestion.id];
    updateAnswer(currentQuestion.id, answer);

    if (currentIndex < totalQuestions - 1) {
      setAnimDir('forward');
      setCardKey((k) => k + 1);
      setCurrentIndex((i) => i + 1);
    } else {
      navigate('/ulasan');
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setAnimDir('back');
      setCardKey((k) => k + 1);
      setCurrentIndex((i) => i - 1);
    }
  };

  return (
    <Layout showBack title="Profil Usaha">
      <ProgressBar current={currentIndex + 1} total={totalQuestions} />

      <p className="text-small text-ink2 mb-4 text-center">
        Ceritakan usaha Anda — kami siap mendengarkan 😊
      </p>

      <QuestionCard
        key={cardKey}
        question={currentQuestion}
        currentAnswer={localAnswers[currentQuestion.id]}
        onAnswer={setAnswer}
        onNext={goNext}
        onBack={goBack}
        isFirst={currentIndex === 0}
        isLast={currentIndex === totalQuestions - 1}
        animDir={animDir}
      />

      {/* Indikator pertanyaan */}
      <div className="flex justify-center gap-1.5 mt-5">
        {QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? 'w-5 bg-brand'
                : i < currentIndex
                ? 'w-1.5 bg-sky'
                : 'w-1.5 bg-line'
            }`}
          />
        ))}
      </div>
    </Layout>
  );
}
