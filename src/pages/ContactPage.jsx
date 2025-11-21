import React from "react";
const ContactPage = () => {
  return (
    <>
      <div className="container my-3 py-3">
        <h1 className="text-center">Contact Us</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-6 col-lg-6 col-sm-10 mx-auto">
            <div className="p-4 border rounded">
              <h5 className="mb-2">Head Quarters - United States Of America (MISSOURI)</h5>
              <p className="mb-1"><strong>DyoCense Inc.</strong></p>
              <p className="mb-1">83 Weldon Parkway</p>
              <p className="mb-1">Maryland Heights, MO 63043</p>
              <hr />
              <p className="mb-1">Email: <a href="mailto:sesha@dyocense.us">sesha@dyocense.us</a></p>
              <p className="mb-0">Phone: <a href="tel:+16363528569">636-352-8569</a></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
