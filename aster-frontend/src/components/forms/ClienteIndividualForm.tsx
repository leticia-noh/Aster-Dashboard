import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ClienteIndividual } from '../../types/cliente-individual.ts'
import { Stack, Card, CardHeader, Typography, MenuItem, Box } from '@mui/material'
import StyledInputText from '../mui/InputText.tsx'
import StyledInputSelect from '../mui/InputSelect.tsx'
import { useLocation, useNavigate } from 'react-router'
import Glass from '../Glass.tsx'
import ProfileMenu from '../ProfileMenu.tsx'
import { CriarClienteIndividual, EditarClienteIndividual } from '../../actions/cliente/ClienteIndividual.ts'
import countries from 'i18n-iso-countries'
import pt from "i18n-iso-countries/langs/pt.json";
import SubmitDialog from '../mui/SubmitDialog.tsx'

// Schema para validação da entidade
const ClienteIndividualFormSchema = z.object({
    documento: z.string().min(1, 'Campo obrigatório').max(30, 'Limite máximo de caracteres'),
    nome: z.string().min(1, 'Campo obrigatório').max(40, 'Limite máximo de caracteres'),
    email: z.string().min(1, 'Campo obrigatório').max(30, 'Limite máximo de caracteres').includes('@'),
    regiao: z.string().min(1, 'Campo obrigatório').max(30, 'Limite máximo de caracteres'),
    continente: z.string().min(1, 'Campo obrigatório').max(20, 'Limite máximo de caracteres'),
    telefone: z.string().min(1, 'Campo obrigatório').max(15, 'Limite máximo de caracteres'),
    atividadeUso: z.string().min(1, 'Campo obrigatório').max(50, 'Limite máximo de caracteres'),
})

export type ClienteIndividualFormSchemaType = z.infer<typeof ClienteIndividualFormSchema>

type clienteIndividualProps = {
    clienteIndividual?: ClienteIndividual
}

export default function ClienteIndividualForm({ clienteIndividual }: clienteIndividualProps) {
    // Router
    const navigate = useNavigate()

    const { state } = useLocation();
    const dados = state?.selectedRegister;
    clienteIndividual = dados;

    // Valores padrão do formulário
    const defaultValues: ClienteIndividualFormSchemaType = {
        documento: '',
        nome: '',
        email: '',
        regiao: '',
        continente: '',
        telefone: '',
        atividadeUso: ''
    }

    // useForm
    const methods = useForm<ClienteIndividualFormSchemaType>({
        mode: 'all',
        resolver: zodResolver(ClienteIndividualFormSchema),
        defaultValues,
        values: clienteIndividual && {
            documento: clienteIndividual.documento,
            nome: clienteIndividual.nome,
            email: clienteIndividual.email,
            regiao: clienteIndividual.regiao,
            continente: clienteIndividual.continente,
            telefone: clienteIndividual.telefone,
            atividadeUso: clienteIndividual.atividadeUso
        }
    })

    const { handleSubmit, reset, control, formState: {errors} } = methods

    // Lista dos países 
    countries.registerLocale(pt)
    const codigoPais = countries.getNames("pt")
    const paises = Object.values(codigoPais)

    // Lista continentes
    const continentes = [
        'América do Sul',
        'América do Norte',
        'Europa',
        'Ásia',
        'África',
        'Oceania'
    ]

    // Handler criar/editar
    const handleCreateEdit: SubmitHandler<ClienteIndividualFormSchemaType> = (async (data) => {
        try {
            if (clienteIndividual) {
                // Hook de edit
                await EditarClienteIndividual(data)
                console.log('Edit - Payload enviado: ' + JSON.stringify(data))
            } else {
                await CriarClienteIndividual(data)
                console.log('Create - Payload enviaod: ' + JSON.stringify(data))
                // Hook de criar
            }
            reset()
            navigate("/operacoes/exibir/cliente-individual")
        } catch (error) {
            console.log(error)
        }
    })

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
                    <CardHeader title='Criar - Cliente individual' sx={{ fontWeight: 'bold', px: 0, pt: 1 }} titleTypographyProps={{
                        sx: { fontWeight: 'bold', fontSize: '40px', color: 'var(--content-primary)' }
                    }}>
                    </CardHeader>
                    <Typography sx={{ pb: 5 }}>
                        Para criar um registro preencha as informações abaixo:
                    </Typography>
                    <Stack spacing={4}>
                        <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Controller
                                name="nome"
                                control={control}
                                render={({ field }) => (
                                    <StyledInputText
                                        error={!!errors.nome}
                                        helperText={errors.nome?.message}
                                        label="Nome"
                                        placeholder="Nome"
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
                                name="documento"
                                control={control}
                                render={({ field }) => (
                                    <StyledInputText
                                        error={!!errors.documento}
                                        helperText={errors.documento?.message}
                                        label="Documento"
                                        placeholder="Documento"
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
                                name="regiao"
                                control={control}
                                render={({ field }) => (
                                    <StyledInputSelect
                                        error={!!errors.regiao}
                                        label="Região"
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        inputRef={field.ref}
                                        sx={{ width: '48%' }}
                                    >
                                        <MenuItem value="">Selecione uma da opções abaixo</MenuItem>
                                        {paises.map((pais) => (
                                            <MenuItem value={pais}>{pais}</MenuItem>
                                        ))}
                                    </StyledInputSelect>
                                )}
                            />
                            <Controller
                                name="continente"
                                control={control}
                                render={({ field }) => (
                                    <StyledInputSelect
                                        error={!!errors.continente}
                                        label="Continente"
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        inputRef={field.ref}
                                        sx={{ width: '48%' }}
                                    >
                                        <MenuItem value="">Selecione uma da opções abaixo</MenuItem>
                                        {continentes.map((continente) => (
                                            <MenuItem value={continente}>{continente}</MenuItem>
                                        ))}
                                    </StyledInputSelect>
                                )}
                            />
                        </Stack>
                        <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <StyledInputText
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        label="Email"
                                        placeholder="Email"
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
                                name="telefone"
                                control={control}
                                render={({ field }) => (
                                    <StyledInputText
                                        error={!!errors.telefone}
                                        helperText={errors.telefone?.message}
                                        label="Telefone"
                                        placeholder="Telefone"
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
                        <Controller
                            name="atividadeUso"
                            control={control}
                            render={({ field }) => (
                                <StyledInputText
                                    error={!!errors.atividadeUso}
                                    helperText={errors.atividadeUso?.message}
                                    label="Atividade de Uso"
                                    placeholder="Atividade de Uso"
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    inputRef={field.ref}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    sx={{ width: '48%' }}
                                />
                            )}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <SubmitDialog label={clienteIndividual ? 'Editar ' : 'Criar '} handleSubmit={handleSubmit(handleCreateEdit)} />
                        </Box>
                    </Stack>
                </Card>
            </Stack>
        </form>
    )
}