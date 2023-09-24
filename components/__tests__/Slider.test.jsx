import { render, screen } from "@testing-library/react"
import { Button } from 'react-bootstrap';

import '../../../tests/match-media-mock';
import Slider from "../Slider/Slider";
import { modalSettings } from '../Slider/settings';

describe("Slider", () => {
  it("should render children correctly", () => {
    render(
      <Slider settings={modalSettings}>
        <Button>
          Fake button
        </Button>
      </Slider>
    )

    const button = screen.getByRole('button', { name: /fake button/i});

    expect(button).toBeInTheDocument();
  })
})