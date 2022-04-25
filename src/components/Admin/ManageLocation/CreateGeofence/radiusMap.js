import React, { Fragment, useRef, useEffect } from 'react';
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  Circle,
} from 'react-google-maps';

const Map = (props) => {
  const maps = useRef(null);
  const {
    radius, zoom, center, places,
  } = props;
  useEffect(() => {
    props.getBound(maps);
  }, [maps, radius]);

  return (
    <GoogleMap
      defaultZoom={zoom}
      defaultCenter={center}
    >
      {places.map(place => (
        <Fragment key={place.id}>
          {place.circle && (
          <Circle
            defaultCenter={{
              lat: parseFloat(place.latitude),
              lng: parseFloat(place.longitude),
            }}
            radius={props.radius}
            ref={maps}
            options={place.circle.options}
          />
          )}
        </Fragment>
      ))}
    </GoogleMap>
  );
};

export default withScriptjs(withGoogleMap(Map));
