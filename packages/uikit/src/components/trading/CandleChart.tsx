import React, { useState, useMemo, useRef, useEffect } from 'react';
import styled from 'styled-components';

const ChartWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 16px;
    padding: 12px;
    box-sizing: border-box;
    position: relative;
    user-select: none;
`;

const ChartHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    flex-wrap: wrap;
    gap: 8px;
`;

const TimeframeContainer = styled.div`
    display: flex;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    padding: 2px;
    gap: 2px;
`;

const TimeframeBtn = styled.button<{ $active: boolean }>`
    background: ${props => (props.$active ? 'rgba(255, 255, 255, 0.15)' : 'transparent')};
    color: ${props => (props.$active ? props.theme.textPrimary || '#ffffff' : props.theme.textSecondary || '#8a95a5')};
    border: none;
    border-radius: 6px;
    padding: 4px 8px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
        color: ${props => props.theme.textPrimary || '#ffffff'};
    }
`;

const PriceLegend = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
`;

const CurrentPriceLabel = styled.span<{ $up: boolean }>`
    font-weight: 700;
    font-size: 14px;
    color: ${props => (props.$up ? '#34c759' : '#ff3b30')};
`;

const HighLowText = styled.span`
    font-size: 11px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
`;

const SvgContainer = styled.div`
    width: 100%;
    height: 180px;
    position: relative;
    cursor: crosshair;
