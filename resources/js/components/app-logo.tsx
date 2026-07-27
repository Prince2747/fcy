import { usePage } from '@inertiajs/react';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-white dark:bg-zinc-800">
                <img
                    src="/favicon.png"
                    alt="Logo"
                    className="size-5 object-contain"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-medium">
                    {name}
                </span>
            </div>
        </>
    );
}
