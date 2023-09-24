import styled, { css, keyframes } from "styled-components";

export const SnackbarContainer = styled.div`
  ${({ isOpen }) => css`
    position: fixed;
    width: 600px;
    height: 72px;
    background: #000000;
    border-radius: 8px;
    left: 50%;
    transform: translateX(-50%);
    bottom: 60px;
    font-weight: 400;
    font-size: 18px;
    color: white;
    padding-left: 22px;
    padding-right: 22px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: visibility 1s linear;
    ${!isOpen && fadeOut()}
  `}
`

const fadeOutAnimation = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

const fadeOut = () => css`
  animation: ${fadeOutAnimation} 0.6s linear forwards;
`;
