import { useEffect, useState } from 'react';
import { Form, useNavigate } from '@remix-run/react';
import { getAuth, updateProfile } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseApp } from '~/lib/firebase.client';

interface UserData {
  name: string;
  gender: string;
  birthDate: string;
  email: string;
  phone: string;
  education: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export default function ProducerProfilePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!firebaseApp) return;
    
    const auth = getAuth(firebaseApp);
    const db = getFirestore(firebaseApp);
    
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate('/login?role=produtor');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'producers', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
          setPhotoURL(user.photoURL);
        }
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados do perfil');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !firebaseApp) return;

    try {
      const auth = getAuth(firebaseApp);
      const storage = getStorage(firebaseApp);
      const user = auth.currentUser;
      if (!user) return;

      const photoRef = ref(storage, `profile_photos/${user.uid}`);
      await uploadBytes(photoRef, file);
      const photoURL = await getDownloadURL(photoRef);
      
      await updateProfile(user, { photoURL });
      setPhotoURL(photoURL);
    } catch (err) {
      console.error('Erro ao atualizar foto:', err);
      setError('Erro ao atualizar foto de perfil');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firebaseApp) return;
    
    const formData = new FormData(event.currentTarget);
    
    try {
      const auth = getAuth(firebaseApp);
      const db = getFirestore(firebaseApp);
      const user = auth.currentUser;
      if (!user) return;

      const updatedData = {
        name: formData.get('name'),
        gender: formData.get('gender'),
        birthDate: formData.get('birthDate'),
        phone: formData.get('phone'),
        education: formData.get('education'),
        address: {
          street: formData.get('street'),
          number: formData.get('number'),
          neighborhood: formData.get('neighborhood'),
          city: formData.get('city'),
          state: formData.get('state'),
          zipCode: formData.get('zipCode'),
        }
      };

      await updateDoc(doc(db, 'producers', user.uid), updatedData);
      await updateProfile(user, { displayName: formData.get('name')?.toString() });
      
      setUserData({ ...userData, ...updatedData } as UserData);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      setError('Erro ao atualizar dados do perfil');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F0E5] flex items-center justify-center">
        <p className="text-lg">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F0E5] flex flex-col">
      <header className="bg-[#A0522D] text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/logo-panc.png" 
              alt="PANC Logo" 
              className="h-12 w-auto"
            />
            <h1 className="text-2xl font-bold">Perfil do Produtor</h1>
          </div>
          <button
            onClick={() => navigate('/dashboardProdutor')}
            className="px-4 py-2 border border-white rounded-lg hover:bg-[#8B4513] transition"
          >
            Voltar
          </button>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <img
                src={photoURL || '/default-avatar.png'}
                alt="Foto de Perfil"
                className="w-32 h-32 rounded-full object-cover border-4 border-[#A0522D]"
              />
              <label 
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 bg-[#A0522D] text-white p-2 rounded-full cursor-pointer hover:bg-[#8B4513] transition"
              >
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                📷
              </label>
            </div>
          </div>

          <Form method="post" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label 
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nome
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  defaultValue={userData?.name}
                  disabled={!isEditing}
                  title="Nome completo"
                  placeholder="Digite seu nome completo"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#A0522D] disabled:bg-gray-100"
                />
              </div>

              <div>
                <label 
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Sexo
                </label>
                <select
                  id="gender"
                  name="gender"
                  defaultValue={userData?.gender}
                  disabled={!isEditing}
                  title="Selecione seu sexo"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#A0522D] disabled:bg-gray-100"
                >
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                  <option value="prefiro_nao_dizer">Prefiro não dizer</option>
                </select>
              </div>

              <div>
                <label 
                  htmlFor="birthDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Data de Nascimento
                </label>
                <input
                  id="birthDate"
                  type="date"
                  name="birthDate"
                  defaultValue={userData?.birthDate}
                  disabled={!isEditing}
                  title="Data de nascimento"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#A0522D] disabled:bg-gray-100"
                />
              </div>

              <div>
                <label 
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  defaultValue={userData?.email}
                  disabled
                  title="Email"
                  placeholder="seu@email.com"
                  className="w-full p-2 border rounded bg-gray-100"
                />
              </div>

              <div>
                <label 
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Telefone
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  defaultValue={userData?.phone}
                  disabled={!isEditing}
                  title="Telefone"
                  placeholder="(00) 00000-0000"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#A0522D] disabled:bg-gray-100"
                />
              </div>

              <div className="col-span-2">
                <label 
                  htmlFor="education"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Escolaridade
                </label>
                <select
                  id="education"
                  name="education"
                  defaultValue={userData?.education}
                  disabled={!isEditing}
                  title="Selecione sua escolaridade"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#A0522D] disabled:bg-gray-100"
                >
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

            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Endereço
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label 
                    htmlFor="street"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Rua
                  </label>
                  <input
                    id="street"
                    type="text"
                    name="street"
                    defaultValue={userData?.address?.street}
                    disabled={!isEditing}
                    title="Nome da rua"
                    placeholder="Digite o nome da rua"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#A0522D] disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label 
                    htmlFor="number"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Número
                  </label>
                  <input
                    id="number"
                    type="text"
                    name="number"
                    defaultValue={userData?.address?.number}
                    disabled={!isEditing}
                    title="Número"
                    placeholder="Digite o número"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#A0522D] disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label 
                    htmlFor="neighborhood"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Bairro
                  </label>
                  <input
                    id="neighborhood"
                    type="text"
                    name="neighborhood"
                    defaultValue={userData?.address?.neighborhood}
                    disabled={!isEditing}
                    title="Bairro"
                    placeholder="Digite o bairro"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#A0522D] disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label 
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Cidade
                  </label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    defaultValue={userData?.address?.city}
                    disabled={!isEditing}
                    title="Cidade"
                    placeholder="Digite a cidade"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#A0522D] disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label 
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Estado
                  </label>
                  <input
                    id="state"
                    type="text"
                    name="state"
                    defaultValue={userData?.address?.state}
                    disabled={!isEditing}
                    title="Estado"
                    placeholder="Digite o estado"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#A0522D] disabled:bg-gray-100"
                  />
                </div>

                <div className="col-span-2">
                  <label 
                    htmlFor="zipCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    CEP
                  </label>
                  <input
                    id="zipCode"
                    type="text"
                    name="zipCode"
                    defaultValue={userData?.address?.zipCode}
                    disabled={!isEditing}
                    title="CEP"
                    placeholder="00000-000"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#A0522D] disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-[#A0522D] text-white px-6 py-2 rounded-lg hover:bg-[#8B4513] transition"
                >
                  Editar Perfil
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-[#A0522D] text-white px-6 py-2 rounded-lg hover:bg-[#8B4513] transition"
                  >
                    Salvar
                  </button>
                </>
              )}
            </div>
          </Form>
        </div>
      </main>

      <footer className="bg-[#A0522D] text-white py-4 text-center text-sm mt-8">
        <p>© 2024 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
      </footer>
    </div>
  );
}