`;

export interface Candle {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
}

interface CandleChartProps {
    basePrice?: number;
    currentPrice?: number;
    onPriceUpdate?: (price: number) => void;
}

// Deterministic pseudo-random number generator using seed
function seededRandom(seed: number) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

export const CandleChart: React.FC<CandleChartProps> = ({
    basePrice = 5.65,
    currentPrice = 5.65
}) => {
    const [timeframe, setTimeframe] = useState<'1M' | '5M' | '15M' | '1H' | '1D'>('1M');
    const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(340);
    const height = 180;

    useEffect(() => {
        if (!containerRef.current) return;
        const updateWidth = () => {
            if (containerRef.current) {
                setWidth(containerRef.current.clientWidth || 340);
            }
        };
        updateWidth();
        const observer = new ResizeObserver(updateWidth);
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // Generate deterministic candles for the selected timeframe
    const candles = useMemo<Candle[]>(() => {
        const count = 28;
        const result: Candle[] = [];
        let price = basePrice * 0.985;
        const now = Math.floor(Date.now() / 60000) * 60000;
        const stepMs =
            timeframe === '1M'
                ? 60000
                : timeframe === '5M'
                ? 300000
                : timeframe === '15M'
                ? 900000
                : timeframe === '1H'
                ? 3600000
                : 86400000;

        const tfSeed =
            timeframe === '1M' ? 1 : timeframe === '5M' ? 2 : timeframe === '15M' ? 3 : timeframe === '1H' ? 4 : 5;

        for (let i = 0; i < count; i++) {
            const time = now - (count - 1 - i) * stepMs;
            const seed = Math.floor(time / stepMs) + tfSeed;
            const delta = (seededRandom(seed) - 0.485) * (basePrice * 0.012);
            const open = price;
            let close = open + delta;

            // Make sure last candle matches the currentPrice
            if (i === count - 1) {
                close = currentPrice;
            }

            const high = Math.max(open, close) + seededRandom(seed + 1) * (basePrice * 0.006);
            const low = Math.min(open, close) - seededRandom(seed + 2) * (basePrice * 0.006);

            result.push({
                time,
                open: Number(open.toFixed(4)),
                high: Number(high.toFixed(4)),
                low: Number(low.toFixed(4)),
                close: Number(close.toFixed(4))
            });

            price = close;
        }
        return result;
    }, [basePrice, currentPrice, timeframe]);

    const { minPrice, maxPrice } = useMemo(() => {
        let min = Infinity;
        let max = -Infinity;
        candles.forEach(c => {
            if (c.low < min) min = c.low;
            if (c.high > max) max = c.high;
        });
        const padding = (max - min) * 0.1 || 0.05;
        return {
            minPrice: min - padding,
            maxPrice: max + padding
        };
    }, [candles]);

    const candleWidth = Math.max(4, Math.floor((width - 40) / candles.length) - 3);

    const getY = (val: number) => {
        const ratio = (val - minPrice) / (maxPrice - minPrice || 1);
        return height - 20 - ratio * (height - 40);
    };

    const isPriceUp = currentPrice >= (candles[0]?.open || currentPrice);

    return (
        <ChartWrapper>
            <ChartHeader>
                <PriceLegend>
                    <CurrentPriceLabel $up={isPriceUp}>
                        ${(hoveredCandle ? hoveredCandle.close : currentPrice).toFixed(4)}
                    </CurrentPriceLabel>
                    <HighLowText>
                        H: ${maxPrice.toFixed(2)} L: ${minPrice.toFixed(2)}
                    </HighLowText>
                </PriceLegend>

                <TimeframeContainer>
                    {(['1M', '5M', '15M', '1H', '1D'] as const).map(tf => (
                        <TimeframeBtn
                            key={tf}
                            $active={timeframe === tf}
                            onClick={() => setTimeframe(tf)}
                        >
                            {tf}
                        </TimeframeBtn>
                    ))}
                </TimeframeContainer>
            </ChartHeader>

            <SvgContainer ref={containerRef}>
                <svg
                    width={width}
                    height={height}
                    onMouseLeave={() => setHoveredCandle(null)}
                    style={{ overflow: 'visible' }}
                >
                    {/* Grid lines */}
                    <line
                        x1={0}
                        y1={getY(maxPrice)}
                        x2={width}
                        y2={getY(maxPrice)}
                        stroke="rgba(255,255,255,0.06)"
                        strokeDasharray="4 4"
                    />
                    <line
                        x1={0}
                        y1={getY((maxPrice + minPrice) / 2)}
                        x2={width}
                        y2={getY((maxPrice + minPrice) / 2)}
                        stroke="rgba(255,255,255,0.06)"
                        strokeDasharray="4 4"
                    />
                    <line
                        x1={0}
                        y1={getY(minPrice)}
                        x2={width}
                        y2={getY(minPrice)}
                        stroke="rgba(255,255,255,0.06)"
                        strokeDasharray="4 4"
                    />

                    {/* Candlesticks */}
                    {candles.map((c, idx) => {
                        const x = 10 + idx * ((width - 20) / candles.length) + candleWidth / 2;
                        const isUp = c.close >= c.open;
                        const bodyTop = getY(Math.max(c.open, c.close));
                        const bodyBottom = getY(Math.min(c.open, c.close));
                        const bodyHeight = Math.max(2, bodyBottom - bodyTop);
                        const wickTop = getY(c.high);
                        const wickBottom = getY(c.low);
                        const color = isUp ? '#34c759' : '#ff3b30';

                        return (
                            <g
                                key={idx}
                                onMouseEnter={() => setHoveredCandle(c)}
                                style={{ cursor: 'pointer' }}
                            >
                                {/* Wick */}
                                <line
                                    x1={x}
                                    y1={wickTop}
                                    x2={x}
                                    y2={wickBottom}
                                    stroke={color}
                                    strokeWidth="1.5"
                                />
                                {/* Candle Body */}
                                <rect
                                    x={x - candleWidth / 2}
                                    y={bodyTop}
                                    width={candleWidth}
                                    height={bodyHeight}
                                    fill={color}
                                    rx={1.5}
                                />
                            </g>
                        );
                    })}

                    {/* Current Price Line */}
                    <line
                        x1={0}
                        y1={getY(currentPrice)}
                        x2={width}
                        y2={getY(currentPrice)}
                        stroke={isPriceUp ? '#34c759' : '#ff3b30'}
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                    />

                    {/* Pulsing indicator at right edge */}
                    <circle
                        cx={width - 6}
                        cy={getY(currentPrice)}
                        r={4}
                        fill={isPriceUp ? '#34c759' : '#ff3b30'}
                    />
                </svg>
            </SvgContainer>
        </ChartWrapper>
    );
};
