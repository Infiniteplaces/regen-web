import React from 'react';
import { makeStyles, DefaultTheme as Theme } from '@mui/styles';
import Modal from '@mui/material/Modal';
import clsx from 'clsx';
import CloseIcon from '../icons/CloseIcon';
import { RemoveScroll } from 'react-remove-scroll';

export interface RegenModalProps {
  open: boolean;
  onClose: () => void;
  className?: string;
  closeIconColor?: string;
  isIFrame?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    outline: 'none',
    position: 'absolute',
    overflow: 'auto',
    '-webkit-overflow-scrolling': 'touch',
    [theme.breakpoints.up('sm')]: {
      // '&::-webkit-scrollbar': {
      //   width: '0.5em',
      // },
      // '&::-webkit-scrollbar-track': {
      //   boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      //   webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      //   marginTop: '20px',
      //   marginBottom: '20px',
      //   borderRadius: '6px',
      // },
      // '&::-webkit-scrollbar-thumb': {
      //   backgroundColor: 'rgba(0,0,0,.2)',
      //   borderRadius: '6px',
      // },
      borderRadius: '5px',
      transform: 'translate(-50%, -50%)',
      top: '50%',
      left: '50%',
      padding: `${theme.spacing(10.75)} ${theme.spacing(16.5)} ${theme.spacing(
        15,
      )}`,
    },
    maxWidth: theme.spacing(150),
    [theme.breakpoints.up('md')]: {
      width: '50%',
      maxHeight: '90%',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      width: '70%',
      maxHeight: '90%',
    },
    [theme.breakpoints.down('sm')]: {
      left: '0px',
      top: '0px',
      width: '100%',
      height: '100%',
      transform: 'none',
      padding: `${theme.spacing(13.25)} ${theme.spacing(4)} ${theme.spacing(
        20,
      )}`,
    },
    backgroundColor: theme.palette.grey[50],
    border: `1px solid ${theme.palette.grey[50]}`,
    boxShadow: theme.shadows[6],
    '& iframe': {
      width: '100%',
      height: '100%',
      border: 'none',
    },
  },
  closeIcon: {
    position: 'absolute',
    top: theme.spacing(2.5),
    right: theme.spacing(2.5),
    height: '26px',
    width: '26px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  iframe: {
    padding: '0',
    overflow: 'hidden',
    [theme.breakpoints.up('md')]: {
      height: '90%',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      height: '90%',
    },
  },
}));

const RegenModal: React.FC<RegenModalProps> = ({
  open,
  onClose,
  children,
  className,
  closeIconColor,
  isIFrame,
}) => {
  const styles = useStyles();
  return (
    <Modal open={open} onClose={onClose}>
      <RemoveScroll>
        <div
          className={clsx(styles.content, isIFrame && styles.iframe, className)}
        >
          {children}
          <div className={styles.closeIcon} onClick={onClose}>
            <CloseIcon svgColor={closeIconColor} />
          </div>
        </div>
      </RemoveScroll>
    </Modal>
  );
};

export default RegenModal;
