import React from 'react';
import { makeStyles } from 'tss-react/mui';

import { ImageItemProps } from 'web-components/lib/components/image-item';
import Section from 'web-components/lib/components/section';
import ImageItems from 'web-components/lib/components/sliders/ImageItems';
import { Theme } from 'web-components/lib/theme/muiTheme';

import { ImageItemsSection as ImageItemsSectionProps } from '../../generated/sanity-graphql';

const useStyles = makeStyles()((theme: Theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      paddingBottom: theme.spacing(14),
    },
    [theme.breakpoints.up('sm')]: {
      paddingBottom: theme.spacing(25),
    },
  },
}));

interface Props {
  content: ImageItemsSectionProps;
}

const ImageItemsSection: React.FC<React.PropsWithChildren<Props>> = ({
  content,
}) => {
  const { classes: styles } = useStyles();
  const imageItems: ImageItemProps[] =
    content?.imageCards?.map(i => ({
      img: <img src={i?.icon?.asset?.url || ''} alt={`${i?.title}`} />,
      title: i?.title || '',
      description: i?.descriptionRaw[0]?.children[0]?.text,
    })) || [];

  return (
    <Section withSlider className={styles.root} title={content?.title || ''}>
      <ImageItems items={imageItems} />
    </Section>
  );
};

export { ImageItemsSection };
