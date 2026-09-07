import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { CloseIcon } from '../Icon';

const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const slideUp = keyframes`
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
`;

const Overlay = styled.div<{ $closing?: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    animation: ${fadeIn} 0.2s ease-out forwards;
    opacity: ${props => (props.$closing ? 0 : 1)};
    transition: opacity 0.2s ease-out;
`;

const DrawerContainer = styled.div<{ $closing?: boolean }>`
    width: 100%;
    max-width: 500px;
    background: ${props => props.theme.backgroundPage || '#1c2430'};
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    padding: 12px 20px 28px 20px;
    box-sizing: border-box;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.3);
    animation: ${slideUp} 0.25s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
    transform: ${props => (props.$closing ? 'translateY(100%)' : 'translateY(0)')};
    transition: transform 0.2s ease-out;
`;

const DragHandle = styled.div`
    width: 36px;
    height: 4px;
    border-radius: 2px;
    background: ${props => props.theme.separatorCommon || 'rgba(255, 255, 255, 0.2)'};
    margin: 0 auto 16px auto;
`;

const HeaderRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
`;

const Title = styled.h3`
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: ${props => props.theme.textPrimary || '#ffffff'};
`;

const CloseButton = styled.button`
    background: rgba(255, 255, 255, 0.08);
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
    transition: background-color 0.15s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.16);
    }
`;

export interface BottomDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: React.ReactNode;
    children: React.ReactNode;
}

export const BottomDrawer: React.FC<BottomDrawerProps> = ({ isOpen, onClose, title, children }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [shouldRender, setShouldRender] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setIsClosing(false);
        } else if (shouldRender) {
            setIsClosing(true);
            const timer = setTimeout(() => {
                setShouldRender(false);
                setIsClosing(false);
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 200);
    };

    if (!shouldRender) return null;

    return (
        <Overlay $closing={isClosing} onClick={handleClose}>
            <DrawerContainer $closing={isClosing} onClick={e => e.stopPropagation()}>
                <DragHandle />
                {title && (
                    <HeaderRow>
                        <Title>{title}</Title>
                        <CloseButton onClick={handleClose}>
                            <CloseIcon size={18} />
                        </CloseButton>
                    </HeaderRow>
                )}
                {children}
            </DrawerContainer>
        </Overlay>
    );
};
