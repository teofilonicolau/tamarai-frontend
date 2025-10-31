import React, { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import DOMPurify from 'dompurify';
import jsPDF from 'jspdf';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';

/**
 * Preview
 * - aceita prop `peticao` (obj retornado pelo backend) ou `content` (string)
 * - renderiza rich text sanitized e fornece botões:
 *   - Copiar Texto
 *   - Gerar PDF (server-side) -> POST para endpoint peticao_pdf
 *   - Gerar PDF (client-side) -> jsPDF (fallback)
 *   - Mostrar/Ocultar Dados Utilizados (JSON) + botão para baixar JSON
 */
const Preview = ({ peticao, content, title }) => {
  const previewRef = useRef(null);
  const [showDados, setShowDados] = useState(false);

  const texto = (peticao?.texto_peticao ?? content ?? '').replace(
    /⚠️ Chave OpenAI não configurada no arquivo \.env\s*/g,
    ''
  ).trim();

  const copiarTexto = () => {
    if (previewRef.current) {
      navigator.clipboard.writeText(previewRef.current.innerText);
      toast.success('Texto copiado!');
    }
  };

  const downloadBlob = (blob, filename = 'peticao.pdf') => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const gerarPdfServer = async () => {
    try {
      toast.loading('Solicitando PDF ao servidor...');
      const endpoint = ENDPOINTS.previdenciario?.peticao_pdf || '/api/v1/previdenciario/peticao-pdf';
      const payload = peticao?.dados_utilizados ? peticao.dados_utilizados : { texto_peticao: texto };
      const resp = await api.post(endpoint, payload, { responseType: 'blob' });
      downloadBlob(resp.data, `peticao-${peticao?.tipo ?? 'documento'}.pdf`);
      toast.dismiss();
      toast.success('PDF gerado e baixado com sucesso!');
    } catch (err) {
      toast.dismiss();
      console.error('Erro ao gerar PDF server-side', err);
      toast.error('Erro ao gerar PDF no servidor. Tentando geração local...');
      gerarPdfClient();
    }
  };

  const gerarPdfClient = () => {
    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const lines = texto.split('\n');
      const margin = 40;
      let y = 40;
      const lineHeight = 14;
      doc.setFontSize(11);
      lines.forEach((line) => {
        const wrapped = doc.splitTextToSize(line, 520);
        wrapped.forEach((ln) => {
          if (y > 800) {
            doc.addPage();
            y = 40;
          }
          doc.text(ln, margin, y);
          y += lineHeight;
        });
      });
      doc.save(`peticao-${peticao?.tipo ?? 'documento'}.pdf`);
      toast.success('PDF gerado localmente.');
    } catch (err) {
      console.error('Erro jsPDF:', err);
      toast.error('Falha ao gerar PDF localmente.');
    }
  };

  const renderRich = () => {
    const maybeHtml = /<\/?[a-z][\s\S]*>/i.test(texto);
    if (maybeHtml) {
      const sanitized = DOMPurify.sanitize(texto);
      return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
    }
    const paragraphs = texto.split(/\n{2,}/).map((p, idx) => <p key={idx} style={{ marginBottom: '0.8em', lineHeight: '1.45' }}>{p}</p>);
    return <div>{paragraphs}</div>;
  };

  const baixarJson = () => {
    const data = peticao?.dados_utilizados ? peticao.dados_utilizados : {};
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dados_peticao_${peticao?.tipo ?? 'dados'}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success('JSON baixado.');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {peticao?.tipo && <div className="text-sm text-gray-500 mt-1">Tipo: {peticao.tipo} · Área: {peticao.area}</div>}
        </div>

        <div className="flex gap-2">
          <button onClick={copiarTexto} className="bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700">Copiar Texto</button>
          <button onClick={gerarPdfServer} className="bg-green-600 text-white py-2 px-3 rounded hover:bg-green-700">Gerar PDF (server)</button>
          <button onClick={gerarPdfClient} className="bg-gray-600 text-white py-2 px-3 rounded hover:bg-gray-700">Gerar PDF (client)</button>
        </div>
      </div>

      <div ref={previewRef} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg max-h-[60vh] overflow-y-auto text-gray-800 dark:text-gray-200">
        {renderRich()}
      </div>

      {/* Dados utilizados - ocultos por padrão */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowDados(s => !s)}
            className="text-sm text-gray-700 dark:text-gray-300 underline"
          >
            {showDados ? 'Ocultar dados utilizados' : 'Mostrar dados utilizados'}
          </button>

          {showDados && (
            <button
              onClick={baixarJson}
              className="text-sm bg-indigo-600 text-white py-1 px-2 rounded hover:bg-indigo-700"
            >
              Baixar dados (JSON)
            </button>
          )}
        </div>

        {showDados && peticao?.dados_utilizados && (
          <div className="mt-2 text-xs text-gray-500">
            <pre className="whitespace-pre-wrap text-xs bg-white dark:bg-gray-800 p-2 rounded mt-1">
              {JSON.stringify(peticao.dados_utilizados, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;