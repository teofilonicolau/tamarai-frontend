import { useParams } from 'react-router-dom';
import FormularioPeticao from '../components/FormularioDinamico/FormularioPeticao';

const Peticoes = () => {
  const { tipoPeticao } = useParams();
  return <FormularioPeticao tipoPeticao={tipoPeticao} />;
};

export default Peticoes;
