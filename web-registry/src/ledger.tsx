import React, { useState, useEffect } from 'react';
import { RegenApi } from '@regen-network/api';
import { QueryClientImpl as BankQueryClient } from '@regen-network/api/lib/generated/cosmos/bank/v1beta1/query';
import { QueryClientImpl as EcocreditQueryClient } from '@regen-network/api/lib/generated/regen/ecocredit/v1alpha1/query';
import { QueryClientImpl as BasketQueryClient } from '@regen-network/api/lib/generated/regen/ecocredit/basket/v1/query';

import { ledgerRPCUri, ledgerExpRPCUri, expLedger } from './lib/ledger';

interface ContextValue {
  loading: boolean;
  api: RegenApi | undefined;
  error: unknown;
  queryClients?: QueryClients;
}

interface ConnectParams {
  forceExp?: boolean;
}

async function connect(options?: ConnectParams): Promise<RegenApi | undefined> {
  // Create a new instance of the RegenApi class.
  const api = await RegenApi.connect({
    // RegenApi only supports using the Tendermint RPC to interact with a node for now.
    // But it may support other client connections in the future:
    // - via gRPC
    // - via gRPC-web
    // - via REST and gRPC-gateway
    connection: {
      type: 'tendermint',
      // If forceExp = true, then use experimental testnet RPC
      endpoint: options?.forceExp ? ledgerExpRPCUri : ledgerRPCUri,
      // TODO: DISABLED SIGNER
      // signer, // OfflineSigner from @cosmjs/proto-signing
    },
  });
  return api;
}

const LedgerContext = React.createContext<ContextValue>({
  loading: false,
  api: undefined,
  error: undefined,
});

const getApi = async (
  setApi: React.Dispatch<React.SetStateAction<RegenApi | undefined>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<unknown>,
  forceExp?: boolean,
): Promise<void> => {
  setLoading(true);
  try {
    const regenApi = await connect({ forceExp });
    setApi(regenApi);
    setLoading(false);
  } catch (e) {
    setError(e);
    setLoading(false);
  }
};

export const LedgerProvider: React.FC = ({ children }) => {
  const [api, setApi] = useState<RegenApi | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(undefined);

  useEffect(() => {
    getApi(setApi, setLoading, setError);
  }, [setApi, setLoading, setError]);

  return (
    <LedgerContext.Provider value={{ error, loading, api }}>
      {children}
    </LedgerContext.Provider>
  );
};

type QueryClients = {
  bank?: BankQueryClient;
  ecocredit?: EcocreditQueryClient;
  basket?: BasketQueryClient;
};

export const useLedger = (options?: ConnectParams): ContextValue => {
  const [expApi, setExpApi] = useState<RegenApi | undefined>(undefined);
  const [expLoading, setExpLoading] = useState<boolean>(false);
  const [expError, setExpError] = useState<unknown>(undefined);
  const context = React.useContext(LedgerContext);

  const [queryClients, setQueryClients] = useState<QueryClients>();

  const forceExp =
    !expLedger && // No need to get exp ledger api if it's already used as the primary one
    options?.forceExp;

  useEffect(() => {
    if (forceExp && !expApi && !expLoading && !expError) {
      getApi(setExpApi, setExpLoading, setExpError, forceExp);
    }
  }, [
    expApi,
    expLoading,
    expError,
    setExpApi,
    setExpLoading,
    setExpError,
    forceExp,
  ]);

  useEffect(() => {
    if (!context.api?.queryClient) return;

    setQueryClients({
      bank: new BankQueryClient(context.api.queryClient),
      ecocredit: new EcocreditQueryClient(context.api.queryClient),
      basket: new BasketQueryClient(context.api.queryClient),
    });
  }, [context.api?.queryClient, queryClients]);

  return {
    api: forceExp ? expApi : context.api,
    loading: forceExp ? expLoading : context.loading,
    error: forceExp ? expError : context.error,
    queryClients,
  };
};
