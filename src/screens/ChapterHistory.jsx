import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Swords, Package, Utensils, GitBranch, Plus, Trash2, BookOpen } from 'lucide-react';

const ChapterHistory = () => {
    const { history, addHistoryEntry, removeHistoryEntry, clearHistory } = useGame();

    const [chapNum, setChapNum] = useState('');
    const [chapNotes, setChapNotes] = useState('');
    const [tags, setTags] = useState({
        combat: false,
        item: false,
        food: false,
        choice: false
    });

    const toggleTag = (tag) => {
        setTags(prev => ({ ...prev, [tag]: !prev[tag] }));
    };

    const handleAddChapter = (e) => {
        e.preventDefault();
        if (!chapNum.trim()) {
            alert("Indiquez un numéro de chapitre.");
            return;
        }

        addHistoryEntry(chapNum.trim(), { ...tags }, chapNotes.trim());

        // Reset
        setChapNum('');
        setChapNotes('');
        setTags({ combat: false, item: false, food: false, choice: false });
    };

    const handleRemoveChapter = (id) => {
        if (window.confirm("Supprimer cette entrée ?")) {
            removeHistoryEntry(id);
        }
    };

    const handleClearHistory = () => {
        if (window.confirm("Cela effacera tout l'historique de cette aventure. Confirmer ?")) {
            clearHistory();
        }
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="text-center">
                <h2 className="text-3xl font-heading text-[#2c241b] mb-1">Historique</h2>
                <p className="italic font-body text-[#555]">Chroniques de vos pérégrinations</p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleAddChapter} className="p-4 border-2 border-[#5d4037] rounded-lg bg-white shadow-inner space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex flex-col">
                        <label className="text-[10px] uppercase font-heading text-[#5d4037]">Chapitre</label>
                        <input
                            type="text"
                            placeholder="N°"
                            className="w-16 h-10 border-2 border-[#e6d5b8] rounded text-center font-heading text-lg focus:border-[#c5a059] focus:outline-none"
                            value={chapNum}
                            onChange={(e) => setChapNum(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 flex gap-2 justify-around bg-[#fcf9f2] p-2 rounded border border-[#e6d5b8]">
                        <button
                            type="button"
                            onClick={() => toggleTag('combat')}
                            className={`p-2 rounded transition-colors ${tags.combat ? 'bg-[#8b0000] text-white' : 'text-[#5d4037] hover:bg-[#e6d5b8]'}`}
                            title="Combat"
                        >
                            <Swords className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => toggleTag('item')}
                            className={`p-2 rounded transition-colors ${tags.item ? 'bg-[#5d4037] text-white' : 'text-[#5d4037] hover:bg-[#e6d5b8]'}`}
                            title="Objet trouvé"
                        >
                            <Package className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => toggleTag('food')}
                            className={`p-2 rounded transition-colors ${tags.food ? 'bg-[#e67e22] text-white' : 'text-[#5d4037] hover:bg-[#e6d5b8]'}`}
                            title="Repas"
                        >
                            <Utensils className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => toggleTag('choice')}
                            className={`p-2 rounded transition-colors ${tags.choice ? 'bg-[#2980b9] text-white' : 'text-[#5d4037] hover:bg-[#e6d5b8]'}`}
                            title="Choix crucial"
                        >
                            <GitBranch className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="bg-[#27ae60] text-white p-2 rounded hover:bg-[#219150] transition-colors h-10 w-10 flex items-center justify-center"
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                </div>

                <textarea
                    placeholder="Notes sur ce chapitre (événements, rencontres, choix...)"
                    className="w-full p-3 border-2 border-[#e6d5b8] rounded font-body text-sm focus:border-[#c5a059] focus:outline-none bg-[#fcf9f2]"
                    rows={2}
                    value={chapNotes}
                    onChange={(e) => setChapNotes(e.target.value)}
                />
            </form>

            {/* History List */}
            <div className="space-y-4">
                {history.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg shadow border border-[#d7ccc8] relative group">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 bg-[#2c241b] rounded-full flex items-center justify-center text-[#f4e8d1] font-heading font-bold">
                                {item.chap}
                            </div>
                            <div className="flex gap-3">
                                {item.tags.combat && <Swords className="w-4 h-4 text-[#8b0000]" />}
                                {item.tags.item && <Package className="w-4 h-4 text-[#5d4037]" />}
                                {item.tags.food && <Utensils className="w-4 h-4 text-[#e67e22]" />}
                                {item.tags.choice && <GitBranch className="w-4 h-4 text-[#2980b9]" />}
                            </div>
                            <button
                                onClick={() => handleRemoveChapter(item.id)}
                                className="absolute top-4 right-4 text-[#bbb] hover:text-[#8b0000] opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        {item.notes && (
                            <p className="font-body text-[#444] italic pl-14 border-l-2 border-[#e6d5b8] ml-5 py-1">
                                {item.notes}
                            </p>
                        )}
                    </div>
                ))}

                {history.length === 0 && (
                    <div className="text-center py-10 text-[#888] italic space-y-2">
                        <BookOpen className="w-10 h-10 mx-auto opacity-20" />
                        <p>Aucun chapitre n'a encore été consigné dans ce grimoire.</p>
                    </div>
                )}
            </div>

            {history.length > 0 && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={handleClearHistory}
                        className="text-xs text-[#c0392b] underline hover:text-[#8b0000] transition-colors"
                    >
                        Effacer tout l'historique
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChapterHistory;
