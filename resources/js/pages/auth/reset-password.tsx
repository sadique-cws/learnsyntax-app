import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
};

export default function ResetPassword({ token, email }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(update().url, {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Reset Password" />

            <form onSubmit={submit} className="flex flex-col gap-5">
                <div className="grid gap-4">
                    <div className="grid gap-1.5">
                        <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            value={data.email}
                            className="h-9 rounded-sm border-border bg-muted/30 px-3 text-sm font-medium opacity-70 cursor-not-allowed shadow-none"
                            readOnly
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">New Password</Label>
                        <PasswordInput
                            id="password"
                            name="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            autoComplete="new-password"
                            className="h-9 rounded-sm border-border bg-background px-3 text-sm font-medium focus-visible:ring-primary/20 transition-all shadow-none"
                            autoFocus
                            placeholder="••••••••"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="password_confirmation" className="text-xs font-medium text-muted-foreground">Confirm New Password</Label>
                        <PasswordInput
                            id="password_confirmation"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={e => setData('password_confirmation', e.target.value)}
                            autoComplete="new-password"
                            className="h-9 rounded-sm border-border bg-background px-3 text-sm font-medium focus-visible:ring-primary/20 transition-all shadow-none"
                            placeholder="••••••••"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button
                        type="submit"
                        className="mt-1 w-full h-9 rounded-sm bg-primary text-white hover:bg-primary/90 font-medium text-sm shadow-none transition-colors"
                        disabled={processing}
                    >
                        {processing ? <Spinner className="mr-2 h-4 w-4" /> : 'Reset Password'}
                    </Button>
                </div>
            </form>
        </>
    );
}

ResetPassword.layout = {
    title: 'Reset Password',
    description: 'Please choose a new secure password to regain access to your account.',
};
