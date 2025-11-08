import React, { lazy } from 'react';

// Lazy-load dos formulários previdenciários
const AposentadoriaInvalidezForm = lazy(() => import('./AposentadoriaInvalidezForm'));
const RevisaoVidaTodaForm = lazy(() => import('./RevisaoVidaTodaForm'));
const TempoContribuicaoForm = lazy(() => import('./TempoContribuicaoForm'));
const AuxilioDoencaForm = lazy(() => import('./AuxilioDoencaForm'));
const PensaoMorteForm = lazy(() => import('./PensaoMorteForm'));
const AposentadoriaEspecialForm = lazy(() => import('./AposentadoriaEspecialForm'));
const BpcLoasForm = lazy(() => import('./BpcLoasForm'));
const AposentadoriaRuralForm = lazy(() => import('./AposentadoriaRuralForm'));
const SalarioMaternidadeForm = lazy(() => import('./SalarioMaternidadeForm'));
const RevisaoBeneficioForm = lazy(() => import('./RevisaoBeneficioForm'));

// Registry: mapeamento slug -> componente + endpointKey (opcional)
export const previdenciarioRegistry = {
  'peticao-aposentadoria-invalidez': { component: AposentadoriaInvalidezForm, endpointKey: 'peticao_aposentadoria_invalidez' },
  'peticao-revisao-vida-toda': { component: RevisaoVidaTodaForm, endpointKey: 'peticao_revisao_vida_toda' },
  'peticao-aposentadoria-tempo-contribuicao': { component: TempoContribuicaoForm, endpointKey: 'peticao_aposentadoria_tempo_contribuicao' },
  'peticao-auxilio-doenca': { component: AuxilioDoencaForm, endpointKey: 'peticao_auxilio_doenca' },
  'peticao-pensao-morte': { component: PensaoMorteForm, endpointKey: 'peticao_pensao_morte' },
  'peticao-aposentadoria-especial': { component: AposentadoriaEspecialForm, endpointKey: 'peticao_aposentadoria_especial' },
  'peticao-bpc-loas': { component: BpcLoasForm, endpointKey: 'peticao_bpc_loas' },
  'peticao-aposentadoria-rural': { component: AposentadoriaRuralForm, endpointKey: 'peticao_aposentadoria_rural' },
  'peticao-salario-maternidade': { component: SalarioMaternidadeForm, endpointKey: 'peticao_salario_maternidade' },
  'peticao-revisao-beneficio': { component: RevisaoBeneficioForm, endpointKey: 'peticao_revisao_beneficio' },
};

// Helper
export const getPrevidenciarioEntry = (slug) => previdenciarioRegistry[slug] || null;

export default previdenciarioRegistry;