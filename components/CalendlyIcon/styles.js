import styled from 'styled-components'
import media from 'styled-media-query'

export const Wrapper = styled.div`
  a {
    background-color: #fff;
    border: none;
    color: #757575;
    
    &:hover {
      background-color: #fff;
    }
  }
`

export const CalendlyIconWrapper = styled.div`
  display: block;

  svg {
    ${media.greaterThan('991px')`
      display: none;
    `}
  }
`

export const CalendlyMessage = styled.span`
  display: none;

  ${media.greaterThan('991px')`
    display: block;
  `}
`