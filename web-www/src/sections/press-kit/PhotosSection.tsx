import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { graphql, StaticQuery } from 'gatsby';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Section from 'web-components/lib/components/section';
import ProjectMedia from 'web-components/lib/components/sliders/ProjectMedia';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      paddingBottom: theme.spacing(27.5),
    },
    [theme.breakpoints.down('xs')]: {
      paddingBottom: theme.spacing(20),
    },
  },
  slider: {
    [theme.breakpoints.up('sm')]: {
      maxWidth: theme.spacing(236.5),
      paddingBottom: theme.spacing(15),
      margin: '0 auto',
    },
  },
  title: {
    [theme.breakpoints.up('sm')]: {
      paddingBottom: theme.spacing(12.5),
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.spacing(8),
      paddingBottom: theme.spacing(9.75),
    },
  },
}));

const PhotosSection = (): JSX.Element => {
  const classes = useStyles();

  return (
    <StaticQuery
      query={graphql`
        query {
          content: pressKitYaml {
            photosSection {
              header
              photos {
                image {
                  publicURL
                }
              }
            }
          }
        }
      `}
      render={data => {
        const content = data.content.photosSection;
        return (
          <Section title={content.header} titleClassName={classes.title} className={classes.root}>
            <div className={classes.slider}>
              <ProjectMedia
                xsBorderRadius
                assets={content.photos.map(({ image }: { image: { publicURL: string } }) => ({
                  src: image.publicURL,
                  thumbnail: image.publicURL,
                }))}
              />
            </div>
          </Section>
        );
      }}
    />
  );
};

export default PhotosSection;