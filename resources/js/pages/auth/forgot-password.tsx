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
                <div className="mb-6 text-center text-xs font-bold text-green-600 bg-green-50 py-3 px-4 rounded-xl border border-green-100 animate-in fade-in zoom-in-95">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-xs font-bold  tracking-wider text-muted-foreground ml-1">Account Email</Label>
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
                            className="rounded-xl border-border bg-background h-11 px-4  focus-visible:ring-primary/20 transition-all"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <Button
                        type="submit"
                        className="mt-2 w-full h-11 rounded-xl bg-primary hover:bg-primary/90 font-bold  tracking-wide"
                        tabIndex={2}
                        disabled={processing}
                    >
                        {processing && <Spinner className="mr-2" />}
                        Send Reset Link
                    </Button>
                </div>

                <div className="text-center text-xs font-medium text-muted-foreground">
                    Remember your password?{' '}
                    <Link href={login().url} className="text-primary font-bold hover:underline" tabIndex={3}>
                        Back to login
                    </Link>
                </div>
            </form>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Forgot Password?',
    description: 'No problem. Just let us know your email address and we will email you a password reset link.',
};
