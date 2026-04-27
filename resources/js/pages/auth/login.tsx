import { Form, Head, Link } from '@inertiajs/react';
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
    return (
        <>
            <Head title="Log in" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors, data, setData }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="name@example.com"
                                    className="rounded-xl border-border bg-background h-11 px-4 shadow-none focus-visible:ring-primary/20 transition-all"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between ml-1">
                                    <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</Label>
                                    {canResetPassword && (
                                        <Link
                                            href={request().url}
                                            className="text-[11px] font-bold text-primary hover:underline"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    className="rounded-xl border-border bg-background h-11 px-4 shadow-none focus-visible:ring-primary/20 transition-all"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-2 ml-1">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="rounded shadow-none border-border"
                                />
                                <Label htmlFor="remember" className="text-xs font-medium text-muted-foreground select-none">Remember me for 30 days</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full h-11 rounded-xl bg-primary hover:bg-primary/90 font-bold shadow-none tracking-wide"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner className="mr-2" />}
                                Sign In
                            </Button>
                        </div>

                        {canRegister && (
                            <div className="text-center text-xs font-medium text-muted-foreground">
                                New to Learn Syntax?{' '}
                                <Link href={register().url} className="text-primary font-bold hover:underline" tabIndex={5}>
                                    Create an account
                                </Link>
                            </div>
                        )}

                        {/* Demo Access Section - More styled */}
                        <div className="mt-2 rounded-2xl border border-dashed border-border bg-muted/30 p-4">
                            <h4 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 text-center">Demo Environment</h4>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex items-center justify-between p-2 rounded-lg bg-background border border-border/50">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase text-primary mb-0.5">Admin Account</span>
                                        <span className="text-[10px] font-mono text-foreground leading-none">admin@learnsyntax.com</span>
                                    </div>
                                    <div className="px-2 py-1 bg-muted rounded text-[9px] font-mono text-muted-foreground">password</div>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded-lg bg-background border border-border/50">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase text-accent mb-0.5">Student Account</span>
                                        <span className="text-[10px] font-mono text-foreground leading-none">student@learnsyntax.com</span>
                                    </div>
                                    <div className="px-2 py-1 bg-muted rounded text-[9px] font-mono text-muted-foreground">password</div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Form>

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
