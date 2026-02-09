import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Swords, RotateCcw, Shield, Heart, Zap, Coins, Package, Trash2, Plus, Check, Save } from 'lucide-react';

const StatBox = ({ label, current, initial, onMod, onTest }) => (
    <div className="flex flex-col items-center p-4 border-2 border-[#2c241b] rounded-lg bg-[#e6d5b8]/30 min-w-[100px]">
        <span className="font-heading text-xs uppercase text-[#5d4037] mb-1">{label}</span>
        <div className="flex items-center gap-3">
            <button onClick={() => onMod(-1)} className="text-xl font-bold bg-[#8b0000] text-white w-6 h-6 flex items-center justify-center rounded-full">-</button>
            <div className="text-center">
                <div className="text-2xl font-bold font-heading">{current}</div>
                <div className="text-[10px] text-[#555] border-t border-[#555]">MAX: {initial}</div>
            </div>
            <button onClick={() => onMod(1)} className="text-xl font-bold bg-[#2c241b] text-white w-6 h-6 flex items-center justify-center rounded-full">+</button>
        </div>
        {onTest && (
            <button
                onClick={onTest}
                className="mt-2 text-[10px] font-heading bg-[#c5a059] text-[#2c241b] px-2 py-1 rounded"
            >
                Tester sa Chance
            </button>
        )}
    </div>
);

