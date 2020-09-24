import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import BackgroundImage from 'gatsby-background-image';

import SEO from '../components/seo';
import TopSection from '../sections/press-kit//TopSection';
import TitleDescriptionSection from '../sections/press-kit/TitleDescriptionSection';
import EnableSection from '../sections/press-kit/EnableSection';
import TimelineSection from '../sections/press-kit/TimelineSection';
import TeamSection from '../sections/press-kit/TeamSection';
import FeaturedSection from '../sections/press-kit/FeaturedSection';
import AwardsSection from '../sections/press-kit/AwardsSection';
import LogosSection from '../sections/press-kit/LogosSection';
import ConnectSection from '../sections/press-kit/ConnectSection';
import PhotosSection from '../sections/press-kit/PhotosSection';

const PressKitPage = (): JSX.Element => {
  const data = useStaticQuery(graphql`
    query {
      background: file(relativePath: { eq: "press-kit-topo-bg.jpg" }) {
        childImageSharp {
          fluid(quality: 90) {
            ...GatsbyImageSharpFluid_withWebp
          }
        }
      }
    }
  `);
  return (
    <>
      <SEO title="Press Kit" />
      <TopSection />
      <TitleDescriptionSection />
      <EnableSection />
      <TimelineSection />
      <TeamSection />
      <BackgroundImage fluid={data.background.childImageSharp.fluid}>
        <FeaturedSection />
        <AwardsSection />
        <LogosSection />
      </BackgroundImage>
      <ConnectSection />
      <PhotosSection />
    </>
  );
};

export default PressKitPage;