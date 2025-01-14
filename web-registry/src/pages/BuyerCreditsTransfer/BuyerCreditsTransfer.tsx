import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import { makeStyles } from 'tss-react/mui';

import BuyerCreate from '../BuyerCreate';
import CreditsRetire from '../CreditsRetire';
import CreditsTransfer from '../CreditsTransfer';

const useStyles = makeStyles()(theme => ({
  stepper: {
    background: theme.palette.grey[100],
  },
  label: {
    cursor: 'pointer',
  },
}));

const BuyerCreditsTransfer: React.FC<React.PropsWithChildren<unknown>> = () => {
  const [step, setStep] = useState(1);
  const [buyerWalletId, setBuyerWalletId] = useState('');
  const [vintageId, setVintageId] = useState('');
  const [addressId, setAddressId] = useState('');

  useEffect(() => {
    if (!buyerWalletId) setStep(1);
    if (buyerWalletId && addressId && !vintageId) setStep(2);
    if (buyerWalletId && addressId && vintageId) setStep(3);
  }, [buyerWalletId, vintageId, addressId]);

  function renderStep(stepIndex: number): JSX.Element {
    switch (stepIndex) {
      case 1:
        return (
          <BuyerCreate
            onCreate={(walletId, addressId) => {
              setBuyerWalletId(walletId);
              setAddressId(addressId);
            }}
          />
        );
      case 2:
        return (
          <CreditsTransfer
            addressId={addressId}
            buyerWalletId={buyerWalletId}
            onTransfer={setVintageId}
          />
        );
      case 3:
        return (
          <CreditsRetire
            buyerWalletId={buyerWalletId}
            creditVintageId={vintageId}
            addressId={addressId}
          />
        );
      default:
        return <></>;
    }
  }

  const { classes: styles } = useStyles();

  return (
    <Box>
      <Stepper className={styles.stepper} activeStep={step} alternativeLabel>
        {['Create Buyer', 'Transfer Credits', 'Retire'].map((label, i) => (
          <Step key={label}>
            <StepLabel className={styles.label} onClick={() => setStep(i + 1)}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minWidth="33%"
      >
        {renderStep(step)}
      </Box>
    </Box>
  );
};

export { BuyerCreditsTransfer };
