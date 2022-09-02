import { Dialog, DialogTitle } from '@mui/material';

const Preferences = (props: { open: boolean; onClose: () => void }) => {
    return (
        <Dialog maxWidth='md' fullWidth {...props}>
            <DialogTitle>Preferences</DialogTitle>
        </Dialog>
    );
};
export default Preferences;
