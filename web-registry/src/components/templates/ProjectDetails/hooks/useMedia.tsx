import { useEffect, useState } from 'react';

import StaticMap from 'web-components/lib/components/map/StaticMap';
import { Asset } from 'web-components/lib/components/sliders/ProjectMedia';
import { UrlType } from 'web-components/lib/utils/schemaURL';

import {
  API_URI,
  IMAGE_STORAGE_BASE_URL,
  MAPBOX_TOKEN,
} from '../ProjectDetails.config';

interface InputProps {
  metadata: any;
  geojson: any;
}

interface ReturnType {
  assets: any;
  imageStorageBaseUrl?: string;
  apiServerUrl?: string;
  imageCredits?: string;
}

export default function useMedia({
  metadata,
  geojson,
}: InputProps): ReturnType {
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    const galleryPhotos = metadata?.['regen:galleryPhotos']?.['@list']?.filter(
      (photo: UrlType) => !!photo?.['@value'],
    );
    const previewPhoto = metadata?.['regen:previewPhoto']?.['@value'];
    const noGallery = !galleryPhotos || galleryPhotos?.length === 0;
    const noGalleryAssets: Asset[] = [];

    if (previewPhoto) {
      noGalleryAssets.push({ src: previewPhoto, type: 'image' });
    }

    const _assets = noGallery
      ? noGalleryAssets
      : galleryPhotos.map((photo: { '@value': string }) => ({
          src: photo['@value'],
          type: 'image',
        }));

    if (geojson && _assets.length < 2) {
      _assets.push(<StaticMap geojson={geojson} mapboxToken={MAPBOX_TOKEN} />);
    }

    setAssets(_assets);
  }, [geojson, metadata]);

  return {
    assets,
    imageStorageBaseUrl: IMAGE_STORAGE_BASE_URL,
    apiServerUrl: API_URI,
    imageCredits: metadata?.['schema:creditText'],
  };
}
