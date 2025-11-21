import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="mb-0 text-center p-4" style={{background:"#0065a4"}}>
        <div className="d-flex align-items-center justify-content-center">
          <div className="col-md-6">
            <p className="mb-3 mb-md-0 text-light">Designed by 
              <a href="https://dyocense.us" className="text-decoration-none text-light" target="_blank" rel="noreferrer"> DyoCense</a>
            </p>
            <p className="mb-3 mb-md-0 text-light">Copyright © 2025. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
