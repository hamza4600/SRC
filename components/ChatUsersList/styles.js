import styled from "styled-components";
import media from 'styled-media-query';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: scroll;
  background: white;
`
export const Title = styled.span`
  padding-left: 6px;
  color: #000000;
  font-size: 1rem;
  font-weight: bold;
`

export const MessageBox = styled.div`
  padding: 6px 6px;
`

export const Message = styled.p`
  display: inline;
  font-size: 12px;
  padding: 0 8px;

  ${media.greaterThan('medium')`
    font-size: 16px;
  `}
`