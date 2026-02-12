
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Folder, Progress, ContentItem } from '../types';
import { ChevronLeft, Plus, Video, BookOpen, CheckCircle, Circle, PlayCircle, FileText, Wand2, Loader2, Sparkles } from 'lucide-react';
import { generateQuizForVideo } from '../services/geminiService';

interface FolderDetailProps {
  folders: Folder[];
  progress: Progress;
  onAddItem: (folderId: string, item: Omit<ContentItem, 'id'>) => void;
  isAdmin: boolean;
}

const FolderDetail: React.FC<FolderDetailProps> = ({ folders, progress, onAddItem, isAdmin }) => {
  const { id } = useParams<{ id: string }>();
  const folder = folders.find(f => f.id === id);
  const [showAdd, setShowAdd] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  
  // Form State
  const [type, setType] = useState<'video' | 'exercise'>('video');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  if (!folder) return <div className="text-center py-20">Pasta não encontrada.</div>;

  const completedItems = folder.items.filter(item => progress.completedItems.includes(item.id));
  const pendingItemsCount = folder.items.length - completedItems.length;
  const folderPercent = folder.items.length > 0 ? Math.round((completedItems.length / folder.items.length) * 100) : 0;

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAI(true);
    
    let quiz = undefined;
    if (type === 'video' && title) {
      quiz = await generateQuizForVideo(title, description || 'Conteúdo educativo');
    }

    onAddItem(folder.id, {
      title,
      type,
      url: type === 'video' ? url : undefined,
      description,
      quiz: quiz || undefined
    });
    
    setTitle('');
    setUrl('');
    setDescription('');
    setShowAdd(false);
    setLoadingAI(false);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Voltar para Pastas
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">{folder.name}</h2>
          <p className="text-gray-500 mt-1">{folder.description}</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-700 transition-all shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>Adicionar Conteúdo</span>
          </button>
        )}
      </div>

      {/* Barra de Progresso da Pasta */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
        <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
          <div className="flex items-center text-orange-600">
             <Sparkles size={14} className="mr-1" />
             Seu Progresso nesta Pasta
          </div>
          <div className="text-gray-400">
            {completedItems.length} de {folder.items.length} concluídos
          </div>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full orange-gradient transition-all duration-1000 ease-out shadow-inner"
            style={{ width: `${folderPercent}%` }}
          />
        </div>
        {pendingItemsCount > 0 ? (
          <p className="text-[10px] text-gray-400 font-bold uppercase">Faltam {pendingItemsCount} atividades para completar esta categoria.</p>
        ) : folder.items.length > 0 ? (
          <p className="text-[10px] text-green-600 font-black uppercase flex items-center">
            <CheckCircle size={10} className="mr-1" /> 
            Parabéns! Você dominou esta pasta completamente!
          </p>
        ) : null}
      </div>

      {showAdd && (
        <form onSubmit={handleAddItem} className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm space-y-4">
          <div className="flex space-x-4 mb-2">
            <button 
              type="button" 
              onClick={() => setType('video')}
              className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 border-2 transition-all ${type === 'video' ? 'bg-orange-50 border-orange-500 text-orange-700 font-bold' : 'border-gray-100 text-gray-500'}`}
            >
              <Video className="w-4 h-4" />
              <span>Vídeo</span>
            </button>
            <button 
              type="button" 
              onClick={() => setType('exercise')}
              className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 border-2 transition-all ${type === 'exercise' ? 'bg-orange-50 border-orange-500 text-orange-700 font-bold' : 'border-gray-100 text-gray-500'}`}
            >
              <FileText className="w-4 h-4" />
              <span>Exercício</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Título" 
              className="border p-2 rounded-lg" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
            />
            {type === 'video' && (
              <input 
                type="text" 
                placeholder="URL do vídeo (MP4)" 
                className="border p-2 rounded-lg" 
                value={url} 
                onChange={e => setUrl(e.target.value)} 
                required 
              />
            )}
            <div className="md:col-span-2">
              <textarea 
                placeholder="Descrição" 
                className="w-full border p-2 rounded-lg" 
                value={description} 
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center text-xs text-orange-600 font-medium">
              <Wand2 className="w-3 h-3 mr-1" />
              Gemini AI gerará um quiz automaticamente para este vídeo.
            </div>
            <div className="flex space-x-2">
              <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 text-gray-400">Cancelar</button>
              <button 
                type="submit" 
                disabled={loadingAI}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg font-bold disabled:opacity-50 flex items-center"
              >
                {loadingAI && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {loadingAI ? 'Criando...' : 'Adicionar'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {folder.items.length === 0 ? (
            <div className="p-12 text-center text-gray-400">Nenhum conteúdo adicionado nesta pasta.</div>
          ) : (
            folder.items.map((item, idx) => {
              const isCompleted = progress.completedItems.includes(item.id);
              return (
                <Link 
                  key={item.id} 
                  to={`/content/${folder.id}/${item.id}`}
                  className="flex items-center p-4 hover:bg-orange-50 transition-colors group"
                >
                  <div className="w-8 text-gray-300 text-sm font-bold group-hover:text-orange-400">{idx + 1}</div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${item.type === 'video' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                    {item.type === 'video' ? <Video className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{item.title}</h4>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{item.type}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {isCompleted ? (
                      <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        CONCLUÍDO
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-300 px-3 py-1 rounded-full text-xs font-bold">
                        <Circle className="w-3 h-3 mr-1" />
                        PENDENTE
                      </div>
                    )}
                    <PlayCircle className="text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8" />
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default FolderDetail;
