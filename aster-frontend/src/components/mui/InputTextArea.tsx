import TextField from "@mui/material/TextField";
import type { TextFieldProps } from "@mui/material/TextField";
import { styled } from "@mui/material/styles"

const InputTextArea = styled(TextField)<TextFieldProps>(() => ({

    "& .MuiInputBase-input": {
        minHeight: '250px',
        whiteSpace: "pre-wrap", // mantém quebras e espaços
        wordWrap: "break-word",
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

export default function StyledInputTextArea(props: TextFieldProps) {
    return <InputTextArea {...props} multiline />
}