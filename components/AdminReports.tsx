
import React, { useState } from 'react';
import { UserReport } from '../types';
import { Users, FileText, CheckCircle, Clock, ChevronDown, ChevronUp, Search, Mail } from 'lucide-react';

interface AdminReportsProps {
  reports: UserReport[];
}

const AdminReports: React.FC<AdminReportsProps> = ({ reports }) => {
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = reports.filter(r => 
    r.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 flex items-center space-x-3">
          <Users className="w-8 h-8 text-orange-600" />
          <span>Monitoramento de Alunos</span>
        </h2>
        <p className="text-gray-500 mt-1">Acompanhe quem assistiu os vídeos, realizou atividades e suas respectivas notas.</p>
      </div>

      <div className="relative">
        <input 
          type="text" 
          placeholder="Buscar aluno por nome ou e-mail..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm border border-gray-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
        />
        <Search className="absolute left-4 top-4.5 text-gray-400 w-6 h-6" />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-8 py-4">Aluno</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-center">Atividades Concluídas</th>
                <th className="px-8 py-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredReports.map(report => (
                <React.Fragment key={report.userId}>
                  <tr className="hover:bg-orange-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                          {report.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{report.userName}</div>
                          <div className="text-xs text-gray-400 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {report.userEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {report.progress.length > 0 ? (
                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase">Ativo</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase">Inativo</span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="font-black text-gray-900 text-lg">{report.progress.length}</div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => setExpandedUser(expandedUser === report.userId ? null : report.userId)}
                        className="text-orange-600 font-bold text-xs uppercase flex items-center justify-end ml-auto hover:underline"
                      >
                        {expandedUser === report.userId ? 'Fechar Detalhes' : 'Ver Detalhes'}
                        {expandedUser === report.userId ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                      </button>
                    </td>
                  </tr>
                  {expandedUser === report.userId && (
                    <tr>
                      <td colSpan={4} className="px-8 py-6 bg-gray-50/50 animate-in slide-in-from-top-2 duration-300">
                        <div className="space-y-4">
                          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center">
                            <FileText className="w-4 h-4 mr-2" />
                            Histórico de Atividades
                          </h4>
                          {report.progress.length === 0 ? (
                            <p className="text-sm text-gray-400 italic">Nenhuma atividade concluída ainda.</p>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {report.progress.map((p, i) => (
                                <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start space-x-4">
                                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                                    <CheckCircle className="w-6 h-6" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-bold text-gray-800 text-sm">{p.itemTitle}</div>
                                    <div className="text-[10px] text-gray-400 uppercase font-bold">{p.folderName}</div>
                                    <div className="mt-2 flex items-center space-x-3">
                                      {p.score !== undefined && (
                                        <div className="text-xs font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                                          NOTA: {p.score}/{p.maxScore}
                                        </div>
                                      )}
                                      <div className="text-[10px] text-gray-400 flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {p.completedAt}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-gray-400">
                    Nenhum aluno encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
