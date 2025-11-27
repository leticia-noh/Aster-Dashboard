import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { DevolutivaTicket } from '../../types/devolutiva-ticket.ts'
import { Stack, Card, CardHeader, Typography, MenuItem, Box } from '@mui/material'
import StyledInputText from '../mui/InputText.tsx'
import StyledInputSelect from '../mui/InputSelect.tsx'
import { useLocation, useNavigate } from 'react-router'
import Glass from '../Glass.tsx'
import ProfileMenu from '../ProfileMenu.tsx'
import { CriarDevolutivaTicket, EditarDevolutivaTicket } from '../../actions/devolutiva/DevolutivaTicket.ts'
import { ListProduto } from '../../actions/Produto.ts'
import { useEffect } from 'react'
import type { ProdutoFormSchemaType } from './ProdutoForm.tsx'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SubmitDialog from '../mui/SubmitDialog.tsx'

// Schema para validação da entidade
const DevolutivaTicketFormSchema = z.object({
    id: z.string().min(1, 'Campo obrigatório').max(20, 'Limite máximo de caracteres'),
    status: z.string().min(1, 'Campo obrigatório').max(20, 'Limite máximo de caractetes'),
    resposta: z.string().min(1, 'Campo obrigatório').max(500, 'Limite máximo de caracteres'),
    dataEnvio: z.string().min(1, 'Campo obrigatório'),
    assunto: z.string().min(1, 'Campo obrigatório').max(50, 'Limite máximo de caracteres'),
    produtoId: z.string().length(4, 'Campo deve ter exatamente 4 caracteres'),
    clienteDocumento: z.string().min(1, 'Campo obrigatório').max(30, 'Limite máximo de caracteres'),
    mensagem: z.string().min(1, 'Campo obrigatório').max(500, 'Limite máximo de caracteres'),
})

export type DevolutivaTicketFormSchemaType = z.infer<typeof DevolutivaTicketFormSchema>

type devolutivaTicketProps = {
    devolutivaTicket?: DevolutivaTicket
}

export default function DevolutivaTicketForm({ devolutivaTicket }: devolutivaTicketProps) {
    // Router
    const navigate = useNavigate()

    const { state } = useLocation();
    const dados = state?.selectedRegister;
    devolutivaTicket = dados;

    // Valores padrão do formulário
    const defaultValues: DevolutivaTicketFormSchemaType = {
        id: '',
        status: '',
        resposta: '',
        dataEnvio: '',
        assunto: '',
        produtoId: '',
        clienteDocumento: '',
        mensagem: ''
    }

    // useForm
    const methods = useForm<DevolutivaTicketFormSchemaType>({
        mode: 'all',
        resolver: zodResolver(DevolutivaTicketFormSchema),
        defaultValues,
        values: devolutivaTicket && {
            id: devolutivaTicket.id,
            resposta: devolutivaTicket.resposta,
            status: devolutivaTicket.status,
            dataEnvio: devolutivaTicket.dataEnvio,
            assunto: devolutivaTicket.assunto,
            produtoId: devolutivaTicket.produtoId,
            clienteDocumento: devolutivaTicket.clienteDocumento,
            mensagem: devolutivaTicket.mensagem
        }
    })

    const { handleSubmit, reset, control, formState: { errors } } = methods

    // Handler criar/editar
    const handleCreateEdit: SubmitHandler<DevolutivaTicketFormSchemaType> = (async (data) => {
        try {
            if (devolutivaTicket) {
                // Hook de edit
                await EditarDevolutivaTicket({ ...data, dataEnvio: dayjs(data.dataEnvio).format('YYYY-MM-DD') })
                console.log('Edit - Payload enviado: ' + JSON.stringify(data))
            } else {
                // Hook de criar
                console.log('Create - Payload enviado: ' + JSON.stringify(data))
                await CriarDevolutivaTicket({ ...data, dataEnvio: dayjs(data.dataEnvio).format('YYYY-MM-DD') })
            }
            reset()
            navigate("/operacoes/exibir/devolutiva-ticket")
        } catch (error) {
            console.log(error)
        }
    })

    // Date pickers
    dayjs.locale('pt-br')
    console.log(dayjs(methods.watch('dataEnvio')).format('YYYY-MM-DD'))
    console.log(typeof (methods.watch('dataEnvio')))

    // Get de produtos
    const [produtos, setProdutos] = useState<ProdutoFormSchemaType[]>([]);
    useEffect(() => {
        async function fetchData() {
            const produtos = await ListProduto(0);
            setProdutos(produtos);
        }
        fetchData();
    }, []);

    // Lista de status
    const status = [
        'Pendente',
        'Em análise',
        'Respondido'
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
                    <CardHeader title='Criar - Devolutiva ticket' sx={{ fontWeight: 'bold', px: 0, pt: 1 }} titleTypographyProps={{
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
                                name="resposta"
                                control={control}
                                render={({ field }) => (
                                    <StyledInputText
                                        error={!!errors.resposta}
                                        helperText={errors.resposta?.message}
                                        label="Resposta"
                                        placeholder="Resposta"
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        inputRef={field.ref}
                                        slotProps={{ inputLabel: { shrink: true } }}
                                        sx={{ width: '48%' }}
                                    />
                                )}
                            />
                        </Stack>
                        <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Controller
                                name='dataEnvio'
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
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <StyledInputSelect
                                        error={!!errors.status}
                                        label="Status"
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        inputRef={field.ref}
                                        sx={{ width: '48%' }}
                                    >
                                        <MenuItem value="">Selecione uma da opções abaixo</MenuItem>
                                        {status.map((status, index) => (
                                            <MenuItem key={index} value={status}>
                                                {status}
                                            </MenuItem>
                                        ))}
                                    </StyledInputSelect>
                                )}
                            />
                        </Stack>
                        <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Controller
                                name="assunto"
                                control={control}
                                render={({ field }) => (
                                    <StyledInputText
                                        error={!!errors.assunto}
                                        helperText={errors.assunto?.message}
                                        label="Assunto"
                                        placeholder="Assunto"
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
                        </Stack>
                        <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Controller
                                name="clienteDocumento"
                                control={control}
                                render={({ field }) => (
                                    <StyledInputText
                                        error={!!errors.clienteDocumento}
                                        helperText={errors.clienteDocumento?.message}
                                        label="Documento do cliente"
                                        placeholder="Documento do cliente"
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
                                name="mensagem"
                                control={control}
                                render={({ field }) => (
                                    <StyledInputText
                                        error={!!errors.mensagem}
                                        helperText={errors.mensagem?.message}
                                        label="Mensagem"
                                        placeholder="Mensagem"
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        inputRef={field.ref}
                                        slotProps={{ inputLabel: { shrink: true } }}
                                        sx={{ width: '48%' }}
                                    />
                                )}
                            />
                        </Stack>

                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <SubmitDialog label={devolutivaTicket ? 'Editar ' : 'Criar '} handleSubmit={handleSubmit(handleCreateEdit)} />
                        </Box>
                    </Stack>
                </Card>
            </Stack>
        </form>
    )
}