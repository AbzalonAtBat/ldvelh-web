import React, { useState } from 'react';
import { Menu, X, Shield, Book, Users, Swords } from 'lucide-react';

const Layout = ({ children, activeTab, onTabChange }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { id: 'character', label: "Feuille d'Aventure", icon: Shield },
        { id: 'history', label: 'Historique', icon: Book },
        { id: 'adventures', label: 'Mes Aventures', icon: Users },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#2b2b2b]">
            {/* Header */}
            <header className="bg-[#1a1a1a] border-b border-[#c5a059] p-4 flex justify-between items-center z-50 sticky top-0">
                <h1 className="text-[#f0e6d2] text-xl font-bold tracking-widest flex items-center gap-2">
                    <Book className="w-6 h-6 text-[#c5a059]" />
                    LOUP SOLITAIRE
                </h1>

                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden text-[#f0e6d2]"
                >
                    {isMenuOpen ? <X /> : <Menu />}
                </button>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-6">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onTabChange(item.id)}
                                className={`flex items-center gap-2 font-bold px-3 py-1 transition-colors ${activeTab === item.id ? 'text-[#8b0000] border-b-2 border-[#8b0000]' : 'text-[#f0e6d2] hover:text-[#c5a059]'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </header>

            {/* Mobile Drawer */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMenuOpen(false)}>
                    <div
                        className="w-64 h-full bg-[#f4e8d1] p-6 shadow-xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex flex-col gap-4 mt-8">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            onTabChange(item.id);
                                            setIsMenuOpen(false);
                                        }}
                                        className={`flex items-center gap-3 text-lg font-bold p-2 rounded ${activeTab === item.id ? 'bg-[#8b0000] text-[#f4e8d1]' : 'text-[#2c241b] hover:bg-[#e6d5b8]'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-[#2b2b2b] p-4 flex justify-center">
                <div className="w-full max-w-4xl vintage-container min-h-[80vh]">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
