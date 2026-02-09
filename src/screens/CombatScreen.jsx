import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Swords, X, Shield, Heart, Zap, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const D6 = ({ value, rolling }) => {
    const [displayVal, setDisplayVal] = useState(value);

    useEffect(() => {
        let interval;
        if (rolling) {
            interval = setInterval(() => setDisplayVal(Math.floor(Math.random() * 6) + 1), 80);
        } else {
            setDisplayVal(value);
        }
        return () => clearInterval(interval);
    }, [rolling, value]);

    return (
        <div className={`w-12 h-12 flex items-center justify-center bg-white rounded shadow-lg border-2 border-[#2b2b2b] text-xl font-bold font-heading ${rolling ? 'animate-bounce' : ''}`}>
            {displayVal || '?'}
        </div>
    );
};

const CombatScreen = ({ onClose }) => {
    const { skill, stamina, luck, weapons, modStat, testLuck, logCombat, improveWeapon } = useGame();

    const [enemyName, setEnemyName] = useState('Ennemi');
    const [enemySkill, setEnemySkill] = useState(6);
    const [enemyStamina, setEnemyStamina] = useState(6);

    const [playerRoll, setPlayerRoll] = useState([0, 0]);
    const [enemyRoll, setEnemyRoll] = useState([0, 0]);

    const [rolling, setRolling] = useState(false);
    const [roundResult, setRoundResult] = useState(null);
    const [showIntro, setShowIntro] = useState(true);

    const [selectedWeaponId, setSelectedWeaponId] = useState(weapons.length > 0 ? weapons[0].id : null);
    const selectedWeapon = weapons.find(w => w.id === selectedWeaponId);

    useEffect(() => {
        const timer = setTimeout(() => setShowIntro(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const rollDice = () => Math.floor(Math.random() * 6) + 1;

    const handleVictory = () => {
        logCombat(enemyName, enemySkill, enemyStamina, 'victory');
        if (selectedWeaponId) improveWeapon(selectedWeaponId);
        onClose();
    };

    const handleRound = () => {
        if (enemyStamina <= 0) {
            handleVictory();
            return;
        }
        if (stamina.cur <= 0) {
            logCombat(enemyName, enemySkill, enemyStamina, 'defeat');
            onClose();
            return;
        }

        setRolling(true);
        setRoundResult(null);

        setTimeout(() => {
            const p1 = rollDice();
            const p2 = rollDice();
            const e1 = rollDice();
            const e2 = rollDice();

            setPlayerRoll([p1, p2]);
            setEnemyRoll([e1, e2]);
            setRolling(false);

            const weaponBonus = selectedWeapon ? selectedWeapon.val : 0;
            const pTotal = p1 + p2 + skill.cur + weaponBonus;
            const eTotal = e1 + e2 + enemySkill;

            if (pTotal > eTotal) {
                setRoundResult('player');
                setEnemyStamina(s => Math.max(0, s - 2));
            } else if (eTotal > pTotal) {
                setRoundResult('enemy');
                modStat('Stamina', -2);
            } else {
                setRoundResult('draw');
            }
        }, 800);
    };

    const handleTestLuck = () => {
        const res = testLuck();
        if (res && res.success) {
            if (roundResult === 'player') setEnemyStamina(s => Math.max(0, s - 2));
            else if (roundResult === 'enemy') modStat('Stamina', 1);
        } else if (res && !res.success) {
            if (roundResult === 'player') setEnemyStamina(s => Math.max(0, s + 1));
            else if (roundResult === 'enemy') modStat('Stamina', -1);
        }
    };

    return (
        <div className="relative bg-[#2b2b2b] text-[#f0e6d2] min-h-[600px] flex flex-col p-6 rounded-lg overflow-hidden border-4 border-[#c5a059]">
            <AnimatePresence>
                {showIntro && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[#1a1a1a] z-[110] flex flex-col items-center justify-center"
                    >
                        <div className="flex gap-10 mb-8">
                            <motion.div initial={{ x: -200 }} animate={{ x: 0 }} transition={{ type: 'spring' }}>
                                <Swords className="w-32 h-32 text-[#f0e6d2] rotate-45" />
                            </motion.div>
                            <motion.div initial={{ x: 200 }} animate={{ x: 0 }} transition={{ type: 'spring' }}>
                                <Swords className="w-32 h-32 text-[#f0e6d2] -rotate-45 scale-x-[-1]" />
                            </motion.div>
                        </div>
                        <h2 className="text-6xl font-heading text-[#8b0000] tracking-widest">COMBAT !</h2>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-heading tracking-widest text-[#c5a059]">Arène de Combat</h3>
                <button onClick={onClose} className="text-[#f0e6d2] hover:text-[#8b0000]"><X /></button>
            </header>

            <div className="flex-1 flex flex-col gap-8">
                {/* Enemy Section */}
                <div className="bg-[#3e2723] p-4 rounded-lg border-2 border-[#1a1a1a] shadow-inner">
                    <input
                        className="w-full bg-transparent text-center text-2xl font-heading text-[#f0e6d2] mb-4 border-b border-[#f0e6d2]/30 focus:outline-none"
                        value={enemyName}
                        onChange={(e) => setEnemyName(e.target.value)}
                        placeholder="Nom de l'ennemi"
                    />
                    <div className="flex justify-around items-center">
                        <div className="text-center">
                            <div className="text-[10px] uppercase font-heading text-[#aaa]">Habileté</div>
                            <div className="flex items-center gap-4">
                                <button onClick={() => setEnemySkill(s => Math.max(0, s - 1))} className="text-2xl opacity-50 hover:opacity-100">-</button>
                                <span className="text-4xl font-heading">{enemySkill}</span>
                                <button onClick={() => setEnemySkill(s => s + 1)} className="text-2xl opacity-50 hover:opacity-100">+</button>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] uppercase font-heading text-[#aaa]">Endurance</div>
                            <div className="flex items-center gap-4">
                                <button onClick={() => setEnemyStamina(s => Math.max(0, s - 1))} className="text-2xl opacity-50 hover:opacity-100">-</button>
                                <span className="text-4xl font-heading text-[#c0392b]">{enemyStamina}</span>
                                <button onClick={() => setEnemyStamina(s => s + 1)} className="text-2xl opacity-50 hover:opacity-100">+</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Arena / Dice Section */}
                <div className="flex-1 bg-[#2c3e50] rounded-lg p-6 flex flex-col items-center justify-center gap-6 relative shadow-inner border border-[#1a1a1a]">
                    <div className="text-xs font-heading text-[#f0e6d2]/50 absolute top-2 uppercase tracking-widest">Zone d'Assaut</div>

                    <div className="w-full flex justify-around items-center">
                        <div className="text-center">
                            <div className="text-[10px] font-heading mb-2">VOUS (Hab: {skill.cur} + {selectedWeapon?.val || 0})</div>
                            <div className="flex gap-2">
                                <D6 value={playerRoll[0]} rolling={rolling} />
                                <D6 value={playerRoll[1]} rolling={rolling} />
                            </div>
                        </div>

                        <div className="text-3xl font-black italic text-[#c0392b] animate-pulse">VS</div>

                        <div className="text-center">
                            <div className="text-[10px] font-heading mb-2">ENNEMI (Hab: {enemySkill})</div>
                            <div className="flex gap-2">
                                <D6 value={enemyRoll[0]} rolling={rolling} />
                                <D6 value={enemyRoll[1]} rolling={rolling} />
                            </div>
                        </div>
                    </div>

                    <div className="h-12 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {roundResult && !rolling && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-2xl font-heading text-[#f1c40f] tracking-widest drop-shadow-lg"
                                >
                                    {roundResult === 'player' ? "VOUS TOUCHEZ !" : roundResult === 'enemy' ? "VOUS ÊTES TOUCHÉ !" : "ÉGALITÉ"}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex flex-col gap-4 w-full items-center">
                        {roundResult && roundResult !== 'draw' && (
                            <button
                                onClick={handleTestLuck}
                                className={`px-4 py-2 rounded font-heading text-xs transition-colors ${roundResult === 'player' ? 'bg-[#27ae60] hover:bg-[#219150]' : 'bg-[#e74c3c] hover:bg-[#c0392b]'}`}
                            >
                                🍀 Tenter la Chance ({roundResult === 'player' ? 'Dégâts ++' : 'Dégâts --'})
                            </button>
                        )}

                        <button
                            onClick={handleRound}
                            disabled={rolling}
                            className="bg-[#c0392b] hover:bg-[#e74c3c] text-white font-heading text-xl py-4 px-12 rounded-full shadow-lg border-2 border-[#e74c3c] transition-transform active:scale-95 disabled:opacity-50"
                        >
                            {rolling ? "..." : "ASSAUT ⚔️"}
                        </button>
                    </div>
                </div>

                {/* Player Stats Footer */}
                <div className="flex justify-between items-center bg-[#1a1a1a] p-4 rounded shadow-inner">
                    <div className="flex gap-8">
                        <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-[#c0392b]" />
                            <span className="font-heading">END: {stamina.cur}/{stamina.init}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-[#c5a059]" />
                            <span className="font-heading">CHANCE: {luck.cur}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => window.confirm('Fuir le combat ?') && onClose()}
                        className="text-[10px] uppercase font-heading text-[#777] underline hover:text-[#f0e6d2]"
                    >
                        Fuir le combat
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CombatScreen;
