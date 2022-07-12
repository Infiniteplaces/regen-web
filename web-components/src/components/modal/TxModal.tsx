import React from 'react';
import { Theme, Box } from '@mui/material';
import { SxProps } from '@mui/system';
import { makeStyles } from '@mui/styles';

import { Label, Subtitle, Title } from '../typography';
import OutlinedButton from '../buttons/OutlinedButton';
import Card from '../cards/Card';
import Modal, { RegenModalProps } from '../modal';
import { LinkItem } from '../footer/footer-new';
import { truncate } from '../../utils/truncate';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      height: 'auto',
      maxHeight: '100%',
      paddingLeft: theme.spacing(7.5),
      paddingRight: theme.spacing(7.5),
    },
  },
}));

export interface Item {
  label: string;
  value: {
    name: string | number;
    url?: string;
    icon?: React.ReactNode;
  };
  color?: string;
}

interface LinkProps extends LinkItem {
  className?: string;
  sx?: SxProps<Theme>;
}

type LinkComponentProp = React.FC<LinkProps>;

interface Props extends TxModalProps {
  icon?: JSX.Element;
  title: string;
}

export interface TxModalProps extends RegenModalProps {
  onViewPortfolio: () => void;
  cardTitle: string;
  buttonTitle?: string;
  cardItems?: Item[];
  linkComponent: LinkComponentProp;
  txHash: string;
  txHashUrl: string;
}

interface CardItemProps extends Item {
  linkComponent: LinkComponentProp;
}

export const CardItem: React.FC<CardItemProps> = ({
  color,
  label,
  value,
  linkComponent: LinkComponent,
}) => {
  return (
    <Box sx={{ pt: 5 }}>
      <Label size="sm" sx={{ pb: [3, 2.25], color }}>
        {label}
      </Label>

      <Subtitle size="lg" mobileSize="sm" color={color || 'info.dark'}>
        {value.icon && value.icon}
        {value.url ? (
          <LinkComponent
            sx={{ color: 'secondary.main' }}
            href={value.url}
            target="_blank"
          >
            {value.name}
          </LinkComponent>
        ) : (
          <>{value.name}</>
        )}
      </Subtitle>
    </Box>
  );
};

const TxModal: React.FC<Props> = ({
  icon,
  title,
  buttonTitle = 'view your portfolio',
  open,
  onClose,
  onViewPortfolio,
  cardTitle,
  cardItems,
  txHash,
  txHashUrl,
  linkComponent,
}) => {
  const styles = useStyles();
  return (
    <Modal open={open} onClose={onClose} className={styles.root}>
      {icon}
      <Title
        sx={{
          lineHeight: {
            xs: '150%',
            sm: '140%',
          },
          px: {
            sm: 6.5,
          },
        }}
        align="center"
        variant="h3"
      >
        {title}
      </Title>
      <Card
        sx={{
          width: '100%',
          px: { sm: 7.75, xs: 5.5 },
          py: { sm: 9, xs: 7.5 },
          mt: { sm: 9.5, xs: 2.75 },
          mb: { sm: 10, xs: 7.5 },
        }}
      >
        <Title variant="h5">{cardTitle}</Title>
        {cardItems?.map((item, i) => (
          <CardItem {...item} linkComponent={linkComponent} key={i} />
        ))}
        <CardItem
          label="hash"
          value={{ name: truncate(txHash), url: txHashUrl }}
          linkComponent={linkComponent}
        />
      </Card>
      <OutlinedButton
        sx={{ fontSize: { xs: 12, sm: 18 } }}
        onClick={onViewPortfolio}
      >
        {buttonTitle}
      </OutlinedButton>
    </Modal>
  );
};

export { TxModal };
