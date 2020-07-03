import React from 'react';
import { makeStyles, Theme, useTheme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useStaticQuery, graphql } from 'gatsby';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ReactHtmlParser from 'react-html-parser'; 
import Img from 'gatsby-image';

import FeaturedCard from 'web-components/lib/components/cards/FeaturedCard';
import ContainedButton from 'web-components/lib/components/buttons/ContainedButton';
import Title from 'web-components/lib/components/title';
import Section from '../../components/Section';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    [theme.breakpoints.up(theme.breakpoints.values.tablet)]: {
      paddingBottom: theme.spacing(22.5),
    },
  },
  title: {
    lineHeight: '140%',
    [theme.breakpoints.down(theme.breakpoints.values.tablet)]: {
      paddingTop: theme.spacing(5),
    },
  },
  description: {
    color: theme.palette.info.dark,
    lineHeight: '150%',
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.spacing(3.5),
      paddingTop: theme.spacing(2.5),
      paddingBottom: theme.spacing(4.5),
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: theme.spacing(4.5),
      paddingTop: theme.spacing(5),
      paddingBottom: theme.spacing(7),
    },
  },
  button: {
    [theme.breakpoints.down(theme.breakpoints.values.tablet)]: {
      width: '60%',
    },
    [theme.breakpoints.up('sm')]: {
      width: '50%',
    },
  },
  card: {
    [theme.breakpoints.down(theme.breakpoints.values.tablet)]: {
      paddingTop: theme.spacing(8),
    },
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(5),
    },
  },
  text: {
    [theme.breakpoints.up('sm')]: {
      paddingRight: theme.spacing(10),
    },
  },
}));

const ApproachSection = () => {
  const data = useStaticQuery(graphql`
    query {
      text: contentYaml {
        featuredSection {
          header
          title
          link
          image {
            childImageSharp {
              fluid(quality: 90) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
          description
        }
      }
    }
  `);
  const classes = useStyles();
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('tablet'));
  
  const content = data.text.featuredSection;
  return (
    <Section className={classes.root} title={content.header} titleVariant="subtitle1">
      <div className={classes.card}>
        <FeaturedCard>
          <Grid container wrap="nowrap" direction={desktop ? 'row' : 'column-reverse'}>
            <Grid item xs={12} className={classes.text}>
              <Title className={classes.title} variant="h3">
                {ReactHtmlParser(content.title)}
              </Title>
              <Typography className={classes.description}>{ReactHtmlParser(content.description)}</Typography>
              <ContainedButton
                rel="noopener noreferrer"
                target="_blank"
                href={content.link}
                className={classes.button}
              >
                buy
              </ContainedButton>
            </Grid>
            <Grid item xs={12}>
              <Img fluid={content.image.childImageSharp.fluid} />
            </Grid>
          </Grid>
        </FeaturedCard>
      </div>
    </Section>
  );
};

export default ApproachSection;