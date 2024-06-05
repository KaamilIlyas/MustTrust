import React from 'react';
import teamData from '../../../data/team'
import './Team.css'

export default function Team() {
    const team = teamData.info.map((member, index) => {
        return (
            <div className="col-lg-3 col-sm-6 text-center" key={index}>
                <div className="team__content">
                    <div className="team__image">
                        <img src={member.image} alt={member.image} />
                    </div>
                    <div className="team__info">
                        <h5>{member.name}</h5>
                        <p>{member.position}</p>
                    </div>
                </div>
            </div>
        )
    })
    return(
        <section id='members' className="team">
            <div className="container">
                <div className="row text-center">
                    <div className="col-lg-12">
                        <h2 className="h1 team__title">BEHIND THE PEOPLE</h2>
                        <div className="section-title-border"></div>
                        <p className="team__subtitle">Get to know the dedicated individuals who brought <strong>TrustIsMust</strong> to life and are committed to revolutionizing the way people perceive trust in online ratings.</p>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row mt-5 justify-content-center">
                    {team}
                </div>
            </div>
        </section>
    );
}
