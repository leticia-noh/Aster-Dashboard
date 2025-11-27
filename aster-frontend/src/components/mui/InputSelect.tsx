import { Select, FormControl, InputLabel, MenuItem } from "@mui/material";
import type { SelectProps } from "@mui/material/Select";
import { styled } from "@mui/material/styles";

const StyledFormControl = styled(FormControl)(() => ({
   width: 'fit-content',
    ".MuiOutlinedInput-root": {
        maxHeight: '60px',
        minHeight: '50px',
        width: '100%'
    },
    ".MuiInputLabel-root": {
        fontWeight: "bold",
        fontSize: "18px",
        color: "var(--content-primary)",
        backgroundColor: "#fff",
        padding: "0 4px",
    },
    "& .MuiInputLabel-shrink": {
        transform: "translate(14px, -10px) scale(0.85)",
    },
    "& .MuiSelect-select": {
        padding: "12px 14px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#ccc",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#888",
    },
}));

export default function StyledInputSelect(props: SelectProps) {
    return (
        <StyledFormControl variant="outlined" sx={{ width: "100%", ...props.sx }}>
            <InputLabel shrink id={'select-id'}>{props.label}</InputLabel>
            <Select {...props} value={props.value} labelId="select-id" >
            </Select>
        </StyledFormControl>
    );
}
