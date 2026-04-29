import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { request } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(request().url);
    };

    return (
        <>
            <Head title="Forgot Password" />

            {status && (
                <div className="mb-4 text-center text-[11px] font-medium text-emerald-600 bg-emerald-50 py-2 px-3 rounded-sm border border-emerald-100">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="flex flex-col gap-5">
                <div className="grid gap-4">
                    <div className="grid gap-1.5">
                        <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            placeholder="name@example.com"
                            className="h-9 rounded-sm border-border bg-background px-3 text-sm font-medium focus-visible:ring-primary/20 transition-all shadow-none"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <Button
                        type="submit"
                        className="mt-1 w-full h-9 rounded-sm bg-primary text-white hover:bg-primary/90 font-medium text-sm shadow-none transition-colors"
                        tabIndex={2}
                        disabled={processing}
                    >
                        {processing ? <Spinner className="mr-2 h-4 w-4" /> : 'Email Reset Link'}
                    </Button>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                    Remembered your password?{' '}
                    <Link href={login().url} className="text-primary font-medium hover:underline underline-offset-4 transition-colors" tabIndex={3}>
                        Back to Login
                    </Link>
                </div>
            </form>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Forgot Password?',
    description: 'Enter your email address and we will send you a secure link to reset your account access.',
};
