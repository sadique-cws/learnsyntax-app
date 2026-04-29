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
            <Head title="Log in" />

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid gap-4">
                    <div className="grid gap-1.5">
                        <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Protocol</Label>
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
                            placeholder="admin@learnsyntax.com"
                            className="rounded-lg border-border bg-muted/20 h-10 px-3 text-sm font-bold focus-visible:ring-primary/20 transition-all shadow-none"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-1.5">
                        <div className="flex items-center justify-between ml-1">
                            <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Access Key</Label>
                            {canResetPassword && (
                                <Link
                                    href={request().url}
                                    className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                                    tabIndex={5}
                                >
                                    Recovery?
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
                            className="rounded-lg border-border bg-muted/20 h-10 px-3 text-sm font-bold focus-visible:ring-primary/20 transition-all shadow-none"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-2 ml-1">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onCheckedChange={checked => setData('remember', !!checked)}
                            tabIndex={3}
                            className="rounded border-border shadow-none"
                        />
                        <Label htmlFor="remember" className="text-[11px] font-bold text-muted-foreground/80 select-none cursor-pointer">Maintain Session</Label>
                    </div>

                    <Button
                        type="submit"
                        className="mt-2 w-full h-10 rounded-lg bg-primary text-white hover:bg-primary/90 font-black uppercase tracking-[0.2em] text-[11px] shadow-none active:translate-y-px transition-all"
                        tabIndex={4}
                        disabled={processing}
                        data-test="login-button"
                    >
                        {processing && <Spinner className="mr-2" />}
                        Authenticate
                    </Button>
                </div>

                {canRegister && (
                    <div className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        New Identity?{' '}
                        <Link href={register().url} className="text-primary font-black hover:text-primary/80 transition-colors ml-1" tabIndex={5}>
                            Initialize Account
                        </Link>
                    </div>
                )}

                <div className="mt-2 rounded-xl border border-dashed border-border bg-muted/10 p-3">
                    <h4 className="mb-3 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 text-center flex items-center justify-center gap-2 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">Registry Presets</h4>
                    <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-background border border-border/30">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase tracking-widest text-primary mb-0.5">Admin Hub</span>
                                <span className="text-[10px] font-mono text-slate-500 font-bold leading-none tracking-tight">admin@learnsyntax.com</span>
                            </div>
                            <div className="px-1.5 py-0.5 bg-muted rounded-md text-[9px] font-black text-slate-400 uppercase tracking-widest border border-border/20">password</div>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-background border border-border/30">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase tracking-widest text-accent mb-0.5">Student Node</span>
                                <span className="text-[10px] font-mono text-slate-500 font-bold leading-none tracking-tight">student@learnsyntax.com</span>
                            </div>
                            <div className="px-1.5 py-0.5 bg-muted rounded-md text-[9px] font-black text-slate-400 uppercase tracking-widest border border-border/20">password</div>
                        </div>
                    </div>
                </div>
            </form>

            {status && (
                <div className="mt-4 text-center text-xs font-bold text-green-600 bg-green-50 py-2 rounded-lg border border-green-100">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Welcome Back',
    description: 'Please enter your details to sign in',
};
