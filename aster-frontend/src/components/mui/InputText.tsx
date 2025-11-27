import TextField from "@mui/material/TextField";
import type { TextFieldProps } from "@mui/material/TextField";
import { styled } from "@mui/material/styles"

const InputText = styled(TextField)<TextFieldProps>(() => ({
    ".MuiOutlinedInput-root": {
        maxHeight: '50px',
    },
    "& .MuiInputBase-input": {
    },
    '& .MuiFormLabel-root': {
        fontSize: '20px',
        fontWeight: 'bold',
        color: 'var(--content-primary)',
        backgroundColor: '#fff',
        padding: '0 6px 0 0px',
    },
    '& .MuiInputBase-input::placeholder': {
        fontStyle: 'italic',
    }
}))

export default function StyledInputText(props: TextFieldProps) {
    return <InputText {...props} />
}