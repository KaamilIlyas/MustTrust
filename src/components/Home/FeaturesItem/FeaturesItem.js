import React, { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './FeaturesItem.css'

export default function FeaturesItem(props) {
    return( <Fragment key={props.index}>
        <FontAwesomeIcon icon={props.icon} className="item__icon"/>
        <h5 className="pt-3">{props.title}</h5>
        <p className="pt-3 services-item__subtitie">{props.text}</p>
    </Fragment>);
}
