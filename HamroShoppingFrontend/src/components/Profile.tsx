// src/pages/Profile.tsx
import React, { useEffect, useState } from 'react';
import { authService } from '../services/api';
import { FaUserCircle, FaEnvelope, FaMapMarkerAlt, FaPhone, FaCity, FaGlobe, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { Skeleton } from '../components/Skeleton';
import { toast } from 'react-toastify';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNo: '',
    address: '',
    city: '',
    country: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await authService.getProfile();
      setUser(data);
      // Initialize form with fetched data
      setFormData({
        fullName: data.name || '',
        phoneNo: data.phonNumber || '',
        address: data.address || '',
        city: data.city || '',
        country: data.country || ''
      });
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await authService.editProfile(formData);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      fetchProfile(); // Refresh data
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-8"><Skeleton height="500px" className="rounded-[2.5rem]" /></div>;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-20">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        {/* Header/Cover */}
        <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-end justify-end p-6">
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-white/30 transition"
            >
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>
        
        <div className="px-8 pb-10">
          <div className="relative flex justify-center md:justify-start">
            <div className="absolute -top-16 bg-white p-2 rounded-[2.2rem] shadow-xl">
              <div className="w-32 h-32 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 border-4 border-white">
                <FaUserCircle size={80} />
              </div>
            </div>
          </div>

          <div className="mt-20">
            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-6">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Update Your Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup 
                    label="Full Name" 
                    value={formData.fullName} 
                    onChange={(val: string) => setFormData({...formData, fullName: val})} 
                  />
                  <InputGroup 
                    label="Phone Number" 
                    value={formData.phoneNo} 
                    onChange={(val: string) => setFormData({...formData, phoneNo: val})} 
                  />
                  <div className="md:col-span-2">
                    <InputGroup 
                      label="Street Address" 
                      value={formData.address} 
                      onChange={(val: string) => setFormData({...formData, address: val})} 
                    />
                  </div>
                  <InputGroup 
                    label="City" 
                    value={formData.city} 
                    onChange={(val: string) => setFormData({...formData, city: val})} 
                  />
                  <InputGroup 
                    label="Country" 
                    value={formData.country} 
                    onChange={(val: string) => setFormData({...formData, country: val})} 
                  />
                </div>

                <div className="flex gap-4 pt-6 border-t mt-8">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-xl shadow-blue-100 disabled:bg-gray-400"
                  >
                    <FaSave /> {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-gray-200 transition"
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              /* VIEW MODE */
              <div className="animate-in slide-in-from-top-2">
                <div className="text-center md:text-left mb-10">
                  <h1 className="text-4xl font-black text-gray-900">{user?.name}</h1>
                  <p className="text-blue-500 font-bold uppercase tracking-widest text-sm">{user?.email}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoCard icon={<FaEnvelope />} label="Email Address" value={user?.email} />
                  <InfoCard icon={<FaPhone />} label="Phone Number" value={user?.phonNumber || 'Not provided'} />
                  <InfoCard icon={<FaMapMarkerAlt />} label="Street Address" value={user?.address || 'Not provided'} />
                  <InfoCard icon={<FaCity />} label="City" value={user?.city || 'Not provided'} />
                  <InfoCard icon={<FaGlobe />} label="Country" value={user?.country || 'Not provided'} />
                  <InfoCard icon={<FaUserCircle />} label="System ID" value={user?.userId} isCode />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Reusable Small Components ---

const InfoCard = ({ icon, label, value, isCode = false }: any) => (
  <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-[1.8rem] border border-gray-100">
    <div className="text-blue-500 mt-1">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`font-bold text-gray-800 ${isCode ? 'text-[10px] break-all font-mono opacity-50' : 'text-lg'}`}>
        {value}
      </p>
    </div>
  </div>
);

const InputGroup = ({ label, value, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">{label}</label>
    <input 
      type="text" 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none font-bold transition-all"
      placeholder={`Enter ${label.toLowerCase()}`}
    />
  </div>
);

export default Profile;