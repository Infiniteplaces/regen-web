import React from 'react';
import Box from '@mui/material/Box';
import ReactHtmlParser from 'html-react-parser';
import { makeStyles } from 'tss-react/mui';

import { Title } from '../../typography';
import { NavLinkProps } from './NavLink';

const useStyles = makeStyles()(theme => {
  const { pxToRem } = theme.typography;
  return {
    item: {
      padding: theme.spacing(1.5, 0),
      '&:first-of-type': {
        paddingTop: 0,
      },
      '&:last-of-type': {
        paddingBottom: 0,
      },
    },
    label: {
      fontSize: pxToRem(14),
      letterSpacing: '1px',
      lineHeight: pxToRem(17.57),
      fontWeight: 800,
      color: theme.palette.info.dark,
      textTransform: 'uppercase',
    },
  };
});

export type HeaderDropdownItemProps = {
  title: string;
  href: string;
  pathname: string;
  linkComponent: React.FC<React.PropsWithChildren<NavLinkProps>>;
  svg?: React.FunctionComponent<
    React.PropsWithChildren<React.SVGProps<SVGSVGElement>>
  >;
  icon?: JSX.Element;
  right?: () => JSX.Element;
};

export const HeaderDropdownItem: React.FC<
  React.PropsWithChildren<HeaderDropdownItemProps>
> = ({ svg: SVG, icon, linkComponent: LinkComponent, ...props }) => {
  const { classes: styles } = useStyles();
  return (
    <Box
      display="flex"
      flexWrap="nowrap"
      alignItems="center"
      className={styles.item}
    >
      {SVG && (
        <Box mr={3}>
          <SVG />
        </Box>
      )}
      {icon && <Box mr={3}>{icon}</Box>}
      <LinkComponent pathname={props.pathname} href={props.href}>
        {ReactHtmlParser(props.title)}
      </LinkComponent>
      {props.right && <Box ml={3}>{props.right()}</Box>}
    </Box>
  );
};

/** column with a title and links */
export const HeaderDropdownColumn: React.FC<
  React.PropsWithChildren<{
    items: HeaderDropdownItemProps[];
    linkComponent: React.FC<React.PropsWithChildren<NavLinkProps>>;
    title?: string;
  }>
> = props => {
  const { classes: styles } = useStyles();
  return (
    <Box display="flex" flexDirection="column">
      {props.title && (
        <Box mb={2}>
          <Title variant="h4" className={styles.label}>
            {ReactHtmlParser(props.title)}
          </Title>
        </Box>
      )}
      {props.items.map((link, i) => (
        <HeaderDropdownItem
          key={i}
          {...link}
          linkComponent={props.linkComponent}
        />
      ))}
    </Box>
  );
};
