import React, { Suspense } from 'react';
import { render, screen } from '@testing-library/react'

import DynamicShowroom from "../DynamicShowroom/DynamicShowroom"

jest.mock('../ModelView/ModelView', () => ({
  __esModule: true,
  default: function Mock() { return <div data-testid="Mock Model View" /> }
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ roomId: 'entrance' }),
}))

jest.mock('@react-three/fiber', () => ({
  ...jest.requireActual('@react-three/fiber'),
  useThree: () => ({ camera: "", position: "" })
}))

jest.mock('@react-three/drei', () => ({
  ...jest.requireActual('@react-three/drei'),
  useGLTF: () => jest.fn()
}))

const createSubject = () => {
  const apiData = {
    dynamicShowroom: "",
    initialPosition: [0, 1, 4],
    initialRotation: [0, 0, 0],
    name: "Dynamic Virtual Showroom",
    models: [
      { id: "glove", url: "" },
      { id: "shirt", url: "" }
    ],
    tenants: [],
    type: "DM",
    rooms: [
      {
        id: "entrance",
        initialPosition: [0, 1, 4],
        initialRotation: [0, 0, 0],
        models: [
          { id: "glove", position: [-0.75, 1, -1.5], scale: "0.3" },
          { id: "shirt", position: [0.1, 1, -1.5 ], scale: 1 }
        ]
      },
      {
        id: "main-room",
        initialPosition: [0, 1, 4],
        initialRotation: [0, 0, 0],
        models: [
          { id: "glove", position: [-0.75, 1, -1.5], scale: "0.3" },
          { id: "shirt", position: [0.1, 1, -1.5 ], scale: 1}
        ]
      }
    ]
  }

  return { apiData }
}

describe("DynamicShowroom", () => {
  it("should render dynamic showroom with models", async () => {
    const { apiData } = createSubject();


    jest.spyOn(React, "useEffect").mockImplementationOnce(() => jest.fn());

    render(
      <Suspense fallback={null}>
        <DynamicShowroom apiData={apiData} />
      </Suspense>
    )
    
  })
})