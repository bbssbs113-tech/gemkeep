import React from 'react';
import styled from 'styled-components';

const EmojiWrapper = styled.div<{ containerSize?: string | number }>`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    width: ${props => (typeof props.containerSize === 'number' ? `${props.containerSize}px` : props.containerSize || '40px')};
    height: ${props => (typeof props.containerSize === 'number' ? `${props.containerSize}px` : props.containerSize || '40px')};
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
`;

export const WalletEmoji: React.FC<{
    containerSize?: string | number;
    emoji?: string;
    size?: string | number;
}> = ({ containerSize, emoji = '👛' }) => {
    return <EmojiWrapper containerSize={containerSize}>{emoji}</EmojiWrapper>;
};
