import type { Licenca } from '../../types/licenca.ts'
import type { SubmitHandler } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { EditarLicenca, CriarLicenca } from '../../actions/Licenca.ts'
import { Stack, Card, CardHeader, Typography, MenuItem, Box, Checkbox, FormControlLabel } from '@mui/material'
import { ListProduto } from '../../actions/Produto.ts'
import StyledInputText from '../mui/InputText.tsx'
import StyledInputSelect from '../mui/InputSelect.tsx'
import { useEffect, useState } from 'react'
import Glass from '../Glass.tsx'
import ProfileMenu from '../ProfileMenu.tsx'
import type { ProdutoFormSchemaType } from './ProdutoForm.tsx'
import SubmitDialog from '../mui/SubmitDialog.tsx'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

const LicencaFormSchema = z.object({
    id: z.string().min(1, 'Campo obrigatório').max(20, 'Limite máximo de caracteres'),
    tipo: z.string().min(1, 'Campo obrigatório').max(10, 'Limite máximo de caracteres'),
    dataRegistro: z.string().min(1, 'Campo obrigatório'),
    ativa: z.boolean(),
    produtoId: z.string().min(1, 'Campo obrigatório').max(4, 'Limite máximo de caracteres')
})

export type LicencaFormSchemaType = z.infer<typeof LicencaFormSchema>

type licencaProps = {
    licenca?: Licenca
}

