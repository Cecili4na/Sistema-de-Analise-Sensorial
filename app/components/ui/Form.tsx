import { Input } from "./Input";

interface FormFieldProps {
  label?: string;
  id?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

const FormField = ({ 
  label, 
  id, 
  type = "text", 
  placeholder,
  required = false 
}: FormFieldProps) => (
  <Input
    label={label}
    id={id}
    name={id}
    type={type}
    placeholder={placeholder}
    autoComplete="off"
    required={required}
  />
);

export const JudgeFields = () => (
  <div className="space-y-4">
    <div className="mb-4">
      <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-2">
        Foto de Perfil (opcional)
      </label>
      <Input
        type="file"
        id="profilePicture"
        name="profilePicture"
        accept="image/*"
        aria-label="Selecione uma foto de perfil"
      />
    </div>
    
    <FormField 
      label="Nome" 
      id="name" 
      required 
      placeholder="Nome completo"
    />
    
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
          Sexo
        </label>
        <select
          id="gender"
          name="gender"
          required
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
          aria-label="Selecione seu sexo"
        >
          <option value="">Selecione</option>
          <option value="masculino">Masculino</option>
          <option value="feminino">Feminino</option>
          <option value="outro">Outro</option>
          <option value="prefiro_nao_dizer">Prefiro não dizer</option>
        </select>
      </div>
      
      <FormField 
        label="Data de Nascimento" 
        id="birthDate" 
        type="date" 
        required
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <FormField 
        label="E-mail" 
        id="email" 
        type="email" 
        required 
        placeholder="seu@email.com"
      />
      <FormField 
        label="Telefone" 
        id="phone" 
        type="tel" 
        required 
        placeholder="(00) 00000-0000"
      />
    </div>

    <FormField 
      label="Senha" 
      id="password" 
      type="password" 
      required 
      placeholder="Mínimo 6 caracteres"
    />

    <div>
      <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
        Escolaridade
      </label>
      <select
        id="education"
        name="education"
        required
        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
        aria-label="Selecione sua escolaridade"
      >
        <option value="">Selecione</option>
        <option value="fundamental_incompleto">Fundamental Incompleto</option>
        <option value="fundamental_completo">Fundamental Completo</option>
        <option value="medio_incompleto">Médio Incompleto</option>
        <option value="medio_completo">Médio Completo</option>
        <option value="superior_incompleto">Superior Incompleto</option>
        <option value="superior_completo">Superior Completo</option>
        <option value="pos_graduacao">Pós-graduação</option>
        <option value="mestrado">Mestrado</option>
        <option value="doutorado">Doutorado</option>
      </select>
    </div>
  </div>
);

export const AddressFields = () => (
  <div className="space-y-4">
    <FormField 
      label="Rua" 
      id="street" 
      required 
      placeholder="Nome da rua"
    />
    <FormField 
      label="Número" 
      id="number" 
      required 
      placeholder="Número"
    />
    <FormField 
      label="Bairro" 
      id="neighborhood" 
      required 
      placeholder="Nome do bairro"
    />
    <FormField 
      label="CEP" 
      id="zipCode" 
      required 
      placeholder="00000-000"
    />
    <FormField 
      label="Cidade" 
      id="city" 
      required 
      placeholder="Nome da cidade"
    />
    <FormField 
      label="Estado" 
      id="state" 
      required 
      placeholder="Nome do estado"
    />
  </div>
);

export const PersonalFields = () => (
  <div className="space-y-4">
    <div className="mb-4">
      <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-2">
        Foto de Perfil
      </label>
      <Input
        type="file"
        id="profilePicture"
        name="profilePicture"
        accept="image/*"
        aria-label="Selecione uma foto de perfil"
      />
    </div>
    
    <FormField 
      label="Nome" 
      id="name" 
      required 
      placeholder="Nome completo"
    />
    
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
          Sexo
        </label>
        <select
          id="gender"
          name="gender"
          required
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
          aria-label="Selecione seu sexo"
        >
          <option value="">Selecione</option>
          <option value="masculino">Masculino</option>
          <option value="feminino">Feminino</option>
          <option value="outro">Outro</option>
          <option value="prefiro_nao_dizer">Prefiro não dizer</option>
        </select>
      </div>
      
      <FormField 
        label="Data de Nascimento" 
        id="birthDate" 
        type="date" 
        required
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <FormField 
        label="E-mail" 
        id="email" 
        type="email" 
        required 
        placeholder="seu@email.com"
      />
      <FormField 
        label="Telefone" 
        id="phone" 
        type="tel" 
        required 
        placeholder="(00) 00000-0000"
      />
    </div>

    <FormField 
      label="Senha" 
      id="password" 
      type="password" 
      required 
      placeholder="Mínimo 6 caracteres"
    />

    <div>
      <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
        Escolaridade
      </label>
      <select
        id="education"
        name="education"
        required
        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
        aria-label="Selecione sua escolaridade"
      >
        <option value="">Selecione</option>
        <option value="fundamental_incompleto">Fundamental Incompleto</option>
        <option value="fundamental_completo">Fundamental Completo</option>
        <option value="medio_incompleto">Médio Incompleto</option>
        <option value="medio_completo">Médio Completo</option>
        <option value="superior_incompleto">Superior Incompleto</option>
        <option value="superior_completo">Superior Completo</option>
        <option value="pos_graduacao">Pós-graduação</option>
        <option value="mestrado">Mestrado</option>
        <option value="doutorado">Doutorado</option>
      </select>
    </div>
  </div>
);

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  id?: string;
}

export const TextAreaField = ({ label, id, ...props }: TextAreaFieldProps) => (
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
      {...props}
    />
  </div>
);
