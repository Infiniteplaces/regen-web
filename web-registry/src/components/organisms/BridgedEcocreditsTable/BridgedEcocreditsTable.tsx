import { useState } from 'react';
import { Box } from '@mui/material';
import { quantityFormatNumberOptions } from 'config/decimals';
import { random } from 'lodash';
import { loaderStyles } from 'styles/loader';
import { ELLIPSIS_COLUMN_WIDTH, tableStyles } from 'styles/table';

import { BlockContent } from 'web-components/lib/components/block-content';
import EmptyCartIcon from 'web-components/lib/components/icons/EmptyCartIcon';
import { InfoLabelVariant } from 'web-components/lib/components/info-label/InfoLabel.types';
import {
  ActionsTable,
  TablePaginationParams,
} from 'web-components/lib/components/table/ActionsTable';
import InfoTooltipWithIcon from 'web-components/lib/components/tooltip/InfoTooltipWithIcon';
import {
  DATE_FORMAT_SECONDARY,
  formatDate,
  formatNumber,
} from 'web-components/lib/utils/format';
import { DEFAULT_ROWS_PER_PAGE } from 'web-components/src/components/table/ActionsTable.constants';

import {
  AccountLink,
  BreakText,
  BreakTextEnd,
  GreyText,
  Link,
  StatusLabel,
} from 'components/atoms';
import WithLoader from 'components/atoms/WithLoader';
import { NoCredits } from 'components/molecules';
import { useBridged } from 'hooks/bridge/useBridged';

import {
  AMOUNT_BRIDGED_TOOLTIP,
  BRIDGED_STATUS,
  CREDIT_BATCH_TOOLTIP,
  NO_BRIDGED_CREDITS,
} from './BridgedEcocreditsTable.constants';

// TODO - A hook scaffolding `useBridged` has been implemented for the data request
// that simply simulates a request with an empty response.

// TODO - We will filter this by C03 class eventually

interface Props {
  accountAddress: string | undefined;
  privateAccess?: boolean;
}

export const BridgedEcocreditsTable = ({
  accountAddress,
  privateAccess = false,
}: Props): JSX.Element => {
  const [paginationParams, setPaginationParams] =
    useState<TablePaginationParams>({
      page: 0,
      rowsPerPage: DEFAULT_ROWS_PER_PAGE,
      offset: 0,
    });

  const { credits, isLoadingCredits } = useBridged({
    address: accountAddress,
    paginationParams,
  });

  if (!credits?.length && !isLoadingCredits) {
    return (
      <NoCredits
        title={NO_BRIDGED_CREDITS}
        icon={
          <EmptyCartIcon
            sx={{ width: '100px', height: '100px', color: 'info.main' }}
          />
        }
      />
    );
  }

  return (
    <WithLoader isLoading={isLoadingCredits} sx={loaderStyles.withLoaderBlock}>
      <ActionsTable
        tableLabel="bridged ecocredits table"
        sx={tableStyles.rootOnlyTopBorder}
        onTableChange={setPaginationParams}
        headerRows={[
          'Status',
          privateAccess && (
            <Box display="flex" sx={{ width: { xs: '8rem', lg: '10rem' } }}>
              Note / Link
            </Box>
          ),
          <Box sx={{ width: ELLIPSIS_COLUMN_WIDTH }}>{'Project'}</Box>,
          <Box
            display="flex"
            sx={{
              width: {
                xs: '8rem',
                lg: '10rem',
              },
            }}
          >
            <Box sx={{ width: '4.2rem' }}>
              <BreakText>Credit Batch Id</BreakText>
            </Box>
            <Box alignSelf="flex-end" ml={2}>
              <InfoTooltipWithIcon outlined title={CREDIT_BATCH_TOOLTIP} />
            </Box>
          </Box>,
          'Issuer',
          'Credit Class',
          <Box display="flex">
            <BreakTextEnd>Amount Bridged</BreakTextEnd>
            <Box alignSelf="flex-end" ml={2}>
              <InfoTooltipWithIcon outlined title={AMOUNT_BRIDGED_TOOLTIP} />
            </Box>
          </Box>,
          <Box sx={{ width: '6.25rem' }}>
            <BreakText>Batch Start Date</BreakText>
          </Box>,
          <Box sx={{ width: '6.25rem' }}>
            <BreakText>Batch End Date</BreakText>
          </Box>,
          'Project Location',
        ]}
        rows={credits.map((row, i) => {
          return [
            <GreyText>
              {
                <StatusLabel
                  status={BRIDGED_STATUS[random(0, 2)] as InfoLabelVariant}
                />
              }
            </GreyText>,
            privateAccess && <GreyText>...</GreyText>, // TODO: Note/Link
            <WithLoader isLoading={!row.projectName} variant="skeleton">
              <Link
                href={`/projects/${row?.projectId}`}
                sx={tableStyles.ellipsisColumn}
              >
                {row?.projectName}
              </Link>
            </WithLoader>,
            <Link href={`/credit-batches/${row.denom}`}>{row.denom}</Link>,
            <AccountLink address={row.issuer} />,
            <WithLoader isLoading={!row.classId} variant="skeleton">
              <Link
                key="class_id"
                href={`/credit-classes/${row.classId}`}
                sx={tableStyles.ellipsisContentColumn}
              >
                {row?.className && <BlockContent content={row?.className} />}
              </Link>
            </WithLoader>,
            formatNumber({
              num: row.balance?.tradableAmount,
              ...quantityFormatNumberOptions,
            }),
            <GreyText>
              {formatDate(row.startDate, DATE_FORMAT_SECONDARY)}
            </GreyText>,
            <GreyText>
              {formatDate(row.endDate, DATE_FORMAT_SECONDARY)}
            </GreyText>,
            <WithLoader isLoading={!row.projectLocation} variant="skeleton">
              <Box>{row.projectLocation}</Box>
            </WithLoader>,
          ];
        })}
      />
    </WithLoader>
  );
};
