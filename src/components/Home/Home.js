import React from 'react';
import Banner from './Banner/Banner';
import Header from './Header/Header';
import ComparingProduct from './ComparingProduct/ComparingProduct';
import Features from './Features/Features';
import Team from './Team/Team';
import Work from './Work/Work';
import Sentiment from './Sentiment/Sentiment';
import BannerTwo from './BannerTwo/BannerTwo';
import Questions from './Questions/Questions';
import Form from './Form/Form';
import Social from './Social/Social';

export default function Home() {
    return (
        <div>
            <Header />
            <Features />
            <Banner />
            <ComparingProduct />
            <Team />
            {/* <Work /> */}
            <Sentiment />
            <BannerTwo />
            <Questions />
            <Form />
            <Social />
        </div>
    )
}