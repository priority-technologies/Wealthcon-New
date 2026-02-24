'use client';

import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/app/_context/User';
import { User, Mail, Phone, MapPin } from 'lucide-react';

const ProfilePage = () => {
  const { userDetails } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(userDetails || {});

  return (
    <div className="bg-wc-dark min-h-screen text-white pt-8 pb-12">
      <div className="container mx-auto px-4 md:px-12 max-w-2xl">
        <h1 className="text-4xl font-black mb-8">Profile</h1>

        <div className="bg-wc-card rounded-lg p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-wc-cyan/20 rounded-full flex items-center justify-center">
              <User className="text-wc-cyan" size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{userDetails?.username || 'User'}</h2>
              <p className="text-gray-400">{userDetails?.role || 'Member'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
              <Mail className="text-wc-cyan flex-shrink-0" size={20} />
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white">{userDetails?.email || 'N/A'}</p>
              </div>
            </div>

            {userDetails?.mobile && (
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                <Phone className="text-wc-cyan flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-white">{userDetails.mobile}</p>
                </div>
              </div>
            )}

            {(userDetails?.state || userDetails?.district) && (
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                <MapPin className="text-wc-cyan flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="text-white">
                    {userDetails?.district && `${userDetails.district}, `}
                    {userDetails?.state}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-4">
            <button className="bg-wc-cyan text-black font-bold py-2 px-6 rounded-lg hover:bg-cyan-600 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
