import React from 'react';
import { RegenModalProps } from '.';
import {
  CreateSellOrderForm,
  CreateSellOrderProps,
} from '../form/CreateSellOrderForm';
import { FormModalTemplate } from './FormModalTemplate';

interface CreateSellOrderModalProps
  extends RegenModalProps,
    CreateSellOrderProps {
  title: string;
}

const CreateSellOrderModal: React.FC<CreateSellOrderModalProps> = ({
  batchDenoms,
  sellDenom,
  availableAmountByBatch,
  open,
  title,
  onClose,
  onSubmit,
}) => (
  <FormModalTemplate title={title} open={open} onClose={onClose}>
    <CreateSellOrderForm
      batchDenoms={batchDenoms}
      sellDenom={sellDenom}
      availableAmountByBatch={availableAmountByBatch}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  </FormModalTemplate>
);

export { CreateSellOrderModal };