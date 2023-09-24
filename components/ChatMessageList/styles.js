import styled from "styled-components";
import media from 'styled-media-query'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: scroll;
  background: white;
`

export const MessageBox = styled.div`
  padding: 6px 6px;
`

export const PersonName = styled.p`
  color: #808080;
  margin-bottom: 0.2rem;
  font-size: 10px;

  ${media.greaterThan('medium')`
    font-size: 12px;
  `}
`

export const Message = styled.p`
  display: inline;
  font-size: 12px;
  border-radius: 8px;
  background-color: #3364ff;
  color: #fafafa;
  padding: 0 8px;

  ${media.greaterThan('medium')`
    font-size: 16px;
  `}
`
