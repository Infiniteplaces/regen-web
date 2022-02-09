import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Box,
  TableFooter,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  StyledTableCell,
  StyledTableContainer,
  StyledTableRow,
  StyledTableSortLabel,
} from 'web-components/lib/components/table';
import Section from 'web-components/lib/components/section';
import { TableActionButtons } from 'web-components/lib/components/buttons/TableActionButtons';
import {
  getComparator,
  Order,
  stableSort,
} from 'web-components/lib/components/table/sort';
import { getAccountEcocreditsForBatch, getBatches } from '../lib/ecocredit';
import { useTablePagination } from 'web-components/lib/components/table/useTablePagination';
import { ledgerRestUri } from '../ledger';
import { truncateWalletAddress } from '../lib/wallet';
import { getAccountUrl } from '../lib/block-explorer';
import type { BatchRowData, EcocreditAccountBalance } from '../types/ledger';

const useStyles = makeStyles(theme => ({
  borderLeft: {
    // absolutely position border to get around MUI style quirks
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderLeft: `1px solid ${theme.palette.info.light}`,
  },
  greyText: {
    color: theme.palette.info.main,
  },
}));

const ROWS_PER_PAGE_OPTIONS = [5, 10];

interface TableCredits extends BatchRowData, EcocreditAccountBalance {}

export const Ecocredits: React.FC = () => {
  // const walletContext = useWallet();
  // const wallet = walletContext.wallet?.address;
  // TODO hard coded for now - the following should work for a user's data
  const wallet = 'regen1m5fecarvw0ltx2yvvru0kl4un03d3uca2kxggj';
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof TableCredits>('start_date');
  const [credits, setCredits] = useState<TableCredits[]>([]);
  const { TablePagination, setCountTotal, paginationParams, paginationProps } =
    useTablePagination(ROWS_PER_PAGE_OPTIONS);

  const fetchData = async (
    paginationParams: URLSearchParams,
    setCountTotal: (count: number) => void,
  ): Promise<void> => {
    if (!wallet) return;
    const {
      data: { batches, pagination },
    } = await getBatches(paginationParams);
    const credits = await Promise.all(
      batches.map(async batch => {
        const {
          data: { retired_amount, tradable_amount },
        } = await getAccountEcocreditsForBatch(batch.batch_denom, wallet);
        return { ...batch, tradable_amount, retired_amount };
      }),
    );
    setCountTotal(parseInt(pagination.total) || 0);
    setCredits(credits);
  };

  useEffect(() => {
    if (!ledgerRestUri || !paginationParams) return;
    fetchData(paginationParams, setCountTotal);
  }, [paginationParams, setCountTotal]);

  const handleSort = (sortBy: keyof TableCredits): void => {
    const isAsc = orderBy === sortBy && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(sortBy);
  };

  const SortableHead: React.FC<{ field: string }> = ({ field, children }) => {
    const isCurrentSort = orderBy === field;
    return (
      <StyledTableCell sortDirection={isCurrentSort ? order : false}>
        <StyledTableSortLabel
          active={isCurrentSort}
          direction={isCurrentSort ? order : 'asc'}
          onClick={() => handleSort(field as keyof TableCredits)}
        >
          {children}
        </StyledTableSortLabel>
      </StyledTableCell>
    );
  };

  const styles = useStyles();
  return (
    <Box sx={{ backgroundColor: 'grey.50' }}>
      <Section title="My Ecocredits" titleVariant="h3" titleAlign="left">
        <Box
          sx={{
            border: 1,
            borderColor: 'info.light',
            borderRadius: '8px',
            marginTop: 8,
            marginBottom: 12,
            overflow: 'hidden',
          }}
        >
          <StyledTableContainer sx={{ overflow: 'auto' }}>
            <Box sx={{ overflow: 'auto' }}>
              <Table aria-label="eco credits table">
                <TableHead>
                  <TableRow>
                    <SortableHead field="batch_denom">
                      <Box
                        sx={{
                          minWidth: {
                            xs: 'auto',
                            sm: '11rem',
                            lg: '13rem',
                          },
                        }}
                      >
                        Batch Denom
                      </Box>
                    </SortableHead>
                    <SortableHead field="issuer">Issuer</SortableHead>
                    <SortableHead field="class_id">Credit Class</SortableHead>
                    <SortableHead field="amount_tradable">
                      Amount Tradable
                    </SortableHead>
                    <SortableHead field="amount_retired">
                      Amount Retired
                    </SortableHead>
                    {/* TODO Date not sorting correctly */}
                    {/* <SortableHead field="batch_start_date">
                      Batch Start Date
                    </SortableHead>
                    <SortableHead field="batch_end_date">
                      Batch End Date
                    </SortableHead> */}
                    <StyledTableCell>Batch Start Date</StyledTableCell>
                    <StyledTableCell>Batch End Date</StyledTableCell>
                    <SortableHead field="project_location">
                      Project Location
                    </SortableHead>
                    <StyledTableCell
                      sx={{
                        textAlign: 'left',
                        background: 'primary.main',
                        position: 'sticky',
                        right: 0,
                      }}
                    >
                      <Box>
                        <div className={styles.borderLeft} />
                        Actions
                      </Box>
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stableSort(
                    credits as any, // TODO type coercion shouldn't be necessary here
                    getComparator(order, orderBy),
                  ).map((row, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell>{row.batch_denom}</StyledTableCell>
                      <StyledTableCell>
                        <a
                          href={getAccountUrl(row.issuer as string)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {truncateWalletAddress(row.issuer as string)}
                        </a>
                      </StyledTableCell>
                      <StyledTableCell>{row.class_id}</StyledTableCell>
                      <StyledTableCell>
                        {formatNumber(row.tradable_amount)}
                      </StyledTableCell>
                      <StyledTableCell>
                        {formatNumber(row.retired_amount)}
                      </StyledTableCell>
                      <StyledTableCell>
                        <span className={styles.greyText}>
                          {formatDate(row.start_date)}
                        </span>
                      </StyledTableCell>
                      <StyledTableCell>
                        <span className={styles.greyText}>
                          {formatDate(row.end_date)}
                        </span>
                      </StyledTableCell>
                      <StyledTableCell>{row.project_location}</StyledTableCell>
                      <StyledTableCell
                        sx={{
                          background: 'inherit',
                          position: 'sticky',
                          right: 0,
                        }}
                      >
                        <div className={styles.borderLeft} />
                        <TableActionButtons
                          buttons={[
                            {
                              label: 'sell',
                              onClick: () => 'TODO sell credit',
                            },
                            {
                              label: 'Transfer',
                              onClick: () => 'TODO transfer credit',
                            },
                            {
                              label: 'Retire',
                              onClick: () => 'TODO retire credit',
                            },
                          ]}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <Table>
              <TableFooter sx={{ position: 'sticky', left: 0 }}>
                <TableRow>
                  <TablePagination {...paginationProps} />
                </TableRow>
              </TableFooter>
            </Table>
          </StyledTableContainer>
        </Box>
      </Section>
    </Box>
  );
};

const formatDate = (date: string | number | Date): string =>
  format(new Date(date), 'LLLL dd, yyyy');

const formatNumber = (num: string | number | Date): string => {
  return +num > 0 ? Math.floor(+num).toLocaleString() : '-';
};
