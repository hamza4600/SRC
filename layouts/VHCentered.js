import './VHCentered.css'

const VHCentered = ({children}) => {
    return (
        <div id="vh-centered" className='border d-flex align-items-center justify-content-center'>
            <div>
                {children}
            </div>
        </div>
    )
}

export default VHCentered;