const CharacterSheet = ({ onStartCombat }) => {
    const {
        skill, stamina, luck,
        gold, provisions, items, weapons,
        combats, notes, heptagram,
        isLoaded,
        rollNewChar, modStat, testLuck,
        modGold, modProv,
        addItem, removeItem,
        addWeapon, improveWeapon, removeWeapon,
        setNotes,
        updateHeptagram
    } = useGame();

    const [newItemName, setNewItemName] = useState('');
    const [showItemAdd, setShowItemAdd] = useState(false);

    if (!isLoaded) return <div className="text-center p-10 font-heading">Chargement du grimoire...</div>;

    const handleTestLuck = () => {
        const result = testLuck();
        if (result) {
            alert(`Test de Chance : ${result.roll}\n\nVotre chance actuelle: ${result.currentLuck} (avant réduction)\n\nRÉSULTAT: ${result.success ? "CHANCEUX ! (Heureux hasard)" : "MALCHANCEUX ! (Fatale destinée)"}`);
        }
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        if (newItemName.trim()) {
            if (addItem(newItemName.trim())) {
                setNewItemName('');
                setShowItemAdd(false);
            }
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="text-center">
                <h2 className="text-3xl font-heading text-[#2c241b] mb-1">Feuille d'Aventure</h2>
                <p className="italic font-body text-[#555]">"Voyage en Osmanlie"</p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatBox label="Habileté" current={skill.cur} initial={skill.init} onMod={(v) => modStat('Skill', v)} />
                <StatBox label="Endurance" current={stamina.cur} initial={stamina.init} onMod={(v) => modStat('Stamina', v)} />
                <StatBox label="Chance" current={luck.cur} initial={luck.init} onMod={(v) => modStat('Luck', v)} onTest={handleTestLuck} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Equipment & Items */}
                <section className="space-y-4">
                    <h3 className="font-heading text-lg border-b border-[#c5a059] flex items-center gap-2">
                        <Package className="w-5 h-5 text-[#8b0000]" />
                        Équipement & Objets
                    </h3>

                    <div className="flex gap-4">
                        <div className="flex-1 p-3 border border-[#c5a059] rounded bg-[#e6d5b8]/20">
                            <span className="text-xs uppercase font-heading block mb-1">Pièces d'Or</span>
                            <div className="flex items-center gap-2">
                                <Coins className="text-[#c5a059] w-4 h-4" />
                                <span className="text-xl font-bold">{gold}</span>
                                <div className="flex gap-1 ml-auto">
                                    <button onClick={() => modGold(-1)} className="w-6 h-6 bg-[#2c241b] text-white flex items-center justify-center rounded">-</button>
                                    <button onClick={() => modGold(1)} className="w-6 h-6 bg-[#2c241b] text-white flex items-center justify-center rounded">+</button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 p-3 border border-[#c5a059] rounded bg-[#e6d5b8]/20">
                            <span className="text-xs uppercase font-heading block mb-1">Repas</span>
                            <div className="flex items-center gap-2">
                                <Heart className="text-[#8b0000] w-4 h-4" />
                                <span className="text-xl font-bold">{provisions}</span>
                                <div className="flex gap-1 ml-auto">
                                    <button onClick={() => modProv(-1)} className="w-6 h-6 bg-[#2c241b] text-white flex items-center justify-center rounded">-</button>
                                    <button onClick={() => modProv(1)} className="w-6 h-6 bg-[#2c241b] text-white flex items-center justify-center rounded">+</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border border-[#c5a059] rounded p-3 bg-[#e6d5b8]/10">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs uppercase font-heading">Besace ({items.length + weapons.length}/10)</span>
                            <button
                                onClick={() => setShowItemAdd(!showItemAdd)}
                                className="text-[10px] font-heading bg-[#2c241b] text-white px-2 py-1 rounded"
                            >
                                {showItemAdd ? 'Annuler' : 'Ajouter'}
                            </button>
                        </div>

                        {showItemAdd && (
                            <form onSubmit={handleAddItem} className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={newItemName}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                    placeholder="Nom de l'objet..."
                                    className="flex-1 text-sm p-1 border border-[#c5a059] bg-[#f4e8d1]"
                                />
                                <button type="submit" className="bg-[#8b0000] text-white px-3 py-1 text-sm rounded">OK</button>
                            </form>
                        )}

                        <ul className="space-y-1">
                            {items.map(item => (
                                <li key={item.id} className="flex justify-between items-center text-sm p-1 hover:bg-[#e6d5b8]/40 rounded group">
                                    <span>- {item.name}</span>
                                    <button
                                        onClick={() => window.confirm('Abandonner ?') && removeItem(item.id)}
                                        className="opacity-0 group-hover:opacity-100 text-[#8b0000]"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </li>
                            ))}
                            {items.length === 0 && <li className="text-xs italic text-[#777]">Votre besace est vide.</li>}
                        </ul>
                    </div>
                </section>

                {/* Weapons Section */}
                <section className="space-y-4">
                    <h3 className="font-heading text-lg border-b border-[#c5a059] flex items-center gap-2">
                        <Swords className="w-5 h-5 text-[#8b0000]" />
                        Armes
                    </h3>
                    <ul className="space-y-2">
                        {weapons.map(w => (
                            <li key={w.id} className="p-2 border border-[#c5a059] rounded bg-[#e6d5b8]/20 flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-sm uppercase font-heading">{w.name}</div>
                                    <div className="text-[10px] text-[#555]">Potentiel: {w.pot} | Maîtrise: {w.val}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => improveWeapon(w.id)}
                                        className="p-1 bg-[#c5a059] text-[#2c241b] rounded"
                                        title="Améliorer la maîtrise"
                                    >
                                        <Zap className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={() => window.confirm('Lâcher cette arme ?') && removeWeapon(w.id)}
                                        className="p-1 bg-[#8b0000] text-white rounded"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            </li>
                        ))}
                        {weapons.length === 0 && <li className="text-xs italic text-[#777]">Vous n'avez aucune arme.</li>}
                    </ul>

                    <button
                        onClick={() => onStartCombat()}
                        className="w-full medieval-button flex items-center justify-center gap-2"
                    >
                        <Swords className="w-5 h-5" />
                        Engager le Combat
                    </button>
                </section>
            </div>

            {/* Heptagram (Simulated for now, just a grid of values) */}
            <section className="space-y-2">
                <h3 className="font-heading text-lg border-b border-[#c5a059]">Heptagramme</h3>
                <div className="grid grid-cols-7 gap-2">
                    {heptagram.map((val, idx) => (
                        <input
                            key={idx}
                            value={val}
                            onChange={(e) => updateHeptagram(idx, e.target.value)}
                            className="text-center font-heading border border-[#c5a059] bg-[#f4e8d1] w-full p-2"
                            placeholder="_"
                        />
                    ))}
                </div>
            </section>

            {/* Notes */}
            <section className="space-y-2">
                <h3 className="font-heading text-lg border-b border-[#c5a059]">Notes de l'Aventurier</h3>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={5}
                    className="w-full p-3 font-body bg-[#e6d5b8]/10 border border-[#c5a059] rounded focus:outline-none placeholder:italic"
                    placeholder="Écrivez vos découvertes ici..."
                />
            </section>

            {/* Reset */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => rollNewChar()}
                    className="flex items-center gap-2 text-[10px] font-heading uppercase tracking-widest text-[#555] opacity-50 hover:opacity-100 transition-opacity"
                >
                    <RotateCcw className="w-3 h-3" />
                    Recommencer l'aventure
                </button>
            </div>
        </div>
    );
};

export default CharacterSheet;
