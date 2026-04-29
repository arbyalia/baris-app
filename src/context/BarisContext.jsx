import React, { createContext, useContext, useState } from 'react';

const BarisContext = createContext(null);

export function BarisProvider({ children }) {
  const [answers, setAnswers] = useState({});
  const [reviews, setReviews] = useState([]);
  const [scores, setScores] = useState({
    reputasiDigital: 0,
    konsistensiOperasional: 0,
    kematanganBisnis: 0,
    profilRisiko: 0,
  });
  const [totalScore, setTotalScore] = useState(null);
  const [rating, setRating] = useState(null);
  const [confidenceScore, setConfidenceScore] = useState(null);
  const [sentimentResults, setSentimentResults] = useState([]);

  const updateAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const resetAll = () => {
    setAnswers({});
    setReviews([]);
    setSentimentResults([]);
    setScores({ reputasiDigital: 0, konsistensiOperasional: 0, kematanganBisnis: 0, profilRisiko: 0 });
    setTotalScore(null);
    setRating(null);
    setConfidenceScore(null);
  };

  return (
    <BarisContext.Provider
      value={{
        answers, updateAnswer,
        reviews, setReviews,
        sentimentResults, setSentimentResults,
        scores, setScores,
        totalScore, setTotalScore,
        rating, setRating,
        confidenceScore, setConfidenceScore,
        resetAll,
      }}
    >
      {children}
    </BarisContext.Provider>
  );
}

export function useBaris() {
  const ctx = useContext(BarisContext);
  if (!ctx) throw new Error('useBaris harus dipakai di dalam BarisProvider');
  return ctx;
}
