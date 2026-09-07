import styled from 'styled-components';

export const H2 = styled.h2`
    font-size: 24px;
    font-weight: 700;
    color: ${props => props.theme.textPrimary || '#ffffff'};
    margin: 0;
`;

export const Body1 = styled.p`
    font-size: 16px;
    color: ${props => props.theme.textPrimary || '#ffffff'};
    margin: 0;
`;

export const Body2 = styled.p`
    font-size: 14px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
    margin: 0;
`;

export const Label1 = styled.span`
    font-size: 16px;
    font-weight: 600;
    color: ${props => props.theme.textPrimary || '#ffffff'};
`;

export const Label2 = styled.span`
    font-size: 14px;
    font-weight: 500;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
`;
