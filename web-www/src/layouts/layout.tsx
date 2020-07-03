/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Header from 'web-components/lib/components/header';
import { useTheme } from '@material-ui/core/styles';
import './layout.css';

interface propTypes {
  children: Array<React.ReactElement>;
  location: Location;
}

interface HeaderColors {
  [key: string]: string;
}

const Layout = ({ children, location }: propTypes): JSX.Element => {
  const theme = useTheme();

  const headerColors: HeaderColors = {
    '/': theme.palette.primary.main,
    '/buyers/': theme.palette.primary.light,
  };

  const menuItems = [
    { title: 'Buyers', href: '/buyers' },
    { title: 'Land Steward', href: '/landsteward' },
    {
      title: 'Learn More',
      dropdownItems: [
        { title: 'Case Studies', href: '/casestudies' },
        { title: 'FAQ', href: '/faq' },
        { title: 'Team', href: '/team' },
      ],
    },
  ];
  // TODO Header absolute prop will also needs to be set based on location
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const desktopColor: string = headerColors[location.pathname]
    ? headerColors[location.pathname]
    : theme.palette.primary.main;

  return (
    <>
      <Header
        menuItems={menuItems}
        absolute={matches}
        transparent
        color={matches ? desktopColor : theme.palette.primary.light}
      />
      <div>
        <main>{children}</main>
        <footer></footer>
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;