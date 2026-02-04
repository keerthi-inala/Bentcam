import React from 'react'
const AboutPage = () => {
  return (
    <>
      <div className="container my-3 py-3">
        <h1 className="text-center">About Us</h1>
        <hr />
        <p className="lead text-center">
          Bentcam was established in 2009 in pursuit of manufacturing the most energy efficient 
          glass doors along with advanced composite & glass material products. Based in Izmir, 
          Turkey, we come together to manufacture glass doors, frames and special glass products 
          for use in the refrigeration industry. Our goal is to break away from pre-set market 
          concepts and to create the most state-of-the-art products by combining different 
          approaches and thought processes. Bentcam brand is built on a core philosophy that 
          emphasizes the best design, innovation and performance in energy systems on the market. 
          Consistently reflecting on potential future trends and lifestyle scenarios, we strive 
          to anticipate changing expectations of the market and the consumer and respond 
          accordingly while designing our collections. Bentcam brings together a group of 
          like-minded, young and vital generation to create a multi-disciplinary synergy. 
          With creative management systems and smart approaches, Bentcam is designed to make 
          a difference and become successful in our endeavors. In the pursuit of becoming one 
          of the leaders in this industry, Bentcam continues to improve constantly, perfecting 
          its quality.
        </p>
        <h2 className="text-center py-4">Our Goal</h2>
        <div className="row">
          <div className="col-md-4 col-sm-12 mb-3 px-3">
            <div className="card h-100">
              <div className="card-body" style={{ backgroundColor:'#917d5d', borderRadius:'5px' }}>
                <h4 className="card-title text-white">Quality</h4>
                <p className='text-white'>Here at Bentcam we know that that alone, good design will only take a brand so 
                  far. For products to consistently stand out with positive recognition, 
                  quality is a must. Establishing an effective quality control system that 
                  is applied to all levels of business from management, product quality and service.
                  In reaching this goal, we enrolled into the ISO 9001 certificate program as a 
                  first step. Bentcam is committed to ensuring that working conditions in our 
                  manufacturing plant is safe, workers are treated with respect and manufacturing 
                  processes are environmentally responsible. To show our responsibility and take 
                  it to a serious level, Bentcam has started the ISO 14001 environmental management 
                  standards to minimize the operations that negatively affect our environment.
                   Our efforts now as Bentcam focus on complying with OHSAS 18001 standards on 
                   workers health and safety.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-sm-12 mb-3 px-3">
            <div className="card h-100">
              <div className="card-body" style={{ backgroundColor:'#a08c6c', borderRadius:'5px'}}>
                <h4 className="card-title text-white">The Enviroment</h4>
                <p className='text-white'>Bentcam takes a complete product life-cycle approach to determine our 
                  environmental impact. Reducing our impact on the environment by improving 
                  our products is a priority for us as our goals are to deliver our customers 
                  with the best energy efficient solutions backed with environmentally friendly 
                  operations and technology. Bentcam design center aims to design products that 
                  are non- toxic, much lighter, thinner, compact while stringently optimizing 
                  material usage and remaining robust and durable. Furthermore, we work hard to 
                  come up with designs that require smaller packaging, that are energy efficient 
                  to their maximum potential and can be recycled after completing their life cycle.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-sm-12 mb-3 px-3">
            <div className="card h-100">
              <div className="card-body" style={{ backgroundColor:'#ad9979', borderRadius:'5px'}}>
                <h4 className="card-title text-white">R&D</h4>
                <p className='text-white'>Bentcam is always working to find new ways to make its products and services 
                  even better. It puts a lot of importance on R&D (research and development) studies,
                  in order to come up with products that are innovative and user-friendly. 
                  New product designs are created with the latest technology tools, 
                  which are often used in R&D Laboratories.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutPage