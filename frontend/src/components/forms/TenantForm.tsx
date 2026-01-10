import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { useTenantSchema } from '@/lib/validations';

export type TenantFormData = z.infer<ReturnType<typeof useTenantSchema>>;

interface TenantFormProps {
    defaultValues?: Partial<TenantFormData>;
    onSubmit: (data: TenantFormData) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export default function TenantForm({
    defaultValues,
    onSubmit,
    onCancel,
    isSubmitting = false,
}: TenantFormProps) {
    const { t } = useTranslation();
    const schema = useTenantSchema();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TenantFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            idNumber: '',
            dateOfBirth: '',
            gender: undefined,
            address: '',
            occupation: '',
            ...defaultValues,
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 py-4 px-1 max-h-[60vh] overflow-y-auto">
                {defaultValues?.code && (
                    <div className="space-y-2">
                        <Label>{t('tenants.code')}</Label>
                        <Input value={defaultValues.code} disabled className="bg-muted" />
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="fullName">{t('tenants.fullName')} <span className="text-destructive">*</span></Label>
                    <Input
                        id="fullName"
                        {...register('fullName')}
                        className={errors.fullName ? 'border-destructive' : ''}
                    />
                    {errors.fullName && (
                        <p className="text-sm text-destructive">{errors.fullName.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">{t('tenants.email')}</Label>
                        <Input
                            id="email"
                            type="email"
                            {...register('email')}
                            className={errors.email ? 'border-destructive' : ''}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">{t('tenants.phone')} <span className="text-destructive">*</span></Label>
                        <Input
                            id="phone"
                            {...register('phone')}
                            className={errors.phone ? 'border-destructive' : ''}
                        />
                        {errors.phone && (
                            <p className="text-sm text-destructive">{errors.phone.message}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="idNumber">{t('tenants.idNumber')} <span className="text-destructive">*</span></Label>
                    <Input
                        id="idNumber"
                        {...register('idNumber')}
                        className={errors.idNumber ? 'border-destructive' : ''}
                    />
                    {errors.idNumber && (
                        <p className="text-sm text-destructive">{errors.idNumber.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">{t('tenants.dateOfBirth')}</Label>
                        <Input
                            id="dateOfBirth"
                            type="date"
                            {...register('dateOfBirth')}
                            defaultValue={defaultValues?.dateOfBirth || ''}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gender">{t('tenants.gender')}</Label>
                        <select
                            id="gender"
                            {...register('gender')}
                            defaultValue={defaultValues?.gender || ''}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="">{t('tenants.selectGender')}</option>
                            <option value="MALE">{t('tenants.genderMale')}</option>
                            <option value="FEMALE">{t('tenants.genderFemale')}</option>
                            <option value="OTHER">{t('tenants.genderOther')}</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="address">{t('tenants.address')}</Label>
                    <Input id="address" {...register('address')} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="occupation">{t('tenants.occupation')}</Label>
                    <Input id="occupation" {...register('occupation')} />
                </div>

                <div className="border-t pt-4 mt-4">
                    <h3 className="font-medium mb-4">{t('tenants.emergencyContact')}</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="ecName">{t('tenants.ecName')}</Label>
                            <Input id="ecName" {...register('emergencyContact.name')} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="ecPhone">{t('tenants.ecPhone')}</Label>
                                <Input id="ecPhone" {...register('emergencyContact.phone')} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ecRelationship">{t('tenants.ecRelationship')}</Label>
                                <Input id="ecRelationship" {...register('emergencyContact.relationship')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={onCancel}>
                    {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {t('common.save')}
                </Button>
            </DialogFooter>
        </form>
    );
}
