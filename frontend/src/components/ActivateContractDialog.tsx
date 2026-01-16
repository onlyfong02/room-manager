import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

const activateSchema = z.object({
    startDate: z.string().min(1, 'Required'),
    endDate: z.string().optional().nullable(),
});

type ActivateFormValues = z.infer<typeof activateSchema>;

interface ActivateContractDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: ActivateFormValues) => void;
    initialData: {
        startDate: string;
        endDate?: string | null;
    };
    isSubmitting?: boolean;
}

export const ActivateContractDialog: React.FC<ActivateContractDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    initialData,
    isSubmitting,
}) => {
    const { t } = useTranslation();

    const form = useForm<ActivateFormValues>({
        resolver: zodResolver(activateSchema),
        defaultValues: {
            startDate: initialData.startDate ? format(new Date(initialData.startDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
            endDate: initialData.endDate ? format(new Date(initialData.endDate), 'yyyy-MM-dd') : '',
        },
    });

    const handleSubmit = (values: ActivateFormValues) => {
        onConfirm(values);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('contracts.activateTitle')}</DialogTitle>
                    <DialogDescription>
                        {t('contracts.activateDescription')}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('contracts.startDate')}</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('contracts.endDate')}</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="mt-6">
                            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
                                {t('common.cancel')}
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t('contracts.activateConfirm')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
