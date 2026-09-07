import React from 'react';
import styled from 'styled-components';

const CheckboxContainer = styled.label`
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    user-select: none;
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
    position: absolute;
    opacity: 0;
    height: 0;
    width: 0;
`;

const StyledCheckbox = styled.div<{ checked: boolean }>`
    width: 20px;
    height: 20px;
    border-radius: 6px;
    background: ${props => (props.checked ? (props.theme.buttonPrimaryBackground || '#0088cc') : 'transparent')};
    border: 2px solid ${props => (props.checked ? (props.theme.buttonPrimaryBackground || '#0088cc') : (props.theme.textSecondary || '#8a95a5'))};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
`;

const CheckIcon = () => (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
        <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const Checkbox: React.FC<{
    checked: boolean;
    onChange: (checked: boolean) => void;
    children?: React.ReactNode;
}> = ({ checked, onChange, children }) => {
    return (
        <CheckboxContainer>
            <HiddenCheckbox checked={checked} onChange={e => onChange(e.target.checked)} />
            <StyledCheckbox checked={checked}>{checked && <CheckIcon />}</StyledCheckbox>
            {children}
        </CheckboxContainer>
    );
};
