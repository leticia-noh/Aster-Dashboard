import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Pacote } from '../../types/pacote.ts'
import { Stack, Card, CardHeader, Typography, Box } from '@mui/material'
import StyledInputText from '../mui/InputText.tsx'
import { useLocation, useNavigate } from 'react-router'
import Glass from '../Glass.tsx'
import ProfileMenu from '../ProfileMenu.tsx'
import { CriarPacote, EditarPacote } from '../../actions/Pacote.ts'
import SubmitDialog from '../mui/SubmitDialog.tsx'

// Schema para validação da entidade
const PacoteFormSchema = z.object({
    nome: z.string().min(1, 'Campo obrigatório'),
    precoIndividual: z.string().refine((value) => Number(value) >= 0, {
        message: 'Campo deve ser positivo',
    }),
    precoOrganizacional: z.string().refine((value) => Number(value) >= 0, {
        message: 'Campo deve ser positivo',
    }),
})

export type PacoteFormSchemaType = z.infer<typeof PacoteFormSchema>

type pacoteProps = {
    pacote?: Pacote
}

export default function PacoteForm({ pacote }: pacoteProps) {
    // Router
    const navigate = useNavigate()

    const { state } = useLocation();
    const dados = state?.selectedRegister;
    pacote = dados;

    // Valores padrão do formulário
    const defaultValues: PacoteFormSchemaType = {
        nome: '',
        precoIndividual: '',
        precoOrganizacional: '',
    }

    // useForm
    const methods = useForm<PacoteFormSchemaType>({
        mode: 'all',
        resolver: zodResolver(PacoteFormSchema),
        defaultValues,
        values: pacote && {
            nome: pacote.nome,
            precoIndividual: pacote.precoIndividual,
            precoOrganizacional: pacote.precoOrganizacional
        }
    })

    const { handleSubmit, reset, control, formState: { errors } } = methods

    // Handler criar/editar
    const handleCreateEdit: SubmitHandler<PacoteFormSchemaType> = (async (data) => {
        try {
            if (pacote) {
                // Hook de edit
                await EditarPacote(data)
                console.log('Edit - Payload enviado: ' + JSON.stringify(data))
            } else {
                await CriarPacote(data)
                console.log('Create - Payload enviaod: ' + JSON.stringify(data))
                // Hook de criar
            }
            reset()
            navigate("/operacoes/exibir/pacote")
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
                    <CardHeader title='Criar - Pacote' sx={{ fontWeight: 'bold', px: 0, pt: 1 }} titleTypographyProps={{
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
                                name="precoIndividual"
                                control={control}
                                render={({ field }) => (
                                    <StyledInputText
                                        error={!!errors.precoIndividual}
                                        helperText={errors.precoIndividual?.message}
                                        label="Preço individual"
                                        placeholder="Preço individual"
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
                            name="precoOrganizacional"
                            control={control}
                            render={({ field }) => (
                                <StyledInputText
                                    error={!!errors.precoOrganizacional}
                                    helperText={errors.precoOrganizacional?.message}
                                    label="Preço organizacional"
                                    placeholder="Preço organizacional"
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
                            <SubmitDialog label={pacote ? 'Editar ' : 'Criar '} handleSubmit={handleSubmit(handleCreateEdit)} />
                        </Box>
                    </Stack>
                </Card>
            </Stack>
        </form>
    )
}