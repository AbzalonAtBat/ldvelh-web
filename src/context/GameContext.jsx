import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

const GameContext = createContext();

const STORAGE_KEY = 'ldvelh_data_web_v1';
const d6 = () => Math.floor(Math.random() * 6) + 1;

const INITIAL_PROFILE_DATA = {
    skill: { init: 0, cur: 0 },
    stamina: { init: 0, cur: 0 },
    luck: { init: 0, cur: 0 },
    gold: 0,
    provisions: 4,
    items: [],
    weapons: [{ id: Date.now(), name: "Poignard", pot: 2, val: 2 }],
    combats: [],
    notes: '',
    heptagram: Array(7).fill(''),
    history: []
};

export const GameProvider = ({ children }) => {
    const [profiles, setProfiles] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const [skill, setSkill] = useState(INITIAL_PROFILE_DATA.skill);
    const [stamina, setStamina] = useState(INITIAL_PROFILE_DATA.stamina);
    const [luck, setLuck] = useState(INITIAL_PROFILE_DATA.luck);
    const [gold, setGold] = useState(INITIAL_PROFILE_DATA.gold);
    const [provisions, setProvisions] = useState(INITIAL_PROFILE_DATA.provisions);
    const [items, setItems] = useState(INITIAL_PROFILE_DATA.items);
    const [weapons, setWeapons] = useState(INITIAL_PROFILE_DATA.weapons);
    const [combats, setCombats] = useState(INITIAL_PROFILE_DATA.combats);
    const [notes, setNotes] = useState(INITIAL_PROFILE_DATA.notes);
    const [heptagram, setHeptagram] = useState(INITIAL_PROFILE_DATA.heptagram);
    const [history, setHistory] = useState(INITIAL_PROFILE_DATA.history);

    const applyProfileData = useCallback((data) => {
        if (!data) return;
        setSkill(data.skill || INITIAL_PROFILE_DATA.skill);
        setStamina(data.stamina || INITIAL_PROFILE_DATA.stamina);
        setLuck(data.luck || INITIAL_PROFILE_DATA.luck);
        setGold(data.gold ?? 0);
        setProvisions(data.provisions ?? 0);
        setItems(data.items || []);
        setWeapons(data.weapons || []);
        setCombats(data.combats || []);
        setNotes(data.notes || '');
        setHeptagram(data.heptagram || Array(7).fill(''));
        setHistory(data.history || []);
    }, []);

    const loadGame = useCallback(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const { profiles: savedProfiles, activeId: savedActiveId } = JSON.parse(saved);
                setProfiles(savedProfiles || []);
                const idToLoad = savedActiveId || (savedProfiles?.length > 0 ? savedProfiles[0].id : null);

                if (idToLoad) {
                    const profile = savedProfiles.find(p => p.id === idToLoad);
                    if (profile) {
                        applyProfileData(profile.data);
                        setActiveId(idToLoad);
                    }
                }
            } else {
                const defaultId = Date.now();
                const newProfiles = [{ id: defaultId, name: 'Aventure 1', data: { ...INITIAL_PROFILE_DATA } }];
                setProfiles(newProfiles);
                setActiveId(defaultId);
                applyProfileData(INITIAL_PROFILE_DATA);
            }
        } catch (e) {
            console.error("Failed to load", e);
        } finally {
            setIsLoaded(true);
        }
    }, [applyProfileData]);

    const getActiveData = useCallback(() => {
        return {
            skill, stamina, luck, gold, provisions, items, weapons, combats, notes, heptagram, history
        };
    }, [skill, stamina, luck, gold, provisions, items, weapons, combats, notes, heptagram, history]);

    useEffect(() => {
        loadGame();
    }, [loadGame]);

    useEffect(() => {
        if (!isLoaded || !activeId) return;
        const currentData = getActiveData();
        setProfiles(prev => prev.map(p => p.id === activeId ? { ...p, data: currentData } : p));
    }, [skill, stamina, luck, gold, provisions, items, weapons, combats, notes, heptagram, history, activeId, isLoaded, getActiveData]);

    useEffect(() => {
        if (!isLoaded) return;
        const state = { profiles, activeId };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [profiles, activeId, isLoaded]);

    // Profile Actions
    const addProfile = (name) => {
        const id = Date.now();
        const newProfile = { id, name, data: { ...INITIAL_PROFILE_DATA } };
        setProfiles(p => [...p, newProfile]);
        setActiveId(id);
        applyProfileData(INITIAL_PROFILE_DATA);
    };

    const switchProfile = (id) => {
        if (id === activeId) return;
        const profile = profiles.find(p => p.id === id);
        if (profile) {
            setActiveId(id);
            applyProfileData(profile.data);
        }
    };

    const deleteProfile = (id) => {
        if (profiles.length <= 1) {
            alert("Vous devez garder au moins une aventure.");
            return;
        }
        if (window.confirm("Cette aventure sera définitivement perdue. Supprimer ?")) {
            const filtered = profiles.filter(p => p.id !== id);
            setProfiles(filtered);
            if (id === activeId) {
                const next = filtered[0];
                setActiveId(next.id);
                applyProfileData(next.data);
            }
        }
    };

    const renameProfile = (id, newName) => {
        setProfiles(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p));
    };

    // Game Actions
    const rollNewChar = (silent = false) => {
        const doRoll = () => {
            const s = d6() + 6;
            const st = d6() + d6() + 12;
            const l = d6() + 6;
            applyProfileData({
                ...INITIAL_PROFILE_DATA,
                skill: { init: s, cur: s },
                stamina: { init: st, cur: st },
                luck: { init: l, cur: l }
            });
        };
        if (!silent) {
            if (window.confirm("Effacer cette aventure et relancer les dés ?")) {
                doRoll();
            }
        } else { doRoll(); }
    };

    const modStat = (statName, val) => {
        if (statName === 'Skill') setSkill(p => ({ ...p, cur: Math.min(p.init, p.cur + val) }));
        if (statName === 'Stamina') setStamina(p => ({ ...p, cur: Math.min(p.init, p.cur + val) }));
        if (statName === 'Luck') setLuck(p => ({ ...p, cur: Math.min(p.init, p.cur + val) }));
    };

    const testLuck = () => {
        if (luck.cur <= 0) {
            alert("Vous n'avez plus de chance !");
            return false;
        }
        const r = d6() + d6();
        const success = r <= luck.cur;
        setLuck(p => ({ ...p, cur: Math.max(0, p.cur - 1) }));
        return { success, roll: r, currentLuck: luck.cur };
    };

    const modGold = (v) => setGold(p => Math.max(0, p + v));
    const modProv = (v) => setProvisions(p => Math.max(0, p + v));

    const addItem = (name) => {
        if (items.length + weapons.length >= 10) {
            alert("10 objets maximum.");
            return false;
        }
        setItems(p => [...p, { id: Date.now(), name }]);
        return true;
    };
    const removeItem = (id) => setItems(p => p.filter(x => x.id !== id));

    const addWeapon = (name, pot) => {
        if (items.length + weapons.length >= 10) {
            alert("10 objets maximum.");
            return false;
        }
        setWeapons(p => [...p, { id: Date.now(), name, pot: parseInt(pot), val: -parseInt(pot) }]);
        return true;
    };
    const improveWeapon = (id) => {
        setWeapons(p => p.map(w => w.id === id ? { ...w, val: Math.min(w.pot, w.val + 1) } : w));
    };
    const removeWeapon = (id) => setWeapons(p => p.filter(x => x.id !== id));

    const addCombat = () => setCombats(p => [...p, { id: Date.now(), enemy: '', skill: 0, stam: 0, dead: false }]);
    const updateCombat = (id, field, val) => setCombats(p => p.map(c => c.id === id ? { ...c, [field]: val } : c));
    const toggleCombatDead = (id) => setCombats(p => p.map(c => c.id === id ? { ...c, dead: !c.dead } : c));
    const removeCombat = (id) => setCombats(p => p.filter(c => c.id !== id));
    const logCombat = (enemyName, enemySkill, enemyStamina, result) => {
        setCombats(p => [...p, {
            id: Date.now(),
            enemy: enemyName,
            skill: enemySkill,
            stam: 0,
            dead: result === 'victory',
            result: result
        }]);
    };

    const updateHeptagram = (idx, val) => {
        const h = [...heptagram];
        h[idx] = val;
        setHeptagram(h);
    };

    const addHistoryEntry = (chap, tags, notes) => {
        setHistory(p => [...p, { id: Date.now(), chap, tags, notes }]);
    };
    const removeHistoryEntry = (id) => setHistory(p => p.filter(h => h.id !== id));
    const clearHistory = () => setHistory([]);

    const value = {
        profiles, activeId, addProfile, switchProfile, deleteProfile, renameProfile,
        skill, stamina, luck, gold, provisions, items, weapons, combats, notes, heptagram, history,
        isLoaded,
        rollNewChar, modStat, testLuck, modGold, modProv,
        addItem, removeItem, addWeapon, improveWeapon, removeWeapon,
        addCombat, updateCombat, toggleCombatDead, removeCombat, logCombat,
        setNotes, updateHeptagram,
        addHistoryEntry, removeHistoryEntry, clearHistory
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => useContext(GameContext);
