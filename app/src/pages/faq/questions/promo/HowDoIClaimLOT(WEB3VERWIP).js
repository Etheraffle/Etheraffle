import React from 'react'
import LOT from '../../../../components/lot'
import Button from '../../../saturdayraffle/promo/redeemButton'
import loadingIcon from '../../../../images/loadingIconGrey.svg'
import getNumEntries from '../../../saturdayraffle/promo/web3/getNumEntries'

export default class HowDoIClaimLOT extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            mounted: false,
            entries: null
        }
        this.getEntries = this.getEntries.bind(this)
    }

    componentDidMount() {
        this.setState({mounted: true})
        this.getEntries()
    }

    componentWillunmount() {
        this.setState({mounted: false})
    }

    getEntries() {
        return getNumEntries()
        .then(entries => {
            if (this.state.mounted) this.setState({entries: entries})
        }).catch(err => {
            if (this.state.mounted) this.setState({entries: 'Error'})
        })
    }

    render() {
        return(
            <div>
                {/* No eth connection/locked */}
                {(window.ethAdd === null || window.ethAdd === undefined || this.state.entries === null || this.state.entries === 'Error') &&
                    <p className='justify'>
                        Explain how to redeem etc and to use an eth enabled broswer to do so.
                    </p>
                }
                {(window.ethAdd !== null && window.ethAdd !== undefined) &&
                    <div>
                    {/* Eth enabled but no entries */}
                    {this.state.entries === 0 &&
                        <p className='justify'>
                            Explain claiming but also explain no entries yet so not eligible
                        </p>
                    }
                    {/* Eth enabled and entries */}
                    {this.state.entries > 0 &&
                        <div>
                            <p className='justify'>
                                You have entered x times meaning you are eligible for x LOT. You have until x time to enter more redeem your free LOT. You have until y time to redeem your free LOT. You can only redeem ONCE per week, so enter as many times are you want to before making your redemption.
                            </p>
                            <Button screenIndex={this.props.screenIndex} entries={this.state.entries}s />
                        </div>
                    }
                    {/* Eth enabled but error getting entries. */}
                    {this.state.entries === 'Error' &&
                        <p className='justify'>
                            Explain redemption but can't get number of entries for some reason
                        </p>
                    }
                    </div>
                }

            </div>
        )
    }
}
