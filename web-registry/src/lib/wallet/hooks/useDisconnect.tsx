import { MutableRefObject, useCallback } from 'react';
import WalletConnect from '@walletconnect/client';

import { UseStateSetter } from 'types/react/use-state';

import { Wallet } from '../wallet';
import {
  AUTO_CONNECT_WALLET_KEY,
  emptySender,
  WALLET_CONNECT_KEY,
} from '../wallet.constants';
import { WalletConfig } from '../walletsConfig/walletsConfig.types';

type Props = {
  walletConnect?: WalletConnect;
  setWallet: UseStateSetter<Wallet>;
  setConnectionType: UseStateSetter<string | undefined>;
  setWalletConnectUri: UseStateSetter<string | undefined>;
  walletConfigRef: MutableRefObject<WalletConfig | undefined>;
  setWalletConnect: UseStateSetter<WalletConnect | undefined>;
};

export type DisconnectType = () => Promise<void>;

export const useDisconnect = ({
  walletConnect,
  setConnectionType,
  setWallet,
  setWalletConnectUri,
  setWalletConnect,
  walletConfigRef,
}: Props): DisconnectType => {
  const disconnect = useCallback(async (): Promise<void> => {
    if (walletConnect) {
      try {
        await walletConnect.killSession();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }

    setWallet(emptySender);
    setConnectionType(undefined);
    setWalletConnect(undefined);
    setWalletConnectUri(undefined);
    walletConfigRef.current = undefined;
    localStorage.removeItem(AUTO_CONNECT_WALLET_KEY);
    localStorage.removeItem(WALLET_CONNECT_KEY);
  }, [
    setConnectionType,
    setWallet,
    setWalletConnect,
    setWalletConnectUri,
    walletConfigRef,
    walletConnect,
  ]);

  return disconnect;
};
