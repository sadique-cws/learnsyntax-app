import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store().url, {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Confirm Password" />

            <form onSubmit={submit} className="flex flex-col gap-5">
                <div className="grid gap-4">
                    <div className="grid gap-1.5">
                        <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">Password</Label>
                        <PasswordInput
                            id="password"
                            name="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            autoFocus
                            className="h-9 rounded-sm border-border bg-background px-3 text-sm font-medium focus-visible:ring-primary/20 transition-all shadow-none"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <Button
                        type="submit"
                        className="mt-1 w-full h-9 rounded-sm bg-primary text-white hover:bg-primary/90 font-medium text-sm shadow-none transition-colors"
                        disabled={processing}
                    >
                        {processing ? <Spinner className="mr-2 h-4 w-4" /> : 'Confirm Password'}
                    </Button>
                </div>
            </form>
        </>
    );
}

ConfirmPassword.layout = {
    title: 'Security Check',
    description: 'This is a secure area of the application. Please confirm your password to continue.',
};
