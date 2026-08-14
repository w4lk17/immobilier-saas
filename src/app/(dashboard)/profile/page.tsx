"use client";

import { PasswordForm } from '@/features/profile/components/PasswordForm';
import { ProfileForm } from '@/features/profile/components/ProfileForm';
import { useChangePassword, useMyProfile, useUpdateMyProfile } from '@/features/profile/hooks/useProfile.hooks';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { data: user, isLoading: isProfileLoading } = useMyProfile();
  const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateMyProfile();
  const { mutateAsync: changePassword, isPending: isChangingPw, } = useChangePassword();


  const handleUpdateProfile = async (data: any) => {
    await updateProfile(data);
  };

  const handleChangePassword = async (data: any) => {
    await changePassword(data);
  };

  if (isProfileLoading || !user) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <ProfileForm user={user} onSubmit={handleUpdateProfile} isLoading={isUpdating} />
      <PasswordForm onSubmit={handleChangePassword} isLoading={isChangingPw} />
    </div>
  );
}