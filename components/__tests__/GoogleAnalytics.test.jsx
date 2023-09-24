import { render } from "@testing-library/react"
import GoogleAnalytics from '../GoogleAnalytics/GoogleAnalytics'
import ReactGA from 'react-ga';

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => ({
    pathname: "localhost:3000/fake/",
    search: "fake-search"
  })
}));

jest.mock("react-ga")

describe("GoogleAnalytics", () => {
  beforeEach(() => {
    ReactGA.testModeAPI.resetCalls();
  })

  it('should not send anything if no tracking ids are provided', () => {
    const googleAnalyticsSpy = jest.spyOn(ReactGA, "send")

    render(<GoogleAnalytics trackingIds={[]}/>);

    expect(googleAnalyticsSpy).not.toHaveBeenCalled();
  })

  it("should call send function", () => {
    const googleAnalyticsSpy = jest.spyOn(ReactGA, "send")
    const TRACKING_ID = process.env.REACT_APP_TRACKING_ID

    render(<GoogleAnalytics trackingIds={[TRACKING_ID]}/>);

    expect(googleAnalyticsSpy).toHaveBeenCalled();
  })

})