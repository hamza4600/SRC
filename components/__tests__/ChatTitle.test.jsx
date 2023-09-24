import { render, screen } from '@testing-library/react';
import ChatTitle from '../ChatTitle/ChatTitle';

describe('ChatTitle', () => {
  it("should render title correctly", () => {
    const title = "Fake title"

    render(<ChatTitle title={title} />)

    expect(screen.getByText(title)).toBeInTheDocument();
  })
})