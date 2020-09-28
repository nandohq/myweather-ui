import { PaisEntity } from './../pais/pais.entity';

export interface CidadeEntity {

  id: number;
  nome: string;
  descricao?: string;
  pais: PaisEntity;
  label: string;

}
