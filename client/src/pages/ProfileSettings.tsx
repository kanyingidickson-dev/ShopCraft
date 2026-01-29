import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfileSettings: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Profile settings</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Manage your account preferences. Updates are limited in demo mode.
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Name</div>
                            <div className="mt-1 text-base font-extrabold text-gray-900">
                                {user?.name ?? '—'}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Email</div>
                            <div className="mt-1 text-base font-extrabold text-gray-900">
                                {user?.email ?? '—'}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Role</div>
                            <div className="mt-1 text-base font-extrabold text-gray-900">
                                {user?.role ?? '—'}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="text-sm font-semibold text-gray-700">Preferences</div>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                <div className="text-sm font-extrabold text-gray-900">Email notifications</div>
                                <div className="mt-1 text-sm text-gray-600">Mocked (disabled in demo)</div>
                            </div>
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                <div className="text-sm font-extrabold text-gray-900">Saved addresses</div>
                                <div className="mt-1 text-sm text-gray-600">Mocked (handled at checkout)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
