import styled from 'styled-components';

export const Button = styled.button<{
    primary?: boolean;
    secondary?: boolean;
    flat?: boolean;
    fullWidth?: boolean;
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
}>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    width: ${props => (props.fullWidth ? '100%' : 'auto')};
    background-color: ${props =>
        props.primary
            ? (props.theme.buttonPrimaryBackground || '#0088cc')
            : props.secondary
            ? (props.theme.buttonSecondaryBackground || 'rgba(255, 255, 255, 0.1)')
            : 'transparent'};
    color: ${props =>
        props.primary
            ? '#ffffff'
            : props.secondary
            ? (props.theme.textPrimary || '#ffffff')
            : (props.theme.textPrimary || '#ffffff')};
    opacity: ${props => (props.disabled || props.loading ? 0.6 : 1)};
    pointer-events: ${props => (props.disabled || props.loading ? 'none' : 'auto')};
    transition: background-color 0.15s ease, opacity 0.15s ease;
`;
