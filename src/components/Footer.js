import React from 'react';
import '../App.css';
function Footer() {
    return (
        <footer style={{ backgroundColor: '' }}>
            <div className="container">
                <div className="row footer-links font-weight-bold">
                    {/* <p className="footer-links font-weight-bold"> */}
                    <div className="col">
                        <a className="text-black " href="https://firstmatchcom.wpcomstaging.com/how-firstmatch-works/">
                            How FirstMatch Works
                        </a>
                    </div>
                    <div className="col">
                        <a className="text-black" href="https://firstmatchcom.wpcomstaging.com/implementing-firstmatch/">
                            Implementing FirstMatch
                        </a>
                    </div>
                    <div className="col">
                        <a className="text-black" href="https://firstmatchcom.wpcomstaging.com/firstmatch-report/">
                            FirstMatch Report
                        </a>
                    </div>
                    <div className="col">
                        <a className="text-black" href="https://firstmatchcom.wpcomstaging.com/firstmatch-savings/">
                            FirstMatch Savings
                        </a>
                    </div>
                    <div className="col">
                        <a className="text-black" href="https://firstmatchcom.wpcomstaging.com/pricing/">
                            Pricing
                        </a>
                    </div>
                    {/* </p> */}
                </div>
            </div>
        </footer>
    );
}

export default Footer;
