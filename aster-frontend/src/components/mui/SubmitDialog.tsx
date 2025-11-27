import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';

export default function SubmitDialog({ label, handleSubmit }: { label: string, handleSubmit: () => void }) {

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}
                sx={{
                    display: 'flex',
                    width: '128px',
                    height: '44px',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: '#3D3E4A',
                    boxShadow: '0px 2px 4px 0 rgba(0, 0, 0, 0.25)',
                    borderRadius: '80px',
                    borderColor: '#3D3E4A'
                }}>
                <Typography sx={{
                    backgroundImage: 'linear-gradient(257deg, #CB9AD2 0%, #BBB3D9 50%, #ABC2E2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFamily: 'Segoe UI',
                    textTransform: 'capitalize',
                    fontSize: '14px',
                    fontWeight: '600'
                }}>
                    {label}
                </Typography>
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    sx: {
                        display: 'flex',
                        width: '432px',
                        height: '248px',
                        padding: '12px 24px',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '10px',
                        flexShrink: '0',
                        borderRadius: '24px',
                        background: 'rgba(255, 255, 255, 0.55)',
                        boxShadow: '0 0 16px 0 rgba(0, 0, 0, 0.15)',
                    }
                }}
                sx={{
                    '& .MuiBackdrop-root': {
                        backgroundColor: 'rgba(0, 0, 0, 0.30)',
                        backdropFilter: 'blur(10px)',
                    }
                }}
            >
                <DialogTitle id="alert-dialog-title" sx={{
                    color: "#000",
                    fontFamily: "Segoe UI",
                    fontSize: '20px',
                    fontStyle: 'normal',
                    fontWeight: '700',
                    lineHeight: 'normal',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {"Confirmar envio"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" sx={{
                        color: '#000',
                        fontFamily: "Segoe UI",
                        fontSize: '16px',
                        fontStyle: 'normal',
                        fontWeight: '400',
                        lineHeight: 'normal'
                    }}>
                        Por favor, revise todos os dados informados e certifique-se de que estão corretos antes de prosseguir com a confirmação
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{
                    display: 'flex',
                    padding: '30px 10px 10px 10px',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    gap: '20px',
                    alignSelf: 'stretch'
                }}>
                    <Button onClick={handleClose}
                        sx={{
                            display: 'flex',
                            height: '42px',
                            width: '50%',
                            minWidth: '128px',
                            minHeight: '36px',
                            padding: '8px 32px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: "30px",
                            borderRadius: '30px',
                            background: 'white',
                            fontFamily: "Segoe UI",
                            fontSize: '14px',
                            fontStyle: 'normal',
                            fontWeight: '700',
                            lineHeight: 'normal',
                            color: 'var(--content-primary)',
                            textTransform: 'capitalize'
                        }}
                    >Cancelar</Button>
                    <Button onClick={() => {
                        handleSubmit();
                        handleClose();
                    }} autoFocus type='submit'
                        sx={{
                            display: 'flex',
                            height: '42px',
                            width: '50%',
                            minWidth: '128px',
                            minHeight: '36px',
                            padding: '8px 32px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: "30px",
                            borderRadius: '30px',
                            background: 'linear-gradient(257deg, #CB9AD2 0%, #BBB3D9 50%, #ABC2E2 100%)',
                            fontFamily: "Segoe UI",
                            fontSize: '14px',
                            fontStyle: 'normal',
                            fontWeight: '700',
                            lineHeight: 'normal',
                            color: 'white',
                            textTransform: 'capitalize'
                        }}>
                        Enviar
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment >
    );
}