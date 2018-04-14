import React from 'react'
import FAQ from '../pages/faq/faq'
import Results from '../pages/results/results'
import { ScreenContext } from '../contexts/screen_context';

export default props => (
  <ScreenContext.Consumer>
    {screen => (
      <div className="screen">
        <div className="subNav">

          <div
            className={screen.subScreenIndex === 1 ? "subNav-item results active-subNav" : "subNav-item results"}
            onClick={screen.Results}>
            <h3 className="subScreen1">Results</h3>
          </div>

          <div className ="subNav-item spacerOne"></div>

          <div
            className={screen.subScreenIndex === 2 ? "subNav-item play active-subNav" : "subNav-item play"}
            onClick={screen.Play}>
            <h3 className="subScreen2">Play!</h3>
          </div>

          <div className ="subNav-item spacerTwo"></div>

          <div
            className={screen.subScreenIndex === 3 ? "subNav-item help active-subNav" : "subNav-item help"}
            onClick={screen.FAQ}>
            <h3 className="subScreen3">FAQ</h3>
          </div>
        </div>

        <div className="subcontent">

          {screen.subScreenIndex === 1 &&
            <Results
              screenIndex={screen.screenIndex}
              subScreenIndex={screen.subScreenIndex} />
          }

          {screen.subScreenIndex === 2 &&
            <div>
              {props.children}
            </div>
          }

          {screen.subScreenIndex === 3 &&
            <FAQ
              screenIndex={screen.screenIndex}
              subScreenIndex={screen.subScreenIndex} />
          }
        </div>

    </div>
    )}
  </ScreenContext.Consumer>
)