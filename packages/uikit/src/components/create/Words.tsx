import styled from 'styled-components';

export const WorldsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin: 16px 0;
`;

export const WorldNumber = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 14px;
    background: ${props => props.theme.fieldBackground || 'rgba(255, 255, 255, 0.06)'};
    border-radius: 12px;
    font-size: 15px;
    color: ${props => props.theme.textPrimary || '#ffffff'};

    &::before {
        content: attr(data-number);
        color: ${props => props.theme.textSecondary || '#8a95a5'};
        margin-right: 10px;
        font-size: 13px;
        min-width: 20px;
    }
`;
