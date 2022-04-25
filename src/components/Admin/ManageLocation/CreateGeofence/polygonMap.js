import React, {
  useRef, useCallback, useState, useEffect,
} from 'react';
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  Polygon,
} from 'react-google-maps';

const PolyMap = (props) => {
  let { geofence } = props;
  const { center, zoom } = props;

  const geoFenceLatLong = [];
  if (geofence) {
    geofence = geofence.replace(/,\s*$/, '');
    const arry = geofence.split(',');

    arry.map((x) => {
      const split = x.split(' ');
      geoFenceLatLong.push({
        lat: parseFloat(split[0]),
        lng: parseFloat(split[1]),
      });
      return x;
    });
  }
  
  const [path, setPath] = useState(geoFenceLatLong.length > 0 ? geoFenceLatLong : [
    { lat: center.lat + 0.00100, lng: center.lng + 0.00090 },
    { lat: center.lat + 0.0010, lng: center.lng + 0.0030 },
    { lat: center.lat + 0.0040, lng: center.lng - 0.0060 },
    { lat: center.lat - 0.0070, lng: center.lng - 0.0090 },
  ]);

  // Define refs for Polygon instance and listeners
  const polygonRef = useRef(null);
  const listenersRef = useRef([]);

  const poly = useRef(null);

  // Call setPath with new edited path
  const onEdit = () => {
    if (polygonRef.current) {
      const nextPath = polygonRef.current
        .getPath()
        .getArray()
        .map(latLng => ({ lat: latLng.lat(), lng: latLng.lng() }));
      setPath(nextPath);
      props.getBound(poly);
    }
  };

  // Bind refs to current Polygon and listeners
  const onLoad = (polygon) => {
    polygonRef.current = polygon;
    const paths = polygon.getPath();
    listenersRef.current.push(
      paths.addListener('set_at', onEdit),
      paths.addListener('insert_at', onEdit),
      paths.addListener('remove_at', onEdit),
    );
    props.getBound(polygonRef);
  };

  useEffect(() => {
    onLoad(poly.current);
  }, [poly]);

  // Clean up refs
  const onUnmount = useCallback(() => {
    listenersRef.current.forEach(lis => lis.remove());
    polygonRef.current = null;
  }, []);

  return (
    <div className="App">
      <GoogleMap
        mapContainerClassName="App-map"
        center={center}
        zoom={zoom}
        version="weekly"
      >
        <Polygon
          ref={poly}
          // Make the Polygon editable / draggable
          editable
          draggable
          path={path}
          // Event used when manipulating and adding points
          onMouseUp={() => onEdit()}
          // Event used when dragging the whole Polygon
          onDragEnd={() => onEdit}
          onLoad={() => onLoad}
          onUnmount={onUnmount}
        />
      </GoogleMap>
    </div>
  );
};

export default withScriptjs(withGoogleMap(PolyMap));
