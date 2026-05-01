import { Head, Link, useForm, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { send } from '@/routes/verification';
import SettingsLayout from '@/layouts/settings/layout';
import { User, Mail, CheckCircle2 } from 'lucide-react';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props as any;

    const { data, setData, patch, processing, errors } = useForm({
        name: auth.user.name,
        email: auth.user.email,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(ProfileController.update.url, {
            preserveScroll: true,
        });
    };

    return (
            <div className="space-y-4">
                {/* Profile Form */}
                <div className="rounded-sm border border-border bg-card overflow-hidden">
                    <div className="px-4 py-3 border-b border-border bg-muted/5">
                        <h2 className="text-sm font-semibold text-foreground">Profile Information</h2>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Update your account's profile information and email address.</p>
                    </div>
                    
                    <form onSubmit={submit} className="p-4 space-y-4 max-w-xl">
                        <div className="grid gap-1.5">
                            <Label htmlFor="name" className="text-xs font-medium text-muted-foreground">Display Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/50" />
                                <Input
                                    id="name"
                                    className="pl-9 h-9 rounded-sm border-border text-sm shadow-none focus-visible:ring-1"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    required
                                    autoComplete="name"
                                    placeholder="Your full name"
                                />
                            </div>
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/50" />
                                <Input
                                    id="email"
                                    type="email"
                                    className="pl-9 h-9 rounded-sm border-border text-sm shadow-none focus-visible:ring-1"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    required
                                    autoComplete="username"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div className="p-3 rounded-sm bg-amber-50 border border-amber-100 flex gap-3 items-start">
                                <div className="p-1 rounded-full bg-amber-100 text-amber-600 mt-0.5">
                                    <CheckCircle2 className="size-3" />
                                </div>
                                <div>
                                    <p className="text-[11px] text-amber-800 font-medium">
                                        Your email address is unverified.
                                    </p>
                                    <Link
                                        href={send()}
                                        as="button"
                                        className="text-[10px] text-amber-600 underline hover:text-amber-700 font-bold mt-1"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                    {status === 'verification-link-sent' && (
                                        <div className="mt-1 text-[10px] font-bold text-emerald-600">
                                            A new verification link has been sent.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3 pt-2">
                            <Button disabled={processing} size="sm" className="h-8 px-6 rounded-sm text-xs font-medium">
                                {processing ? 'Saving...' : 'Update Profile'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Delete Account Area */}
                <DeleteUser />
            </div>
    );
}
