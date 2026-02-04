import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <>
      <footer className="fixed-bottom mb-0 p-1 text-center" style={{background:"#0065a4"}}>
        <p className="mb-0 text-light">Designed by 
          <a href="https://dyocense.us" className="text-decoration-none text-light" target="_blank" rel="noreferrer"> DyoCense</a>
        </p>
        <p className="mb-0 text-light">Copyright © {year}. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Footer;
