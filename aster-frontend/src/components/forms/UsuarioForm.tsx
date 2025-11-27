// ----- To-do -----
// 1. Validação com zod ok
// 2. Estrutura do form com MUI ok
// 3. HandleSubmit com o hook de CREATE/EDIT ok
// 4. Caso a entidade contenha chaves estrangeiras com poucos registro, fazem select ok
// 5. Utilizar o RHF para controlar o form ok
// 6. Colocar o router ok
// ----- * -----

import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Usuario } from '../../types/usuario.ts'
import { Stack, Card, CardHeader, Typography, Box } from '@mui/material'
import StyledInputText from '../mui/InputText.tsx'
import Button from '../Button.tsx'
import { useLocation, useNavigate } from 'react-router'
import { useEffect } from 'react'
import Glass from '../Glass.tsx'
import ProfileMenu from '../ProfileMenu.tsx'
import { CriarUsuario, EditarUsuario } from '../../actions/Usuario.ts'
import SubmitDialog from '../mui/SubmitDialog.tsx'

// Schema para validação da entidade
const UsuarioFormSchema = z.object({
    chaveUso: z.string().length(14, 'Campo deve conter 14 caracteres')
})

export type UsuarioFormSchemaType = z.infer<typeof UsuarioFormSchema>

type usuarioProps = {
    usuario?: Usuario
}

// Props do produto em caso de edit
export default function UsuarioForm({ usuario }: usuarioProps) {
    // Router
    const navigate = useNavigate()

    const { state } = useLocation();
    const dados = state?.selectedRegister;
    usuario = dados;

    // Valores padrão do formulário
    const defaultValues: UsuarioFormSchemaType = {
        chaveUso: ''
    }

    // useForm
    const methods = useForm<UsuarioFormSchemaType>({
        mode: 'all',
        resolver: zodResolver(UsuarioFormSchema),
        defaultValues,
        values: usuario && {
            chaveUso: usuario.chaveUso
        }
    })

    // Methods do useForm
    const { handleSubmit, reset, control, formState: { errors } } = methods

    // Debug
    useEffect(() => {
        console.log(methods.getValues())
    }, [methods.watch()])

    // Handler criar/editar
    const handleCreateEdit: SubmitHandler<UsuarioFormSchemaType> = (async (data) => {
        try {
            if (usuario) {
                // Hook de edit
                await EditarUsuario(data)
                console.log('Edit - Payload enviado: ' + JSON.stringify(data))
            } else {
                await CriarUsuario(data)
                console.log('Create - Payload enviaod: ' + JSON.stringify(data))
                // Hook de criar
            }
            reset()
            navigate("/operacoes/exibir/usuario")
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
                    <CardHeader title='Criar - Usuário' sx={{ fontWeight: 'bold', px: 0, pt: 1 }} titleTypographyProps={{
                        sx: { fontWeight: 'bold', fontSize: '40px', color: 'var(--content-primary)' }
                    }}>
                    </CardHeader>
                    <Typography sx={{ pb: 5 }}>
                        Para criar um registro preencha as informações abaixo:
                    </Typography>
                    <Stack spacing={4}>
                        <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Controller
                                name="chaveUso"
                                control={control}
                                render={({ field }) => (
                                    <StyledInputText
                                        error={!!errors.chaveUso}
                                        helperText={errors.chaveUso?.message}
                                        label="Chave de uso"
                                        placeholder="Chave de uso"
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        inputRef={field.ref}
                                        slotProps={{ inputLabel: { shrink: true } }}
                                        sx={{ width: '100%' }}
                                    />
                                )}
                            />
                        </Stack>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <SubmitDialog label={usuario ? 'Editar ' : 'Criar '} handleSubmit={handleSubmit(handleCreateEdit)} />
                        </Box>
                    </Stack>
                </Card>
            </Stack>
        </form >
    )

}