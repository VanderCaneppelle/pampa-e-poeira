import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function AdminBar() {
    const navigate = useNavigate();

    async function handleLogout() {
        await supabase.auth.signOut();
        navigate('/');
    }

    return (
        <div className="w-full bg-pampa-leather text-white py-2 px-4 flex justify-between items-center fixed top-0 left-0 z-50">
            <span>Você está em modo administrador</span>
            <button
                onClick={handleLogout}
                className="bg-white text-pampa-leather px-3 py-1 rounded font-bold hover:bg-gray-100"
            >
                Sair do modo admin
            </button>
        </div>
    );
} 