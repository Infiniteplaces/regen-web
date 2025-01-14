import { SxProps, Theme } from '@mui/material';
import { QueryAllowedDenomsResponse } from '@regen-network/api/lib/generated/regen/ecocredit/marketplace/v1/query';

import { Label } from 'web-components/lib/components/typography';
import { LabelSize } from 'web-components/lib/components/typography/sizing';

import useMarketplaceQuery from 'hooks/useMarketplaceQuery';

import { findDisplayDenom } from './DenomLabel.utils';

export interface Props {
  size: LabelSize;
  denom: string;
  sx?: SxProps<Theme>;
}

const DenomLabel = ({ denom, size, sx = [] }: Props): JSX.Element => {
  const allowedDenomsResponse = useMarketplaceQuery<QueryAllowedDenomsResponse>(
    {
      query: 'allowedDenoms',
      params: {},
    },
  );

  const displayDenom = findDisplayDenom({
    allowedDenomsData: allowedDenomsResponse?.data,
    denom,
  });

  return (
    <Label
      size={size}
      sx={[{ textTransform: 'initial' }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      {displayDenom}
    </Label>
  );
};

export { DenomLabel };
