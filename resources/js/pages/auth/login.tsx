import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store().url, {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Sign In" />

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

                    <div className="grid gap-1.5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">Password</Label>
                            {canResetPassword && (
                                <Link
                                    href={request().url}
                                    className="text-xs font-medium text-primary hover:underline underline-offset-4 transition-colors"
                                    tabIndex={5}
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>
                        <PasswordInput
                            id="password"
                            name="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            className="h-9 rounded-sm border-border bg-background px-3 text-sm font-medium focus-visible:ring-primary/20 transition-all shadow-none"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onCheckedChange={checked => setData('remember', !!checked)}
                            tabIndex={3}
                            className="size-3.5 rounded-sm border-border shadow-none"
                        />
                        <Label htmlFor="remember" className="text-xs font-medium text-muted-foreground select-none cursor-pointer">Remember me for 30 days</Label>
                    </div>

                    <Button
                        type="submit"
                        className="mt-1 w-full h-9 rounded-sm bg-primary text-white hover:bg-primary/90 font-medium text-sm shadow-none transition-colors"
                        tabIndex={4}
                        disabled={processing}
                    >
                        {processing ? <Spinner className="mr-2 h-4 w-4" /> : 'Sign In'}
                    </Button>
                </div>

                {canRegister && (
                    <div className="text-center text-xs text-muted-foreground">
                        Don't have an account?{' '}
                        <Link href={register().url} className="text-primary font-medium hover:underline underline-offset-4 transition-colors" tabIndex={5}>
                            Create Account
                        </Link>
                    </div>
                )}

                <div className="mt-2 rounded-sm border border-border bg-muted/5 p-3 space-y-2">
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 text-center">Demo Access</h4>
                    <div className="grid gap-1.5">
                        <div className="flex items-center justify-between p-2 rounded-sm bg-background border border-border/50">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-primary">Admin</span>
                                <span className="text-xs font-medium text-muted-foreground tracking-tight">admin@learnsyntax.com</span>
                            </div>
                            <span className="text-[10px] font-medium text-muted-foreground/50 bg-muted px-1.5 py-0.5 rounded-sm">password</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-sm bg-background border border-border/50">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-indigo-500">Student</span>
                                <span className="text-xs font-medium text-muted-foreground tracking-tight">student@learnsyntax.com</span>
                            </div>
                            <span className="text-[10px] font-medium text-muted-foreground/50 bg-muted px-1.5 py-0.5 rounded-sm">password</span>
                        </div>
                    </div>
                </div>
            </form>

            {status && (
                <div className="mt-4 text-center text-[11px] font-medium text-emerald-600 bg-emerald-50 py-2 rounded-sm border border-emerald-100">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Welcome Back',
    description: 'Please enter your credentials to access your portal',
};
