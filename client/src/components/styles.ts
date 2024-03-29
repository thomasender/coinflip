import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        background-color: ${({ theme }) => theme.colors.background};
        color: ${({ theme }) => theme.colors.text};
        font-family: 'Roboto', sans-serif;
        height: 100vh;
    }

    #root {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        overflow-y: scroll;
    }

    a {
        color: ${({ theme }) => theme.colors.text};
    }

    .avatar {
        border-radius: 50%;
        width: 100px;
        height: 100px;
        margin-bottom: 12px;
    }

    .data-input-wrapper {
        width: 100%;
        max-width: 500px;
    }

    .contract-data {
        margin-top: 12px;
        width: 100%;
    }
`;


export const AppFrame = styled.div`
  width: 100%;
  max-width: 75vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  @media (min-width: 768px) {
    gap: 24px;
  }
`

export const Button = styled.button`
    display: flex;
    flex-flow: row;
    gap: 12px;
    align-items: center;
    background-color: transparent;
    border: 2px solid ${({ theme }) => theme.colors.accent};
    border-radius: 5px;
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;
    font-size: 1.5rem;
    font-weight: 700;
    padding: 0.5rem 1rem;
    transition: all 0.2s ease-in-out;

    position: relative; // Add this to position the tooltip

    // A tooltip to show when the button is disabled
    &::after {
        content: "Not now!";
        display: none;
        position: absolute;
        background-color: black;
        color: white;
        padding: 5px;
        border-radius: 5px;
        bottom: 100%; 
        left: 50%; 
        transform: translateX(-50%); 
        white-space: nowrap;
    }

    // Show the tooltip on hover
    &:disabled:hover::after {
        display: block;
    }

    &:hover {
        svg {
            fill: white;
        }
    }

    &:hover:not(:disabled) {
        background-color: ${({ theme }) => theme.colors.accent};
        color: black;
    }

    &:disabled:hover {
        border: 2px solid ${({ theme }) => theme.colors.error};
        cursor: not-allowed;
        svg {
            fill: ${({ theme }) => theme.colors.error};
        }
    }
`;

export const FlexRowCenter = styled.div`
    width: 100%;
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 4px;
`;

export const FlexColCenter = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
`;

export const InfoBox = styled(FlexColCenter)`
    width: 100%;
    min-width: 320px;
    max-width: 540px;
    padding: 12px;
`

export const InfoBoxBordered = styled(InfoBox)`
    border-radius: 12px;
    border: 2px solid ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 12px ${({ theme }) => theme.colors.accent};
`

export const FlexColStart = styled.div`
    align-items: start;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
`;

export const DescriptionWrapper = styled(FlexColStart)`
    gap: 6px;
`

export const H1 = styled.h1`
    font-size: 1.4rem;
    margin: 0;
    text-align: center;
    @media (min-width: 768px) {
        font-size: 2rem;
    }
`

export const P = styled.p`
    margin: 0;
    text-align: center;
    font-size: 0.8rem;
    @media (min-width: 768px) {
        font-size: 1rem;
    }
`

export const PSmall = styled(P)`
    font-size: 0.5rem;
    @media (min-width: 768px) {
        font-size: 0.8rem;
    }
`

export const ErrorMessage = styled.p`
    color: white;
    font-size: 1rem;
    margin: 0;
    text-align: start;
    padding: 12px;
    border-radius: 5px;
    background-color: ${({ theme }) => theme.colors.error};
`

export const FundersList = styled(FlexColCenter)`
    margin-top: 12px;
    padding: 12px;
    border-radius: 5px;
    background-color: transparent;
    border: 2px solid ${({ theme }) => theme.colors.text};
`

export const NotificationContainer = styled.div`
    position: fixed;
    top: 18%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    padding: 2rem;
    border-radius: 0.5rem;
    border: 2px solid ${({ theme }) => theme.colors.accent};
    background-color: ${({ theme }) => theme.colors.background};
    box-shadow: 0 0 1rem 0.5rem ${({ theme }) => theme.colors.accent};

    .thank-you-pic {
        width: 100px;
        margin-bottom: -32px;
        margin-top: -20px;
    }
`

export const ContainerCloseButton = styled.button`
    position: absolute;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    top: -12px;
    right: 0px;
    padding: 0.5rem;
    background-color: ${({ theme }) => theme.colors.background};
    border: none;
    border-radius: 0.5rem;
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;
    box-shadow: 0 0 1rem 0.5rem ${({ theme }) => theme.colors.text};

    @media (min-width: 510px) {
        right: -16px;
    }
`