export interface Dias {

  data: string;
  icone: string;
  descricao: string;

  minima: number;
  maxima: number;
  umidade: number;
  sensacao: number;
  visibilidade: number;
}

export interface PrevisaoEntity {

  cidade: string;
  diasPrevistos: Dias[];
}
