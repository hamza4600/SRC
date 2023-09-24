import { forwardRef } from 'react'
import SlickSlider from 'react-slick'
import * as S from './styles'

const Slider = ({ children, settings }, ref ) => (
  <S.Wrapper>
    <SlickSlider ref={ref} {...settings}>
      {children}
    </SlickSlider>
  </S.Wrapper>
)

export default forwardRef(Slider)