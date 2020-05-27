/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes, { string } from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import Header from 'web-components/lib/components/header';
import { useTheme } from '@material-ui/core/styles';
import { Link } from 'gatsby';
import './layout.css';

let logo = 'images/logo.png';
interface propTypes {
  children: Array<React.ReactElement>;
}

const Layout = ({ children }: propTypes): JSX.Element => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  const theme = useTheme();

  const url = typeof window !== 'undefined' ? window.location.href : '';

  let color = theme.palette.primary.contrastText;
  if (url.includes('page')) {
    color = theme.palette.primary.main;
  }

  let menu = [
    { Buyers: <Link to="/buyers">Buyers</Link> },
    { 'Land Steward': <Link to="/landsteward">Land Steward</Link> },
    {
      'Learn More': [
        { 'Case Studies': <Link to="/casestudies">Case Studies</Link> },
        { FAQ: <Link to="/faq">FAQ</Link> },
        { Team: <Link to="/team">Team</Link> },
      ],
    },
  ];

  return (
    <>
      <Header transparent={true} menu={menu} color={color} logo={logo} absolute={true}></Header>
      <div
        style={{
          margin: `0 auto`,
        }}
      >
        <main>{children}</main>
        <footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer>
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
