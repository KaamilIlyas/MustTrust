import React from 'react';
import './Banner.css'
import wave from '../../../assets/bg-pattern.png'

export default function Banner() {
            return (
                <section id='compare'>
                    <div className="banner">
                        <div className="banner__layout">
                            <div className="container">
                                <div className="row">
                                    <div className="col-12">
                                    <h2>Comparing Products</h2>
                                    <div className="section-title-border"></div>
                                    <p>Explore our intuitive comparison feature, helping you choose the best product based on trust score.</p>
                                    <a href="#comparing-product"> <button>Explore</button> </a>
                                    </div>
                                </div>
                            </div>
                            <div className="image-wave">
                                <img src={wave} alt="wave" />
                            </div>
                        </div>
                    </div>
                </section>
            );
}
