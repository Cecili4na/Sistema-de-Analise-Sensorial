import { Input } from "./Input";

interface FormFieldProps {
  label?: string;
  id?: string;
  type?: string;
  placeholder?: string;
}

const FormField = ({ 
  label, 
  id, 
  type = "text", 
  placeholder 
}: FormFieldProps) => (
  <Input
    label={label}
    id={id}
    name={id}
    type={type}
    placeholder={placeholder}
    autoComplete="off"
  />
);

export const AddressFields = () => (
  <div className="space-y-4">
    <FormField label="Rua" id="street" />
    <FormField label="Número" id="number" />
    <FormField label="Bairro" id="neighborhood" />
    <FormField label="CEP" id="zipCode" />
    <FormField label="Cidade" id="city" />
    <FormField label="Estado" id="state" />
  </div>
);

export const PersonalFields = () => (
  <div className="space-y-4">
    <FormField label="Nome" id="name" />
    <FormField label="E-mail" id="email" type="email" />
    <FormField label="Senha" id="password" type="password" />
    <FormField label="Data de Nascimento" id="birthDate" type="date" />
    <FormField label="Telefone" id="phone" type="tel" />
    <FormField label="Escolaridade" id="education" />
  </div>
);

interface TextAreaFieldProps {
  label?: string;
  id?: string;
}

export const TextAreaField = ({ label, id }: TextAreaFieldProps) => (
  <div className="space-y-1">
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
    )}
    <textarea
      id={id}
      name={id}
      rows={4}
      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
    />
  </div>
);
