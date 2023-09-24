import { Button } from 'react-bootstrap';
import { Calendar } from 'react-bootstrap-icons';
import * as S from './styles'

export default function CalendlyIcon({ calendlyId }) {
  if (!!calendlyId) {
    return (
      <S.Wrapper>
        <Button
          as="a"
          variant="light"
          href={`https://calendly.com/${calendlyId}`}
          target="_blank"
        >
          <S.CalendlyIconWrapper>
            <Calendar className="calendar-icon" />
          </S.CalendlyIconWrapper>
          <S.CalendlyMessage>Calendar</S.CalendlyMessage>
        </Button>
      </S.Wrapper>
    )
  }

  return null;
}
