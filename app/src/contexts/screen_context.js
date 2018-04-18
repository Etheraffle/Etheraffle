import React from 'react'

export const ScreenContext = React.createContext()

export class ScreenProvider extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      screenIndex: 5,
      subScreenIndex: 2
    }
  }

  render() {
    return (
      <ScreenContext.Provider value={{
        screenIndex:    this.state.screenIndex,
        subScreenIndex: this.state.subScreenIndex,
        Instant:   () => this.setState({screenIndex: 1, subScreenIndex: 2}),
        Wednesday: () => this.setState({screenIndex: 3, subScreenIndex: 2}),
        Contact:   () => this.setState({screenIndex: 4, subScreenIndex: 2}),
        Saturday:  () => this.setState({screenIndex: 5, subScreenIndex: 2}),
        Results:   () => this.setState({subScreenIndex: 1}),
        Play:      () => this.setState({subScreenIndex: 2}),
        FAQ:       () => this.setState({subScreenIndex: 3})
      }} >
        {this.props.children}
      </ScreenContext.Provider>
    )
  }
}

