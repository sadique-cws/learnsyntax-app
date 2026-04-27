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
import { User, Mail, Phone, GraduationCap, Building2, Lock, CheckCircle2 } from 'lucide-react';

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

            <form onSubmit={submit} className="flex flex-col gap-10">
                {/* Section 1: Basic Information */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                        <User className="size-4 text-primary" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Personal Details</h2>
                    </div>
                    
                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-xs font-bold text-foreground ml-1">Full Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                required
                                autoFocus
                                placeholder="e.g. Rahul Sharma"
                                className="rounded-xl border-border bg-background h-11 px-4 shadow-none focus-visible:ring-primary/20 transition-all font-medium"
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-xs font-bold text-foreground ml-1">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                required
                                placeholder="rahul@example.com"
                                className="rounded-xl border-border bg-background h-11 px-4 shadow-none focus-visible:ring-primary/20 transition-all font-medium"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="phone" className="text-xs font-bold text-foreground ml-1">Phone Number</Label>
                                <div className="relative">
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={data.phone}
                                        required
                                        placeholder="+91..."
                                        className="rounded-xl border-border bg-background h-11 px-4 shadow-none focus-visible:ring-primary/20 transition-all font-medium"
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                </div>
                                <InputError message={errors.phone} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="gender" className="text-xs font-bold text-foreground ml-1">Gender</Label>
                                <Select onValueChange={(val) => setData('gender', val)} value={data.gender}>
                                    <SelectTrigger className="h-11 rounded-xl border-border bg-background px-4 shadow-none focus-visible:ring-primary/20 transition-all font-medium">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-border shadow-lg">
                                        <SelectItem value="male" className="font-medium">Male</SelectItem>
                                        <SelectItem value="female" className="font-medium">Female</SelectItem>
                                        <SelectItem value="other" className="font-medium">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.gender} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Education */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                        <GraduationCap className="size-4 text-primary" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Education</h2>
                    </div>
                    
                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="qualification" className="text-xs font-bold text-foreground ml-1">Current Qualification</Label>
                            <Select onValueChange={(val) => setData('qualification', val)} value={data.qualification}>
                                <SelectTrigger className="h-11 rounded-xl border-border bg-background px-4 shadow-none focus-visible:ring-primary/20 transition-all font-medium text-left">
                                    <SelectValue placeholder="What is your highest degree?" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border shadow-lg">
                                    <SelectItem value="High School" className="font-medium">High School (10th/12th)</SelectItem>
                                    <SelectItem value="Bachelor's Degree" className="font-medium">Bachelor's Degree (B.Tech/BCA/etc)</SelectItem>
                                    <SelectItem value="Master's Degree" className="font-medium">Master's Degree (M.Tech/MCA/etc)</SelectItem>
                                    <SelectItem value="Diploma" className="font-medium">Diploma</SelectItem>
                                    <SelectItem value="Other" className="font-medium">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.qualification} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="college" className="text-xs font-bold text-foreground ml-1">College / University Name</Label>
                            <Input
                                id="college"
                                value={data.college}
                                placeholder="Where did you study?"
                                className="rounded-xl border-border bg-background h-11 px-4 shadow-none focus-visible:ring-primary/20 transition-all font-medium"
                                onChange={(e) => setData('college', e.target.value)}
                            />
                            <InputError message={errors.college} />
                        </div>
                    </div>
                </div>

                {/* Section 3: Security */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                        <Lock className="size-4 text-primary" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Security</h2>
                    </div>
                    
                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-xs font-bold text-foreground ml-1">Create Password</Label>
                            <PasswordInput
                                id="password"
                                value={data.password}
                                required
                                placeholder="Choose a strong password"
                                className="rounded-xl border-border bg-background h-11 px-4 shadow-none focus-visible:ring-primary/20 transition-all font-medium"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation" className="text-xs font-bold text-foreground ml-1">Confirm Password</Label>
                            <PasswordInput
                                id="password_confirmation"
                                value={data.password_confirmation}
                                required
                                placeholder="Repeat your password"
                                className="rounded-xl border-border bg-background h-11 px-4 shadow-none focus-visible:ring-primary/20 transition-all font-medium"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <Button
                        type="submit"
                        className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-black shadow-none uppercase tracking-widest text-xs transition-all active:scale-[0.98]"
                        disabled={processing}
                    >
                        {processing ? <Spinner className="mr-2" /> : <CheckCircle2 className="mr-2 size-4" />}
                        Create My Account
                    </Button>

                    <div className="text-center text-xs font-bold text-muted-foreground">
                        Already have an account?{' '}
                        <Link href={login().url} className="text-primary hover:underline">
                            Log In
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}

Register.layout = {
    title: 'Begin Your Journey',
    description: 'Join thousands of students learning modern syntax on our platform.',
};
