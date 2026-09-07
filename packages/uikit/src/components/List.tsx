import styled, { createGlobalStyle } from 'styled-components';

export const GlobalListStyle = createGlobalStyle`
  /* Global list style */
`;

export const ListBlock = styled.div`
    background-color: ${props => props.theme.backgroundContent || '#1c2430'};
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 16px;
    width: 100%;
`;

export const ListItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    cursor: pointer;
    border-bottom: 1px solid ${props => props.theme.separator || 'rgba(255, 255, 255, 0.08)'};
    &:last-child {
        border-bottom: none;
    }
`;

export const ListItemPayload = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;
