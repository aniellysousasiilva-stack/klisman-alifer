
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Folder, Progress } from '../types';
import { Folder as FolderIcon, Plus, ChevronRight, BookOpen, Video, Trophy, Target } from 'lucide-react';

interface DashboardProps {
  folders: Folder[];
  progress: Progress;
  onAddFolder: (name: string, description: string) => void;
  isAdmin: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ folders, progress, onAddFolder, isAdmin }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName) {
      onAddFolder(newName, newDesc);
      setNewName('');
      setNewDesc('');
      setShowAdd(false);
    }
  };

  // Cálculos de Progresso Geral
  const allItems = folders.flatMap(f => f.items);
  const totalItemsCount = allItems.length;
  const completedItemsCount = progress.completedItems.length;
  const globalPercent = totalItemsCount > 0 ? Math.round((completedItemsCount / totalItemsCount) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Card de Progresso Geral para o Aluno */}
      {!isAdmin && totalItemsCount > 0 && (
        <div className="orange-gradient rounded-3xl p-6 text-white shadow-xl shadow-orange-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Trophy size={120} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Seu Desempenho Fire</h2>
              <p className="text-orange-100 font-medium">Você concluiu {completedItemsCount} de {totalItemsCount} atividades totais.</p>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full w-fit mt-2">
                <Target size={14} className="text-white" />
                <span className="text-[10px] font-black uppercase tracking-wider">Faltam {totalItemsCount - completedItemsCount} para o próximo nível!</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
              <div className="relative w-24 h-24 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                   <circle
                     cx="48"
                     cy="48"
                     r="40"
                     stroke="currentColor"
                     strokeWidth="8"
                     fill="transparent"
                     className="text-white/20"
                   />
                   <circle
                     cx="48"
                     cy="48"
                     r="40"
                     stroke="currentColor"
                     strokeWidth="8"
                     fill="transparent"
                     strokeDasharray={2 * Math.PI * 40}
                     strokeDashoffset={2 * Math.PI * 40 * (1 - globalPercent / 100)}
                     className="text-white transition-all duration-1000 ease-out"
                   />
                 </svg>
                 <span className="absolute text-xl font-black">{globalPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Suas Pastas</h2>
          <p className="text-gray-500 mt-1">Organize seu aprendizado por categorias.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-700 transition-all shadow-md active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Nova Pasta</span>
          </button>
        )}
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Nome da Pasta" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border p-2 rounded-lg"
              required
            />
            <input 
              type="text" 
              placeholder="Descrição curta" 
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full border p-2 rounded-lg"
            />
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 text-gray-500">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-lg font-bold">Criar</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {folders.map(folder => {
          const completedCount = folder.items.filter(item => progress.completedItems.includes(item.id)).length;
          const totalItems = folder.items.length;
          const percent = totalItems > 0 ? (completedCount / totalItems) * 100 : 0;

          return (
            <Link 
              key={folder.id} 
              to={`/folder/${folder.id}`}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-orange-200 overflow-hidden flex flex-col h-full"
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FolderIcon className="text-orange-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{folder.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-6">{folder.description}</p>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center text-xs text-gray-400 space-x-1">
                    <Video className="w-3 h-3" />
                    <span>{folder.items.filter(i => i.type === 'video').length} Vídeos</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-400 space-x-1">
                    <BookOpen className="w-3 h-3" />
                    <span>{folder.items.filter(i => i.type === 'exercise').length} Exercícios</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto p-6 pt-0">
                <div className="bg-gray-100 h-1.5 w-full rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 transition-all duration-500" 
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400 uppercase">
                  <span>Progresso</span>
                  <span>{Math.round(percent)}%</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {folders.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <FolderIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400">Nenhuma pasta criada ainda.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
