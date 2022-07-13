import React from 'react';
import { DeliverTxResponse } from '@cosmjs/stargate';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';

import OnBoardingCard from 'web-components/lib/components/cards/OnBoardingCard';
import {
  Label,
  Subtitle,
  Title,
} from 'web-components/lib/components/typography';
import OutlinedButton from 'web-components/lib/components/buttons/OutlinedButton';
import { CardItem } from 'web-components/lib/components/modal/TxModal';
import { BrokenLinkIcon } from 'web-components/lib/components/icons/BrokenLinkIcon';
import { truncate } from 'web-components/lib/utils/truncate';

import { Link } from '../../../../components/atoms';
import { getAccountUrl, getHashUrl } from '../../../../lib/block-explorer';

type ResultProps = {
  response?: DeliverTxResponse;
  error?: string;
};

export default function Result({
  response,
  error,
}: ResultProps): React.ReactElement {
  if (error) return <ErrorResult error={error} />;
  return response ? <SuccessResult response={response} /> : <div />;
}

type SuccessProps = {
  response: DeliverTxResponse;
};

const SuccessResult = ({ response }: SuccessProps): React.ReactElement => {
  const navigate = useNavigate();

  // Parsing the response...
  const responseLog = response?.rawLog && JSON.parse(response?.rawLog);
  const responseLogEvents = responseLog && responseLog[0].events;

  const eventCreateBatch =
    responseLogEvents &&
    responseLogEvents.find((event: any) =>
      event.type.includes('.EventCreateBatch'),
    );

  const receiveBatchDenom =
    eventCreateBatch &&
    eventCreateBatch.attributes?.find((obj: any) => obj.key === 'batch_denom');

  const eventReceive =
    responseLogEvents &&
    responseLogEvents.find((event: any) =>
      event.type.includes('.EventReceive'),
    );

  const recipientsLog =
    eventReceive &&
    eventReceive.attributes?.filter((obj: any) => obj.key === 'recipient');
  const recipients = recipientsLog.map(({ value }: { value: string }) => {
    const recipientAddress = value.replace(/"/g, '');
    return {
      name: truncate(recipientAddress),
      url: getAccountUrl(recipientAddress),
    };
  });

  const batchDenom = receiveBatchDenom.value.replace(/"/g, '');

  return (
    <>
      <OnBoardingCard>
        <Title variant="h5">Create Credit Batch</Title>
        <CardItem
          label="batch denom"
          value={{
            name: batchDenom,
            url: `/credit-batches/${batchDenom}`,
          }}
          linkComponent={Link}
        />
        <CardItemList
          label={`recipient${recipients.length > 1 ? 's' : ''}`}
          values={recipients}
        />
        <CardItem
          label="hash"
          value={{
            name: truncate(response?.transactionHash),
            url: getHashUrl(response?.transactionHash),
          }}
          linkComponent={Link}
        />
      </OnBoardingCard>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <OutlinedButton
          onClick={() => navigate(`/credit-batches/${batchDenom}`)}
        >
          SEE CREDIT BATCH
        </OutlinedButton>
      </Box>
    </>
  );
};

type ErrorResultProps = {
  error: string;
};

const ErrorResult = ({ error }: ErrorResultProps): React.ReactElement => {
  const navigate = useNavigate();

  return (
    <>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <BrokenLinkIcon sx={{ pb: 4.5 }} />
        <Title
          sx={{
            lineHeight: {
              xs: '150%',
              sm: '140%',
            },
            px: {
              sm: 10,
              xs: 6.5,
            },
          }}
          align="center"
          variant="h3"
        >
          Sorry, your transaction was not successful.
        </Title>
      </Box>
      <OnBoardingCard>
        <Title variant="h5">Create Credit Batch</Title>
        <CardItem
          color="error.main"
          label="error"
          value={{ name: error }}
          linkComponent={Link}
        />
      </OnBoardingCard>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <OutlinedButton onClick={() => navigate('/ecocredits/dashboard')}>
          SEE ALL CREDIT BATCHES
        </OutlinedButton>
      </Box>
    </>
  );
};

type LinkItem = {
  name: string;
  url: string;
};

type CardItemListProps = {
  label: string;
  values: LinkItem[];
};

const CardItemList: React.FC<CardItemListProps> = ({ label, values }) => {
  return (
    <Box sx={{ pt: 5 }}>
      <Label size="sm" sx={{ pb: [3, 2.25] }}>
        {label}
      </Label>
      <Subtitle size="lg" mobileSize="sm" color={'info.dark'}>
        {values.map((item, index) => (
          <Link
            key={`card-item-link-${index}`}
            sx={{ color: 'secondary.main' }}
            href={item.url}
            target="_blank"
          >
            {item.name}
            {values.length > index + 1 && ', '}
          </Link>
        ))}
      </Subtitle>
    </Box>
  );
};