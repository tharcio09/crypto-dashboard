
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';


export default function CoinDetailsPage() {
    const { id } = useParams(); 

    const [coinDetails, setCoinDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCoinDetails = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const url = `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
            const response = await fetch(url);
            if (!response.ok) {
                 if (response.status === 404) throw new Error('Moeda não encontrada');
                 if (response.status === 429) throw new Error('Muitas requisições. Tente novamente mais tarde.');
                 throw new Error(`Erro ao buscar dados da moeda (${response.status})`);
            }
            const data = await response.json();
            setCoinDetails(data);
        } catch (fetchError) {
            console.error("Erro ao buscar detalhes da moeda:", fetchError);
            setError(fetchError.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchCoinDetails();
    }, [id, fetchCoinDetails]);


    if (loading) { 
        return <div className="p-8 text-white text-center">Carregando...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-400 text-center">{error}</div>;
    }

    if (!coinDetails) {
        return <div className="p-8 text-gray-400 text-center">Dados da moeda não disponíveis.</div>;
    }

    return (
        <main className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="text-indigo-400 hover:text-indigo-300 mb-6 inline-block">&larr; Voltar para a lista</Link>

                <div className="p-6 bg-gray-800 rounded-lg shadow-md">
                    <div className="flex items-center mb-4">
                        <Image
                            src={coinDetails.image?.thumb || '/placeholder.png'} // Usar thumb ou small
                            alt={coinDetails.name || 'Ícone da moeda'}
                            width={40}
                            height={40}
                            className="mr-4 rounded-full"
                        />
                        <div>
                            <h1 className="text-3xl font-bold">{coinDetails.name}</h1>
                            <span className="text-lg text-gray-400 uppercase">{coinDetails.symbol}</span>
                        </div>
                    </div>

                    <div className="mb-4">
                        <span className="text-4xl font-bold">
                            ${coinDetails.market_data?.current_price?.usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })} {/* Aumentar casas decimais para moedas de baixo valor */}
                        </span>
                        <span className={`ml-3 text-lg font-semibold ${coinDetails.market_data?.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {coinDetails.market_data?.price_change_percentage_24h?.toFixed(2)}%
                        </span>
                        <span className="text-sm text-gray-500"> (24h)</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-6 border-t border-gray-700 pt-4">
                        <div><p className="text-gray-500">Capitalização</p><p className="font-medium">${coinDetails.market_data?.market_cap?.usd.toLocaleString() || 'N/A'}</p></div>
                        <div><p className="text-gray-500">Volume (24h)</p><p className="font-medium">${coinDetails.market_data?.total_volume?.usd.toLocaleString() || 'N/A'}</p></div>
                        <div><p className="text-gray-500">Máx. (24h)</p><p className="font-medium">${coinDetails.market_data?.high_24h?.usd.toLocaleString() || 'N/A'}</p></div>
                        <div><p className="text-gray-500">Mín. (24h)</p><p className="font-medium">${coinDetails.market_data?.low_24h?.usd.toLocaleString() || 'N/A'}</p></div>
                        <div><p className="text-gray-500">Rank</p><p className="font-medium">#{coinDetails.market_cap_rank || 'N/A'}</p></div>
                    </div>

                    {(coinDetails.description?.pt || coinDetails.description?.en) && (
                        <div>
                            <h2 className="text-xl font-semibold mb-2 border-t border-gray-700 pt-4">Sobre {coinDetails.name}</h2>
                            {!coinDetails.description?.pt && coinDetails.description?.en && (
                                <p className="text-sm text-yellow-500 italic mb-2">(Nota: Descrição fornecida em inglês, tradução não disponível.)</p>
                            )}
                            <div
                                className="text-gray-300 prose prose-invert max-w-none prose-a:text-indigo-400"
                                dangerouslySetInnerHTML={{ __html: coinDetails.description.pt || coinDetails.description.en }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}