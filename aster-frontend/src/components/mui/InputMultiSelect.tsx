import { Select, FormControl, InputLabel, MenuItem, Stack, Chip } from "@mui/material";
import type { SelectProps } from "@mui/material/Select";
import { styled } from "@mui/material/styles";

const StyledFormControl = styled(FormControl)(() => ({
   width: 'fit-content',
    ".MuiOutlinedInput-root": {
        maxHeight: '60px',
        minHeight: '50px',
        width: '100%',
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

export default function StyledInputMultiSelect(props: SelectProps<string[]>) {
    return (
        <StyledFormControl sx={{ width: "100%", ...props.sx }}>
            <InputLabel id='multi-select-label' shrink>{props.label}</InputLabel>
            <Select
                multiple
                value={props.value}
                onChange={props.onChange}
                labelId="multi-select-label"
                renderValue={(selected) => (
                    <Stack direction="row" spacing={1}>
                        {(selected as string[]).filter((v) => v !== '').map((value) => (
                            <Chip key={value} label={value}/>
                        ))}
                    </Stack>
                )}
            >
                {props.children} {/* Aqui você pode passar os MenuItems */}
            </Select>
        </StyledFormControl>
    );
}
