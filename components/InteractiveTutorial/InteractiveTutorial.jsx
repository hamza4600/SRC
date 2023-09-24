import { Button } from 'react-bootstrap';
import '../../../node_modules/react-interactive-tutorials/dist/react-interactive-tutorials.css'
import { Nav } from 'react-bootstrap';
import {useCookies} from "react-cookie";
import { BsQuestionCircle } from 'react-icons/bs';
import { TUTORIALS } from '../../constants/tutorials';

import {
  registerTutorials,
  startTutorial,
} from 'react-interactive-tutorials'

registerTutorials(TUTORIALS);

const InteractiveTutorial = () => {
  const [cookie, setCookie] = useCookies(['tutorial_complete'])
 
  if (!cookie.tutorial_complete) {
    startTutorial('demo')
    setCookie('tutorial_complete', true)
  }
    return(
        <>
            <Nav.Link as={Button} className="btn btn-light nav-link-text" onClick={() => {
              startTutorial('demo')
            }}>Tutorial</Nav.Link>
            <Button variant="light" id="colour" className="btn btn-light nav-link-icon" onClick={() => {
                startTutorial('demo');
                }}>
                    <BsQuestionCircle />
            </Button>
        </>
       
    )
}

export default InteractiveTutorial;