import { Head, useForm } from '@inertiajs/react';
import { ShieldCheck, Lock, Key } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import SettingsLayout from '@/layouts/settings/layout';
import { disable, enable } from '@/routes/two-factor';

type Props = {
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

export default function Security({
    canManageTwoFactor = false,
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        clearTwoFactorAuthData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors: twoFactorErrors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
    const prevTwoFactorEnabled = useRef(twoFactorEnabled);

    const updatePasswordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const disable2FAForm = useForm({});
    const enable2FAForm = useForm({});

    useEffect(() => {
        if (prevTwoFactorEnabled.current && !twoFactorEnabled) {
            clearTwoFactorAuthData();
        }
        prevTwoFactorEnabled.current = twoFactorEnabled;
    }, [twoFactorEnabled, clearTwoFactorAuthData]);

    const updatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        updatePasswordForm.put(SecurityController.update.url, {
            preserveScroll: true,
            onSuccess: () => updatePasswordForm.reset(),
            onError: (errors) => {
                if (errors.password) passwordInput.current?.focus();
                if (errors.current_password) currentPasswordInput.current?.focus();
            },
        });
    };

    return (
        <SettingsLayout>
            <Head title="Security Settings" />

            <div className="space-y-4">
                {/* Update Password */}
                <div className="rounded-sm border border-border bg-card overflow-hidden">
                    <div className="px-4 py-3 border-b border-border bg-muted/5">
                        <h2 className="text-sm font-semibold text-foreground">Update Password</h2>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Ensure your account is using a long, random password to stay secure.</p>
                    </div>
                    
                    <form onSubmit={updatePassword} className="p-4 space-y-4 max-w-xl">
                        <div className="grid gap-1.5">
                            <Label htmlFor="current_password" name="current_password" className="text-xs font-medium text-muted-foreground">Current Password</Label>
                            <PasswordInput
                                id="current_password"
                                ref={currentPasswordInput}
                                value={updatePasswordForm.data.current_password}
                                onChange={e => updatePasswordForm.setData('current_password', e.target.value)}
                                className="h-9 rounded-sm border-border text-sm shadow-none focus-visible:ring-1"
                                placeholder="••••••••"
                            />
                            <InputError message={updatePasswordForm.errors.current_password} />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="password" name="password" className="text-xs font-medium text-muted-foreground">New Password</Label>
                            <PasswordInput
                                id="password"
                                ref={passwordInput}
                                value={updatePasswordForm.data.password}
                                onChange={e => updatePasswordForm.setData('password', e.target.value)}
                                className="h-9 rounded-sm border-border text-sm shadow-none focus-visible:ring-1"
                                placeholder="••••••••"
                            />
                            <InputError message={updatePasswordForm.errors.password} />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="password_confirmation" name="password_confirmation" className="text-xs font-medium text-muted-foreground">Confirm New Password</Label>
                            <PasswordInput
                                id="password_confirmation"
                                value={updatePasswordForm.data.password_confirmation}
                                onChange={e => updatePasswordForm.setData('password_confirmation', e.target.value)}
                                className="h-9 rounded-sm border-border text-sm shadow-none focus-visible:ring-1"
                                placeholder="••••••••"
                            />
                            <InputError message={updatePasswordForm.errors.password_confirmation} />
                        </div>

                        <div className="flex items-center pt-2">
                            <Button disabled={updatePasswordForm.processing} size="sm" className="h-8 px-6 rounded-sm text-xs font-medium">
                                {updatePasswordForm.processing ? 'Saving...' : 'Save Password'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Two-Factor Authentication */}
                {canManageTwoFactor && (
                    <div className="rounded-sm border border-border bg-card overflow-hidden">
                        <div className="px-4 py-3 border-b border-border bg-muted/5 flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-semibold text-foreground">Two-Factor Authentication</h2>
                                <p className="text-[11px] text-muted-foreground mt-0.5">Add an extra layer of security to your account using TOTP.</p>
                            </div>
                            {twoFactorEnabled && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
                                    Enabled
                                </span>
                            )}
                        </div>
                        
                        <div className="p-4 space-y-4">
                            <div className="flex gap-4">
                                <div className={cn(
                                    "size-10 rounded-sm flex items-center justify-center shrink-0 border",
                                    twoFactorEnabled ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-muted/5 border-border text-muted-foreground/40"
                                )}>
                                    <ShieldCheck className="size-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {twoFactorEnabled 
                                            ? "You will be prompted for a secure, random pin during login, which you can retrieve from your authenticator app."
                                            : "When you enable two-factor authentication, you will be prompted for a secure pin during login. This pin can be retrieved from a TOTP-supported application on your phone."
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="pt-2">
                                {twoFactorEnabled ? (
                                    <div className="space-y-4">
                                        <form onSubmit={(e) => { e.preventDefault(); disable2FAForm.delete(disable().url); }}>
                                            <Button variant="outline" type="submit" disabled={disable2FAForm.processing} className="h-8 px-4 rounded-sm text-xs font-medium border-destructive/20 text-destructive hover:bg-destructive/5 hover:text-destructive shadow-none">
                                                Disable 2FA
                                            </Button>
                                        </form>
                                        <TwoFactorRecoveryCodes
                                            recoveryCodesList={recoveryCodesList}
                                            fetchRecoveryCodes={fetchRecoveryCodes}
                                            errors={twoFactorErrors}
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        {hasSetupData ? (
                                            <Button onClick={() => setShowSetupModal(true)} size="sm" className="h-8 px-4 rounded-sm text-xs font-medium">
                                                <Key className="size-3.5 mr-2" /> Continue setup
                                            </Button>
                                        ) : (
                                            <form onSubmit={(e) => { e.preventDefault(); enable2FAForm.post(enable().url, { onSuccess: () => setShowSetupModal(true) }); }}>
                                                <Button type="submit" disabled={enable2FAForm.processing} size="sm" className="h-8 px-4 rounded-sm text-xs font-medium">
                                                    Enable 2FA
                                                </Button>
                                            </form>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <TwoFactorSetupModal
                            isOpen={showSetupModal}
                            onClose={() => setShowSetupModal(false)}
                            requiresConfirmation={requiresConfirmation}
                            twoFactorEnabled={twoFactorEnabled}
                            qrCodeSvg={qrCodeSvg}
                            manualSetupKey={manualSetupKey}
                            clearSetupData={clearSetupData}
                            fetchSetupData={fetchSetupData}
                            errors={twoFactorErrors}
                        />
                    </div>
                )}
            </div>
        </SettingsLayout>
    );
}
