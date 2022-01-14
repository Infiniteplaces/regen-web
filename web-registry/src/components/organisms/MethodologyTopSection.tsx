import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';

import Title from 'web-components/lib/components/title';
import Description from 'web-components/lib/components/description';
import { BlockContent } from 'web-components/lib/components/block-content';

import { OptimizedImage } from '../atoms/OptimizedImage';
import { Methodology } from '../../mocks/mocks';
import topoBackground from '../../assets/background.jpg';
import { Maybe, Scalars } from '../../generated/sanity-graphql';

type Props = {
  methodology: Methodology;
  nameRaw?: Maybe<Scalars['JSON']>;
  descriptionRaw?: Maybe<Scalars['JSON']>;
};

const useStyles = makeStyles((theme: Theme) => ({
  top: {
    display: 'flex',
    justifyContent: 'center',
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
    backgroundImage: `url(${topoBackground})`,
  },
  content: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(15, 5),
      maxWidth: theme.breakpoints.values.lg,
    },
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
  text: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(2, 0, 2, 15),
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      padding: theme.spacing(12, 4),
      '&:last-child': {
        paddingBottom: theme.spacing(15),
      },
    },
  },
  description: {
    paddingTop: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      fontSize: theme.typography.pxToRem(22),
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.typography.pxToRem(18),
    },
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    [theme.breakpoints.up('md')]: {
      width: theme.spacing(102.75),
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
      height: theme.spacing(56),
    },
  },
  image: {
    width: '100%',
  },
}));

function MethodologyTopSection({ methodology, nameRaw, descriptionRaw }: Props): JSX.Element {
  const styles = useStyles();

  return (
    <div className={styles.top}>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <OptimizedImage className={styles.image} src={methodology.imageSrc} alt={methodology.id} />
        </div>
        <div className={styles.text}>
          <Title variant="h1">
            <BlockContent content={nameRaw} />
          </Title>
          <Description className={styles.description}>
            <BlockContent noYMargin content={descriptionRaw} />
          </Description>
        </div>
      </div>
    </div>
  );
}

export { MethodologyTopSection };
