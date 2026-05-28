export interface TipoBienTestData {
  descripcion: string;
  descripcionEditada: string;
  tipoGti: string;
  tipoBe: string;
  limitarResponsabilidadPrincipal: boolean;
}

const uniqueSuffix = (): string => Date.now().toString().slice(-6);

export const createTipoBienTestData = (): TipoBienTestData => {
  const suffix = uniqueSuffix();

  return {
    descripcion: `Inmueble Residencial Test ${suffix}`,
    descripcionEditada: `Inmueble Residencial Test - Mod ${suffix}`,
    tipoGti: '001',
    tipoBe: 'INM',
    limitarResponsabilidadPrincipal: true
  };
};
