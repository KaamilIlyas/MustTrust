import React from 'react';
import './BannerTwo.css'
import wave from '../../../assets/bg-pattern.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

export default function BannerTwo() {
            return (
                <section>
                    <div className="banner-two">
                        <div className="banner-two__layout">
                            <div className="container">
                                <div className="row">
                                    <div className="col-12">
                                    <h2 classNmae="h1">Let's Connect</h2>
                                    <div className="section-title-border"></div>
                                    <p>Let's Connect, your ideas matter. Share your thoughts on how we can improve our application together.</p>
                                    <div className="hover-effect-px">
                                        <a href='#contact'> <button>Connect <FontAwesomeIcon icon={faArrowRight} /></button> </a>
                                    </div>
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
