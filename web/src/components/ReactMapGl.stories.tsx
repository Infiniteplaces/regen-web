// @ts-ignore
import React, {Component} from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import ReactMapGL, {Marker} from 'react-map-gl';

class Map extends Component {

  state = {
    viewport: {
      width: 400,
      height: 400,
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 8
    }
  };

  render() {
    return (
      <ReactMapGL
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/satellite-streets-v10"
        {...this.state.viewport} onViewportChange={(viewport) => this.setState({viewport})}
        mapboxApiAccessToken={'pk.eyJ1IjoiYWFyb25jLXJlZ2VuIiwiYSI6ImNqeHEydjF5ZjAxN2IzbW84aTE5M2V5c2sifQ.NPkqPbEWD7reqYbx_0jf3A'
        || process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      >
        {this.props.children}
      </ReactMapGL>
    );
  }
}

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const pinStyle = {
  cursor: 'pointer',
  fill: '#d00',
  stroke: 'none'
};

const size = 20;

storiesOf('Maps|ReactMapGL', module)
  .addDecorator(story =>
    <Map>{story()}</Map>
  )
  .add("default", () => [])
  .add("marker", () => <Marker latitude={37.8} longitude={-122.5} key={0}>
    <svg
      height={size}
      viewBox="0 0 24 24"
      style={{
        ...pinStyle,
        transform: `translate(${-size / 2}px,${-size}px)`
      }}
    >
      <path d={ICON}/>
    </svg>
  </Marker>)
