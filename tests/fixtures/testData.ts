export interface ContactoTestData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  documento: string;
}

export const testData: { contactos: Record<string, ContactoTestData> } = {
  contactos: {
    contactoValido: {
      nombre: 'Contacto QA',
      apellido: 'Automatizado',
      email: 'contacto.qa@example.com',
      telefono: '1122334455',
      documento: '30111222'
    },
    contactoEditado: {
      nombre: 'Contacto QA Editado',
      apellido: 'Automatizado',
      email: 'contacto.qa.editado@example.com',
      telefono: '1199887766',
      documento: '30111222'
    },
    contactoDuplicado: {
      nombre: 'Contacto Duplicado',
      apellido: 'Automatizado',
      email: 'contacto.duplicado@example.com',
      telefono: '1100001111',
      documento: '30999888'
    }
  }
};
