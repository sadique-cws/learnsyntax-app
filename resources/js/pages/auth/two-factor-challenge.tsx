import { Head, setLayoutProps, useForm } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import { store } from '@/routes/two-factor/login';
import { Spinner } from '@/components/ui/spinner';

export default function TwoFactorChallenge() {
    const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);

    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        code: '',
        recovery_code: '',
    });

    const authConfigContent = useMemo<{
        title: string;
        description: string;
        toggleText: string;
    }>(() => {
        if (showRecoveryInput) {
            return {
                title: 'Recovery Code',
                description:
                    'Please confirm access to your account by entering one of your emergency recovery codes.',
                toggleText: 'Use authentication code',
            };
        }

        return {
            title: 'Authentication Code',
            description:
                'Enter the 6-digit code provided by your authenticator app.',
            toggleText: 'Use a recovery code',
        };
    }, [showRecoveryInput]);

    setLayoutProps({
        title: authConfigContent.title,
        description: authConfigContent.description,
    });

    const toggleRecoveryMode = (): void => {
        setShowRecoveryInput(!showRecoveryInput);
        clearErrors();
        reset();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store().url);
    };

    return (
        <>
            <Head title="Two-Factor Authentication" />

            <div className="flex flex-col gap-5">
                <form onSubmit={submit} className="flex flex-col gap-5">
                    {showRecoveryInput ? (
                        <div className="grid gap-1.5">
                            <Input
                                name="recovery_code"
                                value={data.recovery_code}
                                onChange={e => setData('recovery_code', e.target.value)}
                                type="text"
                                placeholder="Enter recovery code"
                                autoFocus={showRecoveryInput}
                                required
                                className="h-9 rounded-sm border-border bg-background px-3 text-sm font-medium focus-visible:ring-primary/20 transition-all shadow-none"
                            />
                            <InputError message={errors.recovery_code} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-3">
                            <InputOTP
                                name="code"
                                maxLength={OTP_MAX_LENGTH}
                                value={data.code}
                                onChange={(value) => setData('code', value)}
                                disabled={processing}
                                pattern={REGEXP_ONLY_DIGITS}
                                className="gap-2"
                            >
                                <InputOTPGroup className="gap-1.5">
                                    {Array.from(
                                        { length: OTP_MAX_LENGTH },
                                        (_, index) => (
                                            <InputOTPSlot
                                                key={index}
                                                index={index}
                                                className="h-10 w-10 rounded-sm border-border"
                                            />
                                        ),
                                    )}
                                </InputOTPGroup>
                            </InputOTP>
                            <InputError message={errors.code} />
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full h-9 rounded-sm bg-primary text-white hover:bg-primary/90 font-medium text-sm shadow-none transition-colors"
                        disabled={processing}
                    >
                        {processing ? <Spinner className="mr-2 h-4 w-4" /> : 'Continue'}
                    </Button>

                    <div className="text-center">
                        <button
                            type="button"
                            className="text-xs text-muted-foreground hover:text-foreground font-medium transition-colors underline underline-offset-4"
                            onClick={toggleRecoveryMode}
                        >
                            {authConfigContent.toggleText}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
