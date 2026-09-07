import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
    width: 100%;
    padding: 14px 16px;
    border-radius: 12px;
    background: ${props => props.theme.fieldBackground || 'rgba(255, 255, 255, 0.06)'};
    border: 1px solid ${props => props.theme.fieldBorder || 'transparent'};
    color: ${props => props.theme.textPrimary || '#ffffff'};
    font-size: 16px;
    box-sizing: border-box;
    outline: none;

    &:focus {
        border-color: ${props => props.theme.buttonPrimaryBackground || '#0088cc'};
    }
`;

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = props => {
    return <StyledInput {...props} />;
};
