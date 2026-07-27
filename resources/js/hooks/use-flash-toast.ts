import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

type FlashProps = {
    flash?: {
        toast?: FlashToast;
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
    };
};

export function useFlashToast(): void {
    const { flash } = usePage<FlashProps>().props;
    const lastToast = useRef<string | null>(null);

    useEffect(() => {
        if (!flash) {
            return;
        }

        if (flash.toast?.message) {
            const key = `${flash.toast.type}:${flash.toast.message}`;

            if (lastToast.current === key) {
                return;
            }

            lastToast.current = key;

            toast[flash.toast.type](flash.toast.message);

            return;
        }

        if (flash.success) {
            const key = `success:${flash.success}`;

            if (lastToast.current !== key) {
                lastToast.current = key;
                toast.success(flash.success);
            }

            return;
        }

        if (flash.error) {
            const key = `error:${flash.error}`;

            if (lastToast.current !== key) {
                lastToast.current = key;
                toast.error(flash.error);
            }

            return;
        }

        if (flash.warning) {
            const key = `warning:${flash.warning}`;

            if (lastToast.current !== key) {
                lastToast.current = key;
                toast.warning(flash.warning);
            }

            return;
        }

        if (flash.info) {
            const key = `info:${flash.info}`;

            if (lastToast.current !== key) {
                lastToast.current = key;
                toast.info(flash.info);
            }
        }
    }, [
        flash?.toast,
        flash?.success,
        flash?.error,
        flash?.warning,
        flash?.info,
    ]);
}