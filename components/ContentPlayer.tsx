
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Folder } from '../types';
import { ChevronLeft, Play, CheckCircle2, AlertCircle, Award, ArrowRight, RefreshCcw } from 'lucide-react';

interface ContentPlayerProps {
  folders: Folder[];
  onComplete: (itemId: string, score?: number, maxScore?: number) => void;
  progress: any;
}

const ContentPlayer: React.FC<ContentPlayerProps> = ({ folders, onComplete, progress }) => {
  const { folderId, contentId } = useParams<{ folderId: string, contentId: string }>();
  const navigate = useNavigate();
  const folder = folders.find(f => f.id === folderId);
  const item = folder?.items.find(i => i.id === contentId);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState<{ [key: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [scoreInfo, setScoreInfo] = useState<{score: number, max: number} | null>(null);

  useEffect(() => {
    if (progress.completedItems.includes(contentId)) {
      setVideoEnded(true);
      setQuizSubmitted(true);
      setIsCorrect(true);
    }
  }, [contentId, progress.completedItems]);

  if (!item) return <div>Conteúdo não encontrado.</div>;

  const handleVideoEnd = () => {
    setVideoEnded(true);
    if (item.quiz && item.quiz.length > 0) {
      setShowQuiz(true);
    } else {
      onComplete(item.id);
      setIsCorrect(true);
      setQuizSubmitted(true);
    }
  };

  const submitQuiz = () => {
    if (!item.quiz) return;
    
    const correctCount = item.quiz.filter((q, idx) => quizResults[q.id] === q.correctAnswer).length;
    const passed = correctCount === item.quiz.length;
    
    setQuizSubmitted(true);
    setIsCorrect(passed);
    setScoreInfo({ score: correctCount, max: item.quiz.length });
    
    if (passed) {
      onComplete(item.id, correctCount, item.quiz.length);
    }
  };

  const restartQuiz = () => {
    setQuizResults({});
    setQuizSubmitted(false);
    setIsCorrect(false);
    setScoreInfo(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-700">
      <button 
        onClick={() => navigate(`/folder/${folderId}`)}
        className="flex items-center text-gray-500 hover:text-orange-600 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Voltar para a Pasta
      </button>

      <div className="bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video relative group">
        {item.type === 'video' ? (
          <video 
            ref={videoRef}
            src={item.url} 
            className="w-full h-full object-contain"
            controls
            onEnded={handleVideoEnd}
          />
        ) : (
          <div className="w-full h-full bg-orange-50 flex flex-col items-center justify-center p-12 text-center">
            <Award className="w-20 h-20 text-orange-500 mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{item.title}</h2>
            <p className="text-gray-600 max-w-lg mb-8">{item.description}</p>
            {!quizSubmitted && (
              <button 
                onClick={() => setShowQuiz(true)}
                className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-orange-200 hover:bg-orange-700"
              >
                Começar Exercício
              </button>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-orange-600 font-bold text-xs uppercase tracking-widest">{item.type}</span>
            <h1 className="text-2xl font-extrabold text-gray-900 mt-1">{item.title}</h1>
            <p className="text-gray-500 mt-2">{item.description}</p>
          </div>
          {progress.completedItems.includes(item.id) && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-2xl flex items-center font-bold animate-bounce">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Concluído!
            </div>
          )}
        </div>

        {showQuiz && !quizSubmitted && (
          <div className="space-y-8 mt-8 border-t pt-8">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <Play className="w-5 h-5 text-orange-500 mr-2 fill-orange-500" />
              Questionário de Avaliação
            </h3>
            
            {item.quiz?.map((q, idx) => (
              <div key={q.id} className="space-y-4">
                <p className="font-bold text-gray-700">{idx + 1}. {q.question}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => setQuizResults({ ...quizResults, [q.id]: optIdx })}
                      className={`p-4 text-left rounded-xl border-2 transition-all ${quizResults[q.id] === optIdx ? 'border-orange-500 bg-orange-50 text-orange-700 ring-2 ring-orange-200' : 'border-gray-100 hover:border-gray-200 text-gray-600'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-center pt-4">
              <button 
                onClick={submitQuiz}
                disabled={Object.keys(quizResults).length < (item.quiz?.length || 0)}
                className="bg-orange-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-orange-100 hover:bg-orange-700 disabled:opacity-50 transition-all flex items-center group"
              >
                Enviar Respostas
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {quizSubmitted && (
          <div className={`mt-8 p-10 rounded-3xl border-2 text-center space-y-4 animate-in zoom-in-95 duration-500 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            {isCorrect ? (
              <>
                <div className="w-20 h-20 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-3xl font-black text-green-800">Parabéns!</h3>
                <p className="text-green-700 text-lg">Você acertou todas as questões ({scoreInfo?.score}/{scoreInfo?.max}) e concluiu este conteúdo.</p>
                <button 
                  onClick={() => navigate(`/folder/${folderId}`)}
                  className="mt-6 bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-colors inline-block"
                >
                  Continuar Jornada
                </button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-12 h-12 text-red-600" />
                </div>
                <h3 className="text-3xl font-black text-red-800">Ops!</h3>
                <p className="text-red-700 text-lg">Sua pontuação foi {scoreInfo?.score} de {scoreInfo?.max}. Você precisa acertar todas para concluir. Tente novamente!</p>
                <button 
                  onClick={restartQuiz}
                  className="mt-6 bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-colors inline-flex items-center"
                >
                  <RefreshCcw className="w-5 h-5 mr-2" />
                  Tentar Novamente
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentPlayer;
