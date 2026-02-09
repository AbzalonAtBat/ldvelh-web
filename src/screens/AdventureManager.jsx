import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Plus, Edit2, Trash2, Check, X, Shield, Users } from 'lucide-react';

const AdventureManager = () => {
    const { profiles, activeId, addProfile, switchProfile, deleteProfile, renameProfile } = useGame();
    const [newName, setNewName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        addProfile(newName.trim());
        setNewName('');
    };

    const startEdit = (p) => {
        setEditingId(p.id);
        setEditText(p.name);
    };

    const saveEdit = () => {
        if (editText.trim()) {
            renameProfile(editingId, editText.trim());
        }
        setEditingId(null);
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="text-center">
                <h2 className="text-3xl font-heading text-[#2c241b] mb-1">Mes Aventures</h2>
                <p className="italic font-body text-[#555]">Gérez vos différentes quêtes</p>
            </div>

            {/* Add Section */}
            <form onSubmit={handleAdd} className="flex gap-2">
                <input
                    type="text"
                    placeholder="Nom de la nouvelle aventure..."
                    className="flex-1 p-3 border-2 border-[#5d4037] rounded-lg font-heading bg-white focus:outline-none focus:border-[#c5a059]"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-[#27ae60] text-white px-4 rounded-lg hover:bg-[#219150] transition-colors"
                >
                    <Plus className="w-6 h-6" />
                </button>
            </form>

            {/* List of Profiles */}
            <div className="grid gap-4">
                {profiles.map((item) => {
                    const isActive = item.id === activeId;
                    const isEditing = editingId === item.id;

                    return (
                        <div
                            key={item.id}
                            className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${isActive ? 'bg-[#fff9f0] border-[#8b0000] shadow-md' : 'bg-white border-[#d7ccc8] hover:border-[#c5a059]'
                                }`}
                        >
                            <div className="flex-1 flex items-center gap-4">
                                {isActive && <Shield className="w-5 h-5 text-[#8b0000]" />}
                                {isEditing ? (
                                    <div className="flex items-center gap-2 flex-1">
                                        <input
                                            type="text"
                                            className="flex-1 p-1 border-b-2 border-[#8b0000] font-heading text-lg focus:outline-none"
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            autoFocus
                                        />
                                        <button onClick={saveEdit} className="text-[#27ae60]"><Check className="w-5 h-5" /></button>
                                        <button onClick={() => setEditingId(null)} className="text-[#c0392b]"><X className="w-5 h-5" /></button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => switchProfile(item.id)}
                                        className={`text-lg font-heading text-left flex-1 ${isActive ? 'text-[#8b0000] font-bold' : 'text-[#5d4037]'}`}
                                    >
                                        {item.name}
                                    </button>
                                )}
                            </div>

                            {!isEditing && (
                                <div className="flex gap-4 ml-4">
                                    <button
                                        onClick={() => startEdit(item)}
                                        className="text-[#666] hover:text-[#2c241b]"
                                        title="Renommer"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteProfile(item.id)}
                                        className="text-[#c0392b] hover:text-[#8b0000]"
                                        title="Supprimer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}

                {profiles.length === 0 && (
                    <div className="text-center py-10 text-[#888] italic space-y-2">
                        <Users className="w-10 h-10 mx-auto opacity-20" />
                        <p>Aucune aventure n'est enregistrée.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdventureManager;