export default function LicencaForm({ licenca }: licencaProps) {
    // Router
    const navigate = useNavigate()

    const { state } = useLocation();
    const dados = state?.selectedRegister;
    licenca = dados;

    // Valores padrão do formulário
    const defaultValues: LicencaFormSchemaType = {
        id: '',
        tipo: '',
        dataRegistro: '',
        ativa: false,
        produtoId: '',
    }

    // useForm
    const methods = useForm<LicencaFormSchemaType>({
        mode: 'all',
        resolver: zodResolver(LicencaFormSchema),
        defaultValues,
        values: licenca && {
            id: licenca.id,
            tipo: licenca.tipo,
            dataRegistro: licenca.dataRegistro,
            ativa: licenca.ativa,
            produtoId: licenca.produtoId
        }
    })

    // Methods do useForm
    const { handleSubmit, reset, control, formState: { errors } } = methods

    // Handler criar/editar
    const handleCreateEdit: SubmitHandler<LicencaFormSchemaType> = (async (data) => {
        console.log(data)
        try {
            if (licenca) {
                // Hook de edit
                await EditarLicenca(data)
                console.log('Edit - Payload enviado: ' + JSON.stringify(data))
            } else {
                await CriarLicenca(data)
                console.log('Create - Payload enviaod: ' + JSON.stringify(data))
                // Hook de criar
            }
            reset()
            navigate("/operacoes/exibir/licenca")
        } catch (error) {
            console.log(error)
        }
    })

    // Get de produtos
    const [produtos, setProdutos] = useState<ProdutoFormSchemaType[]>([]);
    useEffect(() => {
        async function fetchData() {
            const produtos = await ListProduto(0);
            setProdutos(produtos);
        }
        fetchData();
    }, []);

    // Array de tipos
    const tipos: string[] = [
        'Mensal',
        'Anual',
        'Vitalícia',
        'Demo'
    ]

    return (
        <form onSubmit={handleSubmit(handleCreateEdit)}>
            <Stack sx={{ display: 'flex', flexDirection: 'column' }} spacing={4}>
                <section className="w-full flex flex-row items-center justify-center gap-6">
                    <Glass padding="p-3">
                        <div className="w-full min-h-10 min-w-[calc(100vw-33.25rem)] flex flex-row justify-center items-center">
                            <p className="font-semibold text-[var(--content-inverse)]">Criar registro</p>
                        </div>
                    </Glass>
                    <ProfileMenu />
                </section>
                <Card sx={{ p: 3, borderRadius: '30px', boxShadow: '2px 4px 10px 0 rgba(0, 0, 0, 0.15)' }}>
                    <CardHeader title='Criar - Licença' sx={{ fontWeight: 'bold', px: 0, pt: 1 }} titleTypographyProps={{
                        sx: { fontWeight: 'bold', fontSize: '40px', color: 'var(--content-primary)' }
                    }}>
                    </CardHeader>
                    <Typography sx={{ pb: 5 }}>
                        Para criar um registro preencha as informações abaixo:
                    </Typography>
                    <Stack spacing={4}>
                        <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Controller
                                name="id"
                                control={control}
                                render={({ field }) => (
                                    <StyledInputText
                                        error={!!errors.id}
                                        helperText={errors.id?.message}
                                        label="Id"
                                        placeholder="Id"
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        inputRef={field.ref}
                                        slotProps={{ inputLabel: { shrink: true } }}
                                        sx={{ width: '48%' }}
                                    />
                                )}
                            />
                            <Controller
                                name='dataRegistro'
                                control={control}
                                render={({ field }) => (
                                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='pt-br'>
                                        <Box sx={{ width: '48%' }}>
                                            <DatePicker
                                                label="Data de envio"
                                                value={field.value ? dayjs(field.value) : null}
                                                onChange={(newValue) => {
                                                    field.onChange(newValue ? newValue.format("YYYY-MM-DD") : "");
                                                }}
                                                format='DD/MM/YYYY'
                                                slotProps={{
                                                    textField: {
                                                        InputLabelProps: {
                                                            shrink: true
                                                        },
                                                        fullWidth: true,
                                                        sx: {
                                                            "& .MuiInputLabel-root": {
                                                                fontWeight: "bold",
                                                                fontSize: '20px',
                                                                padding: '0 6px 0 0px',
                                                                backgroundColor: "#fff",
                                                                color: 'var(--content-primary)'
                                                            },
                                                            "& .MuiPickersInputBase-root": {
                                                                height: 50,
                                                                minHeight: 50,
                                                                display: "flex",
                                                                alignItems: "center",
                                                            },

                                                            "& .MuiOutlinedInput-input": {
                                                                padding: "0 14px",
                                                            },
                                                        }
                                                    }
                                                }}
                                            />
                                        </Box>
                                    </LocalizationProvider>
                                )}
                            />
                        </Stack>
                        <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Controller
                                name="produtoId"
                                control={control}
                                render={({ field }) => (
                                    <StyledInputSelect
                                        error={!!errors.produtoId}
                                        label="Produto"
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        inputRef={field.ref}
                                        sx={{ width: '48%' }}
                                    >
                                        <MenuItem value="">Selecione uma da opções abaixo</MenuItem>
                                        {produtos.map((produto) => (
                                            <MenuItem value={produto.id}>{produto.nome}</MenuItem>
                                        ))}
                                    </StyledInputSelect>
                                )}
                            />
                            <Controller
                                name="tipo"
                                control={control}
                                render={({ field }) => (
                                    <StyledInputSelect
                                        error={!!errors.tipo}
                                        label="Tipo de licença"
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        inputRef={field.ref}
                                        sx={{ width: '48%' }}
                                    >
                                        <MenuItem value="">Selecione uma da opções abaixo</MenuItem>
                                        {tipos.map((tipo, index) => (
                                            <MenuItem key={index} value={tipo}>
                                                {tipo}
                                            </MenuItem>
                                        ))}
                                    </StyledInputSelect>
                                )}
                            />
                        </Stack>
                        <Box
                            sx={{ width: '48%', justifyContent: 'left' }}>
                            <Controller
                                name='ativa'
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        label='Ativa'
                                        control={
                                            <Checkbox
                                                {...field}
                                                checked={Boolean(field.value)}
                                            />
                                        }
                                    />
                                )}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <SubmitDialog label={licenca ? 'Editar ' : 'Criar '} handleSubmit={handleSubmit(handleCreateEdit)} />
                        </Box>
                    </Stack>
                </Card>
            </Stack>
        </form>
    )
}