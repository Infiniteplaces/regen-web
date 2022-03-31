import React from 'react';
import { Formik, Form, Field, FormikErrors } from 'formik';
import { makeStyles } from '@mui/styles';
import { Collapse } from '@mui/material';

import { Theme } from '../../theme/muiTheme';
import AmountField from '../inputs/AmountField';
import Description from '../description';
import CheckboxLabel from '../inputs/CheckboxLabel';
import {
  BottomCreditRetireFields,
  RetireFormValues,
  validateCreditRetire,
} from './CreditRetireForm';
import Submit from './Submit';
import {
  requiredMessage,
  invalidAmount,
  insufficientCredits,
} from '../inputs/validation';

/**
 * Send sends tradable credits from one account to another account.
 * Sent credits can either be tradable or retired on receipt.
 * https://docs.regen.network/modules/ecocredit/03_messages.html#msgsend
 *
 * Validation:
 *    holder: must ba a valid address, and their signature must be present in the transaction
 *    recipient: must ba a valid address
 *    credits: must not be empty
 *    batch_denom: must be a valid batch denomination
 *    tradable_amount: must not be negative
 *    retired_amount: must not be negative
 *  if retired_amount is positive:
 *    retirement_location: must be a valid location
 *
 * Also:
 * https://docs.regen.network/modules/ecocredit/protobuf.html#msgsend
 * https://docs.regen.network/modules/ecocredit/protobuf.html#msgsend-sendcredits
 */

const useStyles = makeStyles((theme: Theme) => ({
  holderField: {
    '& label': {
      color: `${theme.palette.primary.contrastText} !important`,
    },
    '& .MuiInputBase-formControl': {
      backgroundColor: theme.palette.info.light,
      marginTop: theme.spacing(2.25),
    },
  },
  textField: {
    marginTop: theme.spacing(10.75),
    '& .MuiInputBase-formControl': {
      marginTop: theme.spacing(2.25),
    },
  },
  description: {
    marginBottom: theme.spacing(5),
    [theme.breakpoints.up('sm')]: {
      fontSize: theme.spacing(4.5),
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.spacing(4),
    },
    '& a': {
      cursor: 'pointer',
    },
  },
  checkboxLabel: {
    marginTop: theme.spacing(10.75),
    // marginBottom: theme.spacing(10.75),
    alignItems: 'initial',
    '& .MuiCheckbox-root': {
      alignSelf: 'end',
    },
  },
  checkboxDescription: {
    color: theme.palette.primary.contrastText,
    fontSize: theme.spacing(4.5),
    fontWeight: 'bold',
    marginLeft: theme.spacing(1),
  },
}));

// Output (submit)
interface SendCredits {
  batchDenom: string;
  tradableAmount: string;
  takeAmount?: string;
  retirementLocation?: string;
}

interface MsgSend {
  sender: string;
  recipient: string;
  credits: SendCredits;
}

interface CreditTakeFormValues extends RetireFormValues {
  takeAmount: number;
  holder: string;
  recipient: string;
  tradableAmount: number;
  withRetire?: boolean;
}

// Input (args)
interface FormProps {
  accountAddress: string;
  batchDenom: string;
  availableTradableAmount: number;
  onClose: () => void;
  onSubmit: (values: CreditTakeFormValues) => void;
}

const CreditTakeForm: React.FC<FormProps> = ({
  accountAddress,
  batchDenom,
  availableTradableAmount,
  onClose,
  onSubmit,
}) => {
  const styles = useStyles();

  const initialValues = {
    holder: accountAddress,
    recipient: accountAddress,
    tradableAmount: 0,
    withRetire: false,

    takeAmount: 0,
    retiredAmount: 0,
    note: '',
    country: '',
    stateProvince: '',
  };

  const validateHandler = (
    values: CreditTakeFormValues,
  ): FormikErrors<CreditTakeFormValues> => {
    let errors: FormikErrors<CreditTakeFormValues> = {};

    if (!values.holder) {
      errors.holder = requiredMessage;
    }

    if (!values.recipient) {
      errors.recipient = requiredMessage;
    }

    if (!values.tradableAmount) {
      errors.tradableAmount = requiredMessage;
    } else if (Math.sign(values.tradableAmount) !== 1) {
      errors.tradableAmount = invalidAmount;
    } else if (values.tradableAmount > availableTradableAmount) {
      errors.tradableAmount = insufficientCredits;
    }

    // Retire form validation (optional subform)
    if (values.withRetire) {
      errors = validateCreditRetire(availableTradableAmount, values, errors);

      // combo validation: send + retire
      if (
        Number(values.tradableAmount) + Number(values.retiredAmount) >
        availableTradableAmount
      ) {
        errors.tradableAmount = insufficientCredits;
        errors.takeAmount = insufficientCredits;
      }
    }
    console.log('errors ', errors);
    return errors;
  };

  const submitHandler = async (
    values: CreditTakeFormValues,
  ): Promise<MsgSend | void> => {
    // TODO holder, amount string, check withRetire
    console.log('*** submitHandler', values);
    onSubmit(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validateHandler}
      onSubmit={submitHandler}
    >
      {({ values, submitForm, isSubmitting, isValid, submitCount, status }) => (
        <Form>
          <>
            <AmountField
              name="takeAmount"
              label="Amount"
              availableAmount={availableTradableAmount}
              batchDenom={batchDenom}
              className={styles.textField}
            />
            <Field
              component={CheckboxLabel}
              type="checkbox"
              name="withRetire"
              className={styles.checkboxLabel}
              label={
                <Description className={styles.checkboxDescription}>
                  Retire credits upon transfer
                </Description>
              }
            />
            {/* <Collapse in={values.withRetire} collapsedSize={0}> */}
            {values.withRetire && (
              <BottomCreditRetireFields country={values.country} />
            )}
            {/* </Collapse> */}
          </>
          <Submit
            isSubmitting={isSubmitting}
            onClose={onClose}
            status={status}
            isValid={isValid}
            submitCount={submitCount}
            submitForm={submitForm}
            label="take from basket"
          />
        </Form>
      )}
    </Formik>
  );
};

export { CreditTakeForm, CreditTakeFormValues };