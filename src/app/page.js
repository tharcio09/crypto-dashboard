/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect } from "react"

export default function HomePage() {

    const [coins, setCoins] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {

        const fetchCoins = async () => {

            setLoading(true);
            setError(null);

            try {
                const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1");

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
                }

                const data = await response.json();
                setCoins(data);

            } catch (error) {
                console.error("Erro detalhado ao buscar moedas:", error);
                setError(error.message);
                setCoins([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCoins();

    }, []);

    const filteredCoins = coins.filter(coin => 
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    let content;
    
    if (loading) {
        content = <p className="text-center text-gray-400">Carregando moedas...</p>;
    } else if (error) {
        content = <p className="text-center text-red-500">Erro ao buscar dados: {error}</p>;
    } else if (filteredCoins.length === 0) {
        content = <p className="text-center text-gray-500">Nenhuma moeda encontrada.</p>;
    } else {
        content = (
            <div>
                <h2 className="text-xl font-semibold mb-6 text-center text-white">Top 10 Criptomoedas</h2>
                <ul className="space-y-4">
                    {filteredCoins.map((coin, index) => (
                        <li
                            key={coin.id}
                            className="flex items-center justify-between bg-gray-800 rounded-lg p-4 shadow-md"
                        >
                            <div className="flex items-center">
                                <img
                                    className="w-8 h-8 mr-3 rounded-full"
                                    src={coin.image}
                                    alt={coin.name}
                                />
                                <div>
                                    <span className="font-medium text-white">{coin.name}</span>
                                    <span className="ml-2 text-sm text-gray-400 uppercase">{coin.symbol}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="font-semibold text-white">
                                    ${coin.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-10">Crypto Dashboard</h1>
                <input
                className="p-2 bg-gray-700 rounded text-white mb-6 w-full border border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 outline-none"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar moeda por nome ou símbolo..."
                />

                {content}
            </div>
        </main>
    );
}