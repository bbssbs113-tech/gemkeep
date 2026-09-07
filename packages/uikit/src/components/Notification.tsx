import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: flex-end;
    z-index: 1000;
`;

const Content = styled.div`
    background: ${props => props.theme.backgroundContent || '#1c2430'};
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    width: 100%;
    padding: 24px 16px;
    box-sizing: border-box;
    max-height: 80vh;
    overflow-y: auto;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
`;

const Title = styled.h3`
    margin: 0;
    font-size: 20px;
    color: ${props => props.theme.textPrimary || '#ffffff'};
`;

export const Notification: React.FC<{
    isOpen: boolean;
    handleClose: () => void;
    title?: string;
    children?: React.ReactNode;
}> = ({ isOpen, handleClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <Overlay onClick={handleClose}>
            <Content onClick={e => e.stopPropagation()}>
                {title && (
                    <Header>
                        <Title>{title}</Title>
                    </Header>
                )}
                {children}
            </Content>
        </Overlay>
    );
};
