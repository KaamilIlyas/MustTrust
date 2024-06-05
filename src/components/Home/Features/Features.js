import React from 'react';
import './Features.css';
import { data } from '../../../data/data'
import FeaturesItem from '../FeaturesItem/FeaturesItem';
import online from '../../../assets/online-world.png'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

export default function Features() {
    const item = data.serve.map((item, index) => {
        return (
            <div className="col-lg-4 col-md-4 col-sm-12 services__items mt-3" key={index}>
                <FeaturesItem title={item.title} text={item.text} icon={item.icon} index={index}/>
            </div>
        )
    })
    return (      

        <section id="services1" className="services">



<div id='services' className="services__second-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 services__second-section__left">
                            <h3 className="service-second-section-title">Welcome to our Trust-Based Rating System!</h3>
                            <p className="service-second-section-subtitle">Get insights into product sentiment and aspects with just a URL.</p>
                            <ul>
                                <li>Our system analyzes reviews to provide valuable insights.</li>
                                <li>Transforming online experiences with modern design and engagement.</li>
                                <li>Empowering consumers with trust-driven ratings.</li>
                                <li>Join us in our mission to enhance trust and transparency in the online marketplace</li>
                            </ul>
                            {/* <button>Learn More <FontAwesomeIcon icon={faArrowRight} /></button> */}
                        </div>
                        <div className="col-md-6">
                            <div className="services__section-image">
                                <img src={online} alt="Online" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            


            <div id="features" className="container services__first-section">
                <div className="row">
                    <div className="col-lg-12 col-md-12 text-center">
                        <h2>FEATURES</h2>
                        <div className="section-title-border"></div>
                        <p className="par pt-4">
                        Unlock the potential of our System, where different features are available that users can explore. 
                        </p>
                    </div>
                </div>
                <div className="row mt-4 text-center">
                    {item}
                </div>
            </div>          
        </section>
    );
}
