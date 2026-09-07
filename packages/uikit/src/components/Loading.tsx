import React from 'react';
import styled from 'styled-components';

const Spinner = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 32px;
    color: ${props => props.theme.textSecondary || '#8a95a5'};
`;

export const Loading: React.FC = () => <Spinner>Loading...</Spinner>;
