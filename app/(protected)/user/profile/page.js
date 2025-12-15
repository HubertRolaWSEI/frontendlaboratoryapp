'use client';
import { useState, useEffect } from 'react';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import { useAuth } from '@/app/lib/AuthContext';
import { db } from '@/app/lib/firebase'; 
import Image from 'next/image';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useAuth();
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loadingData, setLoadingData] = useState(true); 

  const [formData, setFormData] = useState({
    displayName: '',
    photoURL: '',
    city: '',
    street: '',
    zipCode: '',
  });

  const defaultPhotoURL = 'https://dummyimage.com/100x100/ccc/000.png&text=User';

  useEffect(() => {
    if (!user) return;

    setFormData(prev => ({
        ...prev,
        displayName: user.displayName || '',
        photoURL: user.photoURL || ''
    }));

    const fetchUserData = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.address) {
            setFormData(prev => ({
              ...prev,
              city: data.address.city || '',
              street: data.address.street || '',
              zipCode: data.address.zipCode || ''
            }));
          }
        }
      } catch (error) {
        console.error("Błąd pobierania adresu:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      await updateProfile(user, {
        displayName: formData.displayName,
        photoURL: formData.photoURL,
      });

      const userDocRef = doc(db, "users", user.uid);
      
      await setDoc(userDocRef, {
        address: {
            street: formData.street,
            city: formData.city,
            zipCode: formData.zipCode
        }
      }, { merge: true }); 

      setMessage({ type: 'success', text: 'Profil i adres zostały zaktualizowane!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  if (!user) {
    return <div className="p-10 text-center">Ładowanie profilu...</div>;
  }

  return (
    <section className="text-gray-600 body-font relative">
      <div className="container px-5 py-12 mx-auto flex justify-center">
        <div className="lg:w-1/2 md:w-2/3 bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 shadow-md border border-gray-200">
          <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Mój Profil</h2>
          <p className="leading-relaxed mb-5 text-gray-600">
            Zarządzaj danymi profilowymi i adresem.
          </p>

          {message.text && (
            <div className={`mb-4 text-sm font-medium ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
              {message.type === 'error' ? '⚠️ ' : '✅ '}{message.text}
            </div>
          )}

          <div className="flex justify-center mb-6">
            <Image 
              src={formData.photoURL || defaultPhotoURL} 
              alt="Zdjęcie profilowe"
              width={100} 
              height={100}
              unoptimized 
              className="rounded-full object-cover border-4 border-indigo-500"
              onError={(e) => { 
                  e.target.onerror = null; 
                  e.target.src = defaultPhotoURL; 
              }} 
            />
          </div>

          <form onSubmit={onSubmit}>
            <div className="relative mb-4">
              <label className="leading-7 text-sm text-gray-600">Email</label>
              <input type="email" disabled value={user.email} className="w-full bg-gray-100 rounded border border-gray-300 text-gray-500 py-1 px-3" />
            </div>

            <div className="relative mb-4">
              <label htmlFor="displayName" className="leading-7 text-sm text-gray-600">Nazwa wyświetlana</label>
              <input 
                type="text" name="displayName" 
                value={formData.displayName} onChange={handleInputChange}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 text-gray-700 py-1 px-3" 
              />
            </div>
            
            <div className="relative mb-4">
              <label htmlFor="photoURL" className="leading-7 text-sm text-gray-600">URL zdjęcia</label>
              <input 
                type="url" name="photoURL" 
                value={formData.photoURL} onChange={handleInputChange}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 text-gray-700 py-1 px-3" 
              />
            </div>

            <hr className="my-6 border-gray-200" />
            <h3 className="text-gray-900 font-medium mb-4">Adres korespondencyjny</h3>

            <div className="relative mb-4">
              <label htmlFor="street" className="leading-7 text-sm text-gray-600">Ulica</label>
              <input 
                type="text" name="street" required
                value={formData.street} onChange={handleInputChange}
                disabled={loadingData}
                placeholder={loadingData ? "Wczytywanie..." : ""}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 text-gray-700 py-1 px-3 disabled:bg-gray-100" 
              />
            </div>

            <div className="flex gap-4 mb-4">
                <div className="w-1/3">
                    <label htmlFor="zipCode" className="leading-7 text-sm text-gray-600">Kod pocztowy</label>
                    <input 
                        type="text" name="zipCode" required
                        value={formData.zipCode} onChange={handleInputChange}
                        disabled={loadingData}
                        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 text-gray-700 py-1 px-3 disabled:bg-gray-100" 
                    />
                </div>
                <div className="w-2/3">
                    <label htmlFor="city" className="leading-7 text-sm text-gray-600">Miasto</label>
                    <input 
                        type="text" name="city" required
                        value={formData.city} onChange={handleInputChange}
                        disabled={loadingData}
                        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 text-gray-700 py-1 px-3 disabled:bg-gray-100" 
                    />
                </div>
            </div>
            
            <button disabled={loadingData} className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg w-full disabled:opacity-50">
              Zapisz zmiany
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}