import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm();

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(send().url);
    };

    return (
        <>
            <Head title="Verify Email" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-[11px] font-medium text-emerald-600 bg-emerald-50 py-2 px-3 rounded-sm border border-emerald-100">
                    A new verification link has been sent to your email address.
                </div>
            )}

            <div className="flex flex-col gap-4 text-center">
                <form onSubmit={submit}>
                    <Button disabled={processing} className="w-full h-9 rounded-sm bg-primary text-white hover:bg-primary/90 font-medium text-sm shadow-none transition-colors">
                        {processing ? <Spinner className="mr-2 h-4 w-4" /> : 'Resend Verification Email'}
                    </Button>
                </form>

                <Link
                    href={logout().url}
                    method="post"
                    as="button"
                    className="text-xs text-muted-foreground hover:text-foreground font-medium transition-colors underline underline-offset-4"
                >
                    Sign Out
                </Link>
            </div>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Verify Your Email',
    description: 'Please verify your email address by clicking on the link we just sent to your inbox.',
};
