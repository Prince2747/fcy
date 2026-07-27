import { Head, usePage } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store } from '@/routes/login';

type Props = {
    status?: string;
};

type LoginPageProps = {
    csrfToken: string;
    errors: {
        username?: string;
        password?: string;
    };
};

export default function Login({ status }: Props) {
    const { csrfToken, errors } = usePage<LoginPageProps>().props;

    return (
        <>
            <Head title="Log in" />

            <Card className="w-full">
                <CardContent className="pt-6">
                    <form
                        action={store().url}
                        method="post"
                        className="flex flex-col gap-6"
                    >
                        <input type="hidden" name="_token" value={csrfToken} />
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    name="username"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="username"
                                    placeholder="Username"
                                    defaultValue={status ? '' : undefined}
                                />
                                <InputError message={errors.username} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox id="remember" name="remember" tabIndex={3} />
                                <Label htmlFor="remember">Remember me</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full"
                                tabIndex={4}
                                data-test="login-button"
                            >
                                Log in
                            </Button>
                        </div>
                    </form>

                    {status && (
                        <div className="mb-4 text-center text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your username and password below to log in',
};
