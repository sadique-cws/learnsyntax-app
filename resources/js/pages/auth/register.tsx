import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { login } from '@/routes';
import { store as registerStore } from '@/routes/register';
import { CheckCircle2 } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        gender: '',
        qualification: '',
        college: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(registerStore().url, {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="font-sans selection:bg-primary/20">
            <Head title="Create Account" />

            <form onSubmit={submit} className="flex flex-col gap-5">
                {/* Personal & Education Info Combined in Grid */}
                <div className="grid gap-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                            <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Account Details</h2>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
                            <div className="col-span-2 grid gap-1.5">
                                <Label htmlFor="name" className="text-[11px] font-semibold text-muted-foreground">Full Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    required
                                    autoFocus
                                    placeholder="Rahul Sharma"
                                    className="h-8 rounded-sm border-border bg-background px-2.5 text-xs font-medium focus-visible:ring-primary/20 transition-all shadow-none"
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="email" className="text-[11px] font-semibold text-muted-foreground">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    required
                                    placeholder="name@mail.com"
                                    className="h-8 rounded-sm border-border bg-background px-2.5 text-xs font-medium focus-visible:ring-primary/20 transition-all shadow-none"
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="phone" className="text-[11px] font-semibold text-muted-foreground">Phone</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={data.phone}
                                    required
                                    placeholder="+91..."
                                    className="h-8 rounded-sm border-border bg-background px-2.5 text-xs font-medium focus-visible:ring-primary/20 transition-all shadow-none"
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="gender" className="text-[11px] font-semibold text-muted-foreground">Gender</Label>
                                <Select onValueChange={(val) => setData('gender', val)} value={data.gender}>
                                    <SelectTrigger className="h-8 rounded-sm border-border bg-background px-2.5 text-xs font-medium focus-visible:ring-primary/20 transition-all shadow-none">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-sm border-border">
                                        <SelectItem value="male" className="text-xs font-medium">Male</SelectItem>
                                        <SelectItem value="female" className="text-xs font-medium">Female</SelectItem>
                                        <SelectItem value="other" className="text-xs font-medium">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.gender} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="qualification" className="text-[11px] font-semibold text-muted-foreground">Degree</Label>
                                <Select onValueChange={(val) => setData('qualification', val)} value={data.qualification}>
                                    <SelectTrigger className="h-8 rounded-sm border-border bg-background px-2.5 text-xs font-medium focus-visible:ring-primary/20 transition-all shadow-none text-left">
                                        <SelectValue placeholder="Degree" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-sm border-border">
                                        <SelectItem value="High School" className="text-xs font-medium">10th/12th</SelectItem>
                                        <SelectItem value="Bachelor's Degree" className="text-xs font-medium">Bachelor's</SelectItem>
                                        <SelectItem value="Master's Degree" className="text-xs font-medium">Master's</SelectItem>
                                        <SelectItem value="Diploma" className="text-xs font-medium">Diploma</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.qualification} />
                            </div>

                            <div className="col-span-2 grid gap-1.5">
                                <Label htmlFor="college" className="text-[11px] font-semibold text-muted-foreground">College / University</Label>
                                <Input
                                    id="college"
                                    value={data.college}
                                    placeholder="Enter your institution"
                                    className="h-8 rounded-sm border-border bg-background px-2.5 text-xs font-medium focus-visible:ring-primary/20 transition-all shadow-none"
                                    onChange={(e) => setData('college', e.target.value)}
                                />
                                <InputError message={errors.college} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                            <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Security</h2>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-1.5">
                                <Label htmlFor="password" className="text-[11px] font-semibold text-muted-foreground">Password</Label>
                                <PasswordInput
                                    id="password"
                                    value={data.password}
                                    required
                                    placeholder="••••••••"
                                    className="h-8 rounded-sm border-border bg-background px-2.5 text-xs font-medium focus-visible:ring-primary/20 transition-all shadow-none"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="password_confirmation" className="text-[11px] font-semibold text-muted-foreground">Confirm</Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    value={data.password_confirmation}
                                    required
                                    placeholder="••••••••"
                                    className="h-8 rounded-sm border-border bg-background px-2.5 text-xs font-medium focus-visible:ring-primary/20 transition-all shadow-none"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 pt-1">
                    <Button
                        type="submit"
                        className="w-full h-9 rounded-sm bg-primary hover:bg-primary/90 font-semibold text-xs transition-colors shadow-none"
                        disabled={processing}
                    >
                        {processing ? <Spinner className="mr-2 h-3 w-3" /> : <CheckCircle2 className="mr-2 size-3.5" />}
                        Create Account
                    </Button>

                    <div className="text-center text-[11px] text-muted-foreground">
                        Already have an account?{' '}
                        <Link href={login().url} className="text-primary font-bold hover:underline underline-offset-4 transition-colors">
                            Sign In
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}

Register.layout = {
    title: 'Begin Your Journey',
    description: 'Join thousands of students learning modern syntax.',
};
