import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { User } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pin_code: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/profile');
        setProfile(response.data.data);
        setFormData({
          name: response.data.data.name,
          phone: response.data.data.phone || '',
          address: response.data.data.address || '',
          city: response.data.data.city || '',
          state: response.data.data.state || '',
          pin_code: response.data.data.pin_code || ''
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setMessage('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const response = await api.put('/auth/profile', formData);
      setProfile(response.data.data);
      setMessage('Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">My Profile</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}

        {profile && (
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* User Info Header */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b">
              <div className="bg-green-600 text-white p-4 rounded-full">
                <User size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-gray-600">{profile.email}</p>
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mt-2">
                  {profile.role.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Profile Form */}
            {editing ? (
              <div className="space-y-6">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Pin Code</label>
                  <input
                    type="text"
                    name="pin_code"
                    value={formData.pin_code}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn btn-primary flex-1"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="btn btn-outline flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 text-sm">Full Name</p>
                    <p className="font-semibold">{profile.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="font-semibold">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Phone</p>
                    <p className="font-semibold">{profile.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Role</p>
                    <p className="font-semibold capitalize">{profile.role}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">City</p>
                    <p className="font-semibold">{profile.city || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">State</p>
                    <p className="font-semibold">{profile.state || 'N/A'}</p>
                  </div>
                </div>

                {profile.address && (
                  <div>
                    <p className="text-gray-600 text-sm">Address</p>
                    <p className="font-semibold">{profile.address}</p>
                  </div>
                )}

                {profile.pin_code && (
                  <div>
                    <p className="text-gray-600 text-sm">Pin Code</p>
                    <p className="font-semibold">{profile.pin_code}</p>
                  </div>
                )}

                <button
                  onClick={() => setEditing(true)}
                  className="btn btn-primary"